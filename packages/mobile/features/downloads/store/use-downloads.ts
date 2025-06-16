import type { Title } from "api/router/titleRouter"
import { deleteAsync, documentDirectory, readDirectoryAsync } from "expo-file-system"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter"
import { zustandStorage } from "@/lib/persistent-zustand-storage"

export type DownloadedChapter = { title: Title; chapter: ReaderChapter }

export interface DownloadsStore {
  items: DownloadedChapter[]
  get: (slug_url: string, volume: string, chapter: string) => DownloadedChapter | null
  deleteChapter: (slug_url: string, volume: string, chapter: string) => void
  isChapterDownloaded: (slug_url: string, volume: string, chapter: string) => boolean
  add: (title: Title, chapter: ReaderChapter) => void
  clear: () => void
}

export const useDownloads = create<DownloadsStore>()(
  persist(
    (set, get) => ({
      items: [],
      get: (slug_url, volume, chapter) => {
        const item = get().items.find(
          (state) =>
            state.title.slug_url === slug_url &&
            state.chapter.volume === volume &&
            state.chapter.number === chapter
        )

        return item ? item : null
      },
      deleteChapter: async (slug_url, volume, chapter) => {
        if (!documentDirectory) return

        await deleteAsync(`${documentDirectory}${slug_url}/v${volume}-c${chapter}`, {
          idempotent: true
        })

        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.chapter.number == chapter &&
                item.chapter.volume == volume &&
                item.title.slug_url == slug_url
              )
          )
        }))
      },
      isChapterDownloaded: (slug_url, volume, chapter) => {
        const item = get().items.find(
          (state) =>
            state.title.slug_url === slug_url &&
            state.chapter.volume === volume &&
            state.chapter.number === chapter
        )

        return !!item
      },
      add: (title, chapter) => {
        set((state) => {
          return {
            items: [...state.items, { title, chapter }]
          }
        })
      },
      clear: async () => {
        if (!documentDirectory) return

        const directory = (await readDirectoryAsync(documentDirectory)).filter(
          (dirname) => dirname !== "mmkv"
        )

        await Promise.all(
          directory.map(async (dirname) => {
            await deleteAsync(`${documentDirectory}${dirname}`)
          })
        )

        set({ items: [] })
      }
    }),
    {
      name: "libsocial.client.downloads",
      storage: createJSONStorage(() => zustandStorage)
    }
  )
)
