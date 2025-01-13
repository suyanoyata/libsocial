import { FilterConstantsStore } from "@/types/filters";
import { create } from "zustand";

interface FiltersStore {
  filters: FilterConstantsStore;
  setFilters: (filters: FilterConstantsStore) => void;
}

export const useFiltersStore = create<FiltersStore>((set) => ({
  filters: {
    ageRestriction: [],
    genres: [],
    scanlateStatus: [],
    format: [],
    status: [],
    tags: [],
    types: [],
  },
  setFilters: (filters) => set({ filters }),
}));
