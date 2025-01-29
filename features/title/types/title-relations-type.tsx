export type TitleRelationsProps = {
  label: string;
  slug_url: string;
  endpoint: "relations" | "similar";
};

export type RelationsData = {
  cover: string;
  reason: string;
  title: string;
  slug_url: string;
  type: string;
  status: string;
  site: string;
};

export type RelationsResponse = {
  media: {
    cover: {
      md: string;
      default: string;
    };
    eng_name: string;
    slug_url: string;
    name: string;
    type: {
      label: string;
    };
    status: {
      label: string;
    };
    site: number;
  };
  related_type: {
    label: string;
  };
  similar: string;
}[];
