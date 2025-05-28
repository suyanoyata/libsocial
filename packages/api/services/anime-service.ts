import { TRPCError } from "@trpc/server"
import axios from "axios"
import { z } from "zod"
import { pageLimit } from "~/const/db"

import { api } from "~/lib/axios"
import { db } from "~/lib/db"
import { Logger } from "~/lib/logger"

import { translate } from "~/services/translate.service"
import { UploadService } from "~/services/upload-service"
import {
  Anime,
  AnimeEpisode,
  AnimeEpisodeSchema,
  CatalogSearchFormData
} from "~/types/zod"

const AnimeLogger = new Logger("AnimeService")

class Service {
  public async getAnime(slug_url: string) {
    const data = await db.anime
      .findFirstOrThrow({
        where: {
          slug_url
        },
        include: {
          cover: true,
          genres: true,
          ageRestriction: true,
          background: true
        }
      })
      .catch(() => {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "This content was not found"
        })
      })

    return {
      ...data,
      isLicensed: false
    }
  }

  public async getRemoteEpisodes(slug_url: string) {
    const {
      data: { data }
    } = await api.get(`/episodes?anime_id=${slug_url}`)

    return z.array(AnimeEpisodeSchema).parse(data)
  }

  public async createAnime(data: Anime) {
    const eng_name = data.eng_name ?? data.name
    const summary = await translate(data.summary!)

    const {
      data: { data: _data }
    } = await axios.get(`https://api.jikan.moe/v4/anime?q=${data.eng_name}`).catch(() => {
      throw new TRPCError({
        code: "CONFLICT",
        message: "Couldn't fetch poster from jikan API"
      })
    })

    if (_data.length == 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Couldn't fetch poster from jikan API"
      })
    }

    const poster = {
      default: _data[0].images.jpg.large_image_url,
      thumbnail: _data[0].images.jpg.image_url
    }

    const uploadService = new UploadService(data.slug_url)

    await uploadService.create()

    await uploadService.upload("poster", poster.default)
    await uploadService.upload("thumbnail", poster.thumbnail)

    await db.genre.createMany({
      data: data.genres,
      skipDuplicates: true
    })

    await db.anime
      .create({
        data: {
          id: data.id,
          name: data.name,
          slug_url: data.slug_url,
          eng_name,
          model: data.model,
          otherNames: data.otherNames,
          summary,
          cover: {
            create: {
              default: uploadService.get("poster"),
              thumbnail: uploadService.get("thumbnail")
            }
          },
          ageRestriction: {
            connectOrCreate: {
              where: {
                id: data.ageRestriction.id
              },
              create: {
                id: data.ageRestriction.id,
                label: data.ageRestriction.label
              }
            }
          },
          site: data.site,
          genres: {
            connectOrCreate: data.genres.map((genre) => ({
              where: {
                id: genre.id
              },
              create: {
                id: genre.id,
                name: genre.name
              }
            }))
          },
          background: {
            create: {
              url: data.background.url
            }
          }
        }
      })
      .catch((error) => {
        AnimeLogger.error("Failed to create anime record", error)
      })

    return this.getAnime(data.slug_url)
  }

  public async createEpisodesFromRemote(slug_url: string) {
    const data: AnimeEpisode[] = await this.getRemoteEpisodes(slug_url)
    const anime = await this.getAnime(slug_url)

    if (!anime) {
      return null
    }

    return await db.$transaction([
      db.episode.createMany({
        data: data.map((episode) => ({
          ...episode,
          slug_url: anime.slug_url
        })),
        skipDuplicates: true
      })
    ])
  }

  public async getTitles(page?: string) {
    const p = (page != undefined ? Number(page) - 1 : 0) * pageLimit
    const nextPage = (page != undefined ? Number(page) : 0) * pageLimit

    const data = await db.anime.findMany({
      skip: p,
      take: pageLimit,
      orderBy: {
        id: "asc"
      },
      include: {
        cover: true,
        background: true,
        genres: true,
        ageRestriction: true
      }
    })

    const nextPageData = await db.manga.count({
      skip: nextPage,
      take: pageLimit,
      orderBy: {
        id: "asc"
      }
    })

    return {
      data,
      meta: {
        current_page: page ? Number(page) : 1,
        per_page: pageLimit,
        has_next_page: nextPageData > 1
      }
    }
  }

  public async getAnimeWithQueries(params: CatalogSearchFormData) {
    const p = (params.cursor - 1) * pageLimit
    const nextPage = params.cursor * pageLimit

    const animeFilters =
      params.genres?.map((genreId) => ({
        genres: {
          some: {
            id: genreId
          }
        }
      })) ?? []

    const nextPageData = await db.anime.count({
      skip: nextPage,
      take: pageLimit,
      orderBy: {
        id: "asc"
      }
    })

    return {
      data: await db.anime.findMany({
        skip: p,
        take: pageLimit,
        include: {
          cover: true,
          ageRestriction: {
            omit: {
              site_ids: true
            }
          },
          genres: {
            omit: {
              site_ids: true
            }
          }
        },
        where: {
          model: "anime",
          AND: [
            ...animeFilters,
            {
              OR: [
                {
                  name: {
                    mode: "insensitive",
                    contains: params.q
                  }
                },
                {
                  eng_name: {
                    mode: "insensitive",
                    contains: params.q
                  }
                }
              ]
            }
          ]
        }
      }),
      meta: {
        current_page: params.cursor,
        per_page: pageLimit,
        has_next_page: nextPageData > 1
      }
    }
  }
}

export const animeService = new Service()
