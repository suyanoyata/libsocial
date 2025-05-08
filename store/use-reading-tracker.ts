import { zustandStorage } from "@/lib/persistent-zustand-storage"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

export type LastReadItem = {
  slug_url: string
  title: string
  lastReadChapter: number
  overallChapters: number
  cover: {
    default: string
  }
  site: number
  scrollTo: number
  hide: boolean
}

export interface ApplicationProperties {
  lastReadItems: LastReadItem[]
  addItem: (lastReadItem: Omit<LastReadItem, "hide">) => void
  get: (slug_url: string) => LastReadItem | undefined
  removeItem: (slug_url: string) => void
  reset: () => void
  updateLastReadChapter: (slug_url: string, chapterIndex: number) => void
}

export const useReadingTracker = create<ApplicationProperties>()(
  persist(
    (set, get) => ({
      lastReadItems: [],

      addItem: (lastReadItem) =>
        set((state) => {
          const newItem = {
            ...lastReadItem,
            lastReadChapter: lastReadItem.lastReadChapter + 1,
            hide: false,
          }
          const existingTitle = state.lastReadItems.find(
            (item) => item.slug_url == lastReadItem.slug_url
          )

          if (existingTitle) {
            if (
              existingTitle.lastReadChapter > newItem.lastReadChapter ||
              (existingTitle.lastReadChapter == newItem.lastReadChapter &&
                existingTitle.scrollTo > newItem.scrollTo)
            ) {
              return { lastReadItems: state.lastReadItems }
            }

            const filtered = state.lastReadItems.filter(
              (item) => item.slug_url !== lastReadItem.slug_url,
            )

            filtered.unshift(newItem)

            return { lastReadItems: filtered }
          }

          return { lastReadItems: [newItem, ...state.lastReadItems] }
        }),

      get: (slug_url): LastReadItem | undefined => {
        const items = get().lastReadItems

        return items.find((item) => slug_url == item.slug_url)
      },

      removeItem: (slug_url) =>
        set((state) => {
          return {
            lastReadItems: state.lastReadItems.map((item) =>
              item.slug_url == slug_url ? { ...item, hide: true } : item
            ),
          }
        }),

      reset: () => {
        zustandStorage.removeItem("libsocial.client.title-storage"),
          set(() => ({ lastReadItems: [] }))
      },

      updateLastReadChapter(slug_url, chapterIndex) {
        set((state) => {
          const lastReadItems = state.lastReadItems.map((item) => {
            if (item.slug_url === slug_url) {
              return {
                ...item,
                lastReadChapter: chapterIndex + 1,
                hide: false,
              }
            }
            return item
          })
          return { lastReadItems }
        })
      },
    }),
    {
      name: "libsocial.client.title-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
)
