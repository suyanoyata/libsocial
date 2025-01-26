import { create } from "zustand";

interface FilterStoreProperties {
  genres: number[];
  addGenre: (genreId: number) => void;
  resetGenresWithId: (genreId: number) => void;
  removeGenre: (genreId: number) => void;
}

export const useFilterStore = create<FilterStoreProperties>((set, get) => ({
  genres: [],
  addGenre: (genreId) => {
    set((state) => {
      if (state.genres.includes(genreId)) return state;

      return {
        genres: [...state.genres, genreId],
      };
    });
  },
  resetGenresWithId: (genreId) => {
    set(() => ({ genres: [genreId] }));
  },
  removeGenre: (genreId) => {
    const filteredGenres = get().genres.filter((id) => id !== genreId);
    return set(() => ({
      genres: filteredGenres,
    }));
  },
}));
