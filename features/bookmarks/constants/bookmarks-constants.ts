export const bookmarksConstants: BookmarkConstant[] = [
  {
    status: 1,
    site_ids: [1],
  },
  {
    status: 2,
    site_ids: [1],
  },
  {
    status: 3,
    site_ids: [1],
  },
  {
    status: 4,
    site_ids: [1],
  },
  {
    status: 5,
    site_ids: [1],
  },
  {
    status: 21,
    site_ids: [5],
  },
  {
    status: 22,
    site_ids: [5],
  },
  {
    status: 23,
    site_ids: [5],
  },
  {
    status: 24,
    site_ids: [5],
  },
  {
    status: 25,
    site_ids: [5],
  },
  {
    status: 26,
    site_ids: [5],
  },
  {
    status: 27,
    site_ids: [5],
  },
];

type BookmarkConstant = {
  status: 1 | 2 | 3 | 4 | 5 | 21 | 22 | 23 | 24 | 25 | 26 | 27;
  site_ids: number[];
};
