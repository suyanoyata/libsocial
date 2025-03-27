import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { biggest } from "@/lib/utils";
import { QueryClient } from "@tanstack/react-query";
import { Title } from "@/features/shared/types/title";
import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";

export type LastWatchItem = {
  slug_url: string;
  title: string;
  lastWatchedEpisode: number;
  watchedEpisodeIndexes: number[];
  overallEpisodes: number;
  cover: {
    default: string;
  };
  hide: boolean;
};

export interface WatchTrackerStore {
  lastWatchItems: LastWatchItem[];
  add: (client: QueryClient, slug_url: LastWatchItem["slug_url"], index: number) => void;
  get: (slug_url: string) => LastWatchItem | undefined;
  isEpisodeExists: (slug_url: string, episodeIndex: number) => boolean;
  removeEpisode: (slug_url: string, episodeIndex: number) => void;
  remove: (slug_url: string) => void;
  hide: (slug_url: string) => void;
  reset: () => void;
}

export const useWatchTracker = create<WatchTrackerStore>()(
  persist(
    (set, get) => ({
      lastWatchItems: [],
      add: (client, slug_url, index) => {
        set((state) => {
          const title = client.getQueryData<Title>(["title-info", slug_url, "5"]);
          const episodes = client.getQueryData<TitleEpisodeBase[]>(["episodes", slug_url]);

          if (!title || !episodes) return state;

          const exists = state.lastWatchItems.find((value) => value.slug_url == title.slug_url);

          const titleMeta = {
            cover: title.cover,
            overallEpisodes: episodes?.length ?? 0,
            slug_url: title.slug_url,
            title: title.eng_name ?? title.name,
          };

          if (exists && title) {
            return {
              lastWatchItems: state.lastWatchItems.map((item) => {
                if (item.slug_url === title.slug_url) {
                  const maxIndex = biggest([...item.watchedEpisodeIndexes, index]);

                  return {
                    ...item,
                    ...titleMeta,
                    hide: false,
                    watchedEpisodeIndexes: [...item.watchedEpisodeIndexes, index],
                    lastWatchedEpisode: maxIndex,
                  };
                } else return item;
              }),
            };
          }

          return {
            lastWatchItems: [
              {
                ...titleMeta,
                hide: false,
                lastWatchedEpisode: index,
                watchedEpisodeIndexes: [index],
              },
              ...state.lastWatchItems,
            ],
          };
        });
      },
      get: (slug_url) => {
        return get().lastWatchItems.find((item) => item.slug_url == slug_url);
      },
      isEpisodeExists: (slug_url, episodeIndex): boolean => {
        const items = get().lastWatchItems;

        const item = items.find((item) => slug_url == item.slug_url);

        return item?.watchedEpisodeIndexes.includes(episodeIndex) ?? false;
      },
      removeEpisode: (slug_url, episodeIndex) => {
        set((state) => {
          const exists = state.lastWatchItems.find((value) => value.slug_url == slug_url);

          if (!exists) return state;

          const filtered = state.lastWatchItems.filter((value) => value.slug_url !== slug_url);

          const watchedEpisodeIndexes = exists.watchedEpisodeIndexes.filter(
            (index) => index !== episodeIndex
          );
          const lastWatchedEpisode = biggest(watchedEpisodeIndexes);

          return {
            lastWatchItems: [
              ...filtered,
              {
                ...exists,
                lastWatchedEpisode,
                watchedEpisodeIndexes,
              },
            ],
          };
        });
      },
      remove: (slug_url) => {
        set((state) => {
          const exists = state.lastWatchItems.find((value) => value.slug_url == slug_url);

          if (!exists) return state;

          const filtered = state.lastWatchItems.filter((value) => value.slug_url !== slug_url);

          return {
            lastWatchItems: [...filtered],
          };
        });
      },
      hide: (slug_url) => {
        set((state) => {
          const exists = state.lastWatchItems.find((value) => value.slug_url == slug_url);

          if (!exists) return state;

          const filtered = state.lastWatchItems.filter((value) => value.slug_url !== slug_url);

          return {
            lastWatchItems: [
              ...filtered,
              {
                ...exists,
                hide: true,
              },
            ],
          };
        });
      },
      reset: () => {
        zustandStorage.removeItem("libsocial.client.watch-tracker-store"),
          set(() => ({ lastWatchItems: [] }));
      },
    }),
    {
      name: "libsocial.client.watch-tracker-store",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
