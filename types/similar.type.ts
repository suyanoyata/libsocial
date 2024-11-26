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
    id: 2 | 3 | 4 | 6 | 10 | 11 | 12;
    label: string;
  };
  id: number;
};

export type SimilarTitle = {
  id: "default";
  similar: string;
} & RelatedTitle;
