export type BasicFilter = {
  id: number;
  name?: string;
  site_ids: number[];
  label?: string;
};

export type FiltersConstants = {
  genres: BasicFilter[];
  tags: BasicFilter[];
  types: BasicFilter[];
  status: BasicFilter[];
  scanlateStatus: BasicFilter[];
  format: BasicFilter[];
  ageRestriction: BasicFilter[];
};

export type FilterConstantsStore = {
  genres: number[];
  tags: number[];
  types: number[];
  status: number[];
  scanlateStatus: number[];
  format: number[];
  ageRestriction: number[];
};

export type FilterKeys =
  | "genres"
  | "tags"
  | "types"
  | "status"
  | "scanlateStatus"
  | "format"
  | "ageRestriction";
