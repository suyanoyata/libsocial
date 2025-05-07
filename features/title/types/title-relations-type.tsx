export type TitleRelationsProps = {
  label: string;
  slug_url: string;
  endpoint: "relations" | "similar";
  site: string;
};

export type RelationsData = {
  reason: string;
  relatedManga: {
    id: number;
    name: string;
    eng_name: string;
    slug_url: string;
    otherNames: string[];
    summary: string;
    model: string;
    site: number;
    isLicensed: boolean;
    cover: {
      default: string;
      thumbnail: string;
    };
  };
};

export type RelationsResponse = RelationsData[];
