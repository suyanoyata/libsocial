import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { zustandStorage } from "@/lib/persistent-zustand-storage";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { Title } from "@/features/shared/types/title";
import { deleteAsync, documentDirectory, readDirectoryAsync } from "expo-file-system";

type DownloadedChapter = { title: Title; chapter: ReaderChapter };

export interface DownloadsStore {
  items: DownloadedChapter[];
  get: (slug_url: string, volume: string, chapter: string) => DownloadedChapter | null;
  add: (title: Title, chapter: ReaderChapter) => void;
  clear: () => void;
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
        );

        return item ? item : null;
      },
      add: (title, chapter) => {
        set((state) => {
          if (state.items.length >= 5) {
            state.items.shift();
          }

          return {
            items: [...state.items, { title, chapter }],
          };
        });
      },
      clear: async () => {
        if (!documentDirectory) return;

        const directory = (await readDirectoryAsync(documentDirectory)).filter(
          (dirname) => dirname !== "mmkv"
        );

        await Promise.all(
          directory.map(async (dirname) => {
            await deleteAsync(`${documentDirectory}${dirname}`);
          })
        );

        set({ items: [] });
      },
    }),
    {
      name: "libsocial.client.downloads",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
