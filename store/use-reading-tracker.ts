import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type LastReadItem = {
  slug_url: string;
  title: string;
  lastReadChapter: number;
  overallChapters: number;
  cover: {
    default: string;
  };
  site: number;
  scrollTo: number;
};

export interface ApplicationProperties {
  lastReadItems: LastReadItem[];
  addItem: (lastReadItem: LastReadItem) => void;
  get: (slug_url: string) => void;
  removeItem: (slug_url: string) => void;
  reset: () => void;
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
          };
          const existingTitle = state.lastReadItems.find(
            (item) => item.slug_url == lastReadItem.slug_url
          );

          if (existingTitle) {
            if (
              existingTitle.lastReadChapter > newItem.lastReadChapter ||
              (existingTitle.lastReadChapter == newItem.lastReadChapter &&
                existingTitle.scrollTo > newItem.scrollTo)
            ) {
              return { lastReadItems: state.lastReadItems };
            }

            const filtered = state.lastReadItems.filter(
              (item) => item.slug_url !== lastReadItem.slug_url
            );

            filtered.unshift(newItem);

            return { lastReadItems: filtered };
          }

          return { lastReadItems: [newItem, ...state.lastReadItems] };
        }),

      get: (slug_url: string): LastReadItem | undefined => {
        const items = get().lastReadItems;

        return items.find((item) => slug_url == item.slug_url);
      },

      removeItem: (slug_url) =>
        set((state) => {
          const filterTitles = state.lastReadItems.filter(
            (title) => title.slug_url != slug_url
          );
          return { lastReadItems: filterTitles };
        }),

      reset: () => {
        zustandStorage.removeItem("libsocial.client.title-storage"),
          set(() => ({ lastReadItems: [] }));
      },
    }),
    {
      name: "libsocial.client.title-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
