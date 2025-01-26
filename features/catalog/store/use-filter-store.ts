import { create } from "zustand";

interface FilterStoreProperties {
  genres: number[];
  addGenre: (genreId: number) => void;
  removeGenre: (genreId: number) => void;
}

export const useFilterStore = create<FilterStoreProperties>((set, get) => ({
  genres: [],
  addGenre: (genreId) => {
    set((state) => ({
      genres: [...state.genres, genreId],
    }));
  },
  removeGenre: (genreId) => {
    const filteredGenres = get().genres.filter((id) => id !== genreId);
    return set(() => ({
      genres: filteredGenres,
    }));
  },
}));
