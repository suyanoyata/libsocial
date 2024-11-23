export type RelatedTitle = {
  media: {
    id: number;
    name: string;
    rus_name: string;
    slug_url: string;
    site: number;
    cover: {
      default: string;
    };
    status: {
      label: string;
    };
    type: {
      label: string;
    };
    model: string;
  };
  related_type: {
    id: 2 | 3 | 4 | 10 | 11 | 12;
    label: string;
  };
  id: number;
};

export type SimilarTitle = {
  id: 231270 | 231320 | "default";
  similar: string;
} & RelatedTitle;
