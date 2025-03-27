import { createStore, StoreApi, useStore } from "zustand";

import { createContext, useContext } from "react";

interface AnimeStore {
  selectedEpisodeIndex: number;
  id: number;
  slug_url: string;
  selectedQuality: number;
  setEpisodeIndex: (episodeIndex: number) => void;
  setSlugUrl: (slug: string) => void;
}

export const createAnimeStore = (): StoreApi<AnimeStore> =>
  createStore<AnimeStore>((set) => ({
    selectedEpisodeIndex: 0,
    id: 0,
    slug_url: "",
    selectedQuality: 0,
    setEpisodeIndex: (episodeIndex) => set({ selectedEpisodeIndex: episodeIndex }),
    setSlugUrl: (slug_url) => set({ slug_url }),
  }));

const AnimeStoreContext = createContext<StoreApi<AnimeStore> | null>(null);

export const AnimeStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = createAnimeStore();
  return <AnimeStoreContext.Provider value={store}>{children}</AnimeStoreContext.Provider>;
};

export const store = <T,>(selector: (state: AnimeStore) => T): T => {
  const store = useContext(AnimeStoreContext);
  if (!store) {
    throw new Error("useAnimeStore must be used within AnimeStoreProvider");
  }
  return useStore(store, selector);
};

export const useAnimeStore = () => store((state) => state);
