import { create } from "zustand";

interface FilterStoreProperties {
  genres: number[];
  caution: number[];
  handleAgeRestrictionPress: (value: number) => void;
  search: string;
  setSearch: (value: string) => void;
  addGenre: (genreId: number) => void;
  resetGenresWithId: (genreId: number) => void;
  removeGenre: (genreId: number) => void;
}

export const useFilterStore = create<FilterStoreProperties>((set, get) => ({
  genres: [],
  caution: [],
  search: "",
  setSearch: (search: string) => set({ search }),
  addGenre: (genreId) => {
    set((state) => {
      if (state.genres.includes(genreId)) return state;

      return {
        genres: [...state.genres, genreId],
      };
    });
  },
  handleAgeRestrictionPress: (ageRestrictionId) => {
    set((state) => {
      if (state.caution.includes(ageRestrictionId)) {
        const filteredAgeRestrictions = get().genres.filter(
          (id) => id !== ageRestrictionId
        );
        set(() => ({
          caution: filteredAgeRestrictions,
        }));

        return { caution: [...filteredAgeRestrictions] };
      }

      return {
        caution: [...state.caution, ageRestrictionId],
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
