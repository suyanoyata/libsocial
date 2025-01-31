export type BaseTitle = {
  ageRestriction: {
    id: number;
    label: string;
  };
  id: number;
  name: string;
  rus_name?: string;
  eng_name?: string;
  slug: string;
  slug_url: string;
  rating: {
    average: number;
    averageFormated: string;
    votesFormated: string;
  };
  cover: {
    thumbnail: string;
    default: string;
  };
  site: number;
  model: string;
};

export type Genre = {
  id: number;
  name: string;
  adult: boolean;
};

export interface Title extends BaseTitle {
  background: {
    url: string;
  };
  otherNames: string[];
  summary: string;
  genres: Genre[];
  tags: string[];
  type_id: number;
  caution: string;
  views: number;
  close_view: number;
  rate_avg: number;
  rate: number;
  teams: string[];
  user: string;
  franchise: string;
  authors: string[];
  publisher: string;
  userRating: number;
  moderated: boolean;
  metadata: {
    count: number;
    close_comments: boolean;
  };
  chap_count: number;
  status_id: number;
  artists: string[];
  format: string;
}
