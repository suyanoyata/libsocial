import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type TitleReadChapter = {
  slug_url: string;
  chapters: number[];
};

export interface TitleReadChapterProperties {
  titleReadChapters: TitleReadChapter[];
  add: (slug_url: string, chapterIndex: number) => void;
  get: (slug_url: string, chapterIndex: number) => void;
}

export const useTitleReadChapter = create<TitleReadChapterProperties>()(
  persist(
    (set, get) => ({
      titleReadChapters: [],

      add: (slug_url: string, chapterIndex: number) =>
        set((state) => {
          const exists = state.titleReadChapters.find(
            (value) => value.slug_url == slug_url
          );

          if (!exists) {
            return {
              titleReadChapters: [
                ...state.titleReadChapters,
                {
                  slug_url,
                  chapters: [chapterIndex],
                },
              ],
            };
          }

          if (exists.chapters.includes(chapterIndex)) return state;

          const filtered = state.titleReadChapters.filter(
            (value) => value.slug_url !== slug_url
          );

          return {
            titleReadChapters: [
              ...filtered,
              {
                slug_url,
                chapters: [...exists.chapters, chapterIndex],
              },
            ],
          };
        }),

      get: (slug_url, chapterIndex): boolean => {
        const items = get().titleReadChapters;

        const item = items.find((item) => slug_url == item.slug_url);

        return item?.chapters.includes(chapterIndex) ?? false;
      },
    }),
    {
      name: "libsocial.client.chapter-tracker-storage",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
