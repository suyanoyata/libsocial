import { db } from "~/lib/db";
import { posthog } from "~/lib/posthog";

class Service {
  public async getEpisodes(slug_url: string) {
    // check if anime exists
    await db.episode.findFirstOrThrow({
      where: {
        slug_url,
      },
    });

    const shouldDisplayEmpty = await posthog.isFeatureEnabled(
      "SHOULD_DISPLAY_EMPTY_CONTENT",
      "api",
      {
        personProperties: {
          slug_url,
          type: "anime",
        },
      }
    );

    if (shouldDisplayEmpty) {
      const anime = await db.episode.findMany({
        where: {
          slug_url,
        },
        orderBy: {
          item_number: "asc",
        },
      });

      return anime;
    }

    const anime = await db.episode.findMany({
      where: {
        slug_url,
        source: {
          not: null,
        },
      },
      orderBy: {
        item_number: "asc",
      },
    });

    return anime;
  }

  public async getEpisode(episodeId: number) {
    return await db.episode.findFirstOrThrow({
      where: {
        id: episodeId,
      },
    });
  }
}

export const episodesService = new Service();
