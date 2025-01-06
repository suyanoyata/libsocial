import { create } from "zustand";

export type AvailableSorting =
  | ""
  | "rate_avg"
  | "views"
  | "chap_count"
  | "releaseDate"
  | "last_chapter_at"
  | "created_at"
  | "name";

interface SortingStore {
  sortBy: AvailableSorting;
  sort_type: "asc" | "desc";
  setSortBy: (filter: AvailableSorting) => void;
  setSortType: (type: "asc" | "desc") => void;
}

export const useSortingStore = create<SortingStore>((set) => ({
  sortBy: "rate_avg",
  sort_type: "desc",
  setSortType: (sort_type) => set({ sort_type }),
  setSortBy: (sortBy) => set({ sortBy }),
}));
