export type Anime = {
  id: number;
  name: string;
  rus_name?: string;
  otherNames: string[];
  releaseDateString: string;
  slug: string;
  model: string;
  slug_url: string;
  cover: {
    thumbnail: string;
    default: string;
  };
  ageRestriction: {
    id: number;
    label: string;
  };
  items_count: {
    uploaded: number;
  };
  site: string | number;
  status: {
    id: number;
    label: string;
  };
  type: {
    id: number;
    label: string;
  };
  rating: {
    averageFormated: string;
    votesFormated: string;
  };
  metadata: {
    last_item: {
      id: number;
      type: string;
      name: string;
      number: string;
      season: string;
      status: {
        label: string;
      };
    };
  };
  background: {
    url: string;
  };
  summary: string | null;
  episodes_schedule: {
    airing_at: Date;
    number: string;
  }[];
  genres: {
    id: number;
    name: string;
    adult: boolean;
  }[];
};

export type VideoPlayerData = {
  player: "Kodik" | "Animelib";
  team: {
    id: number;
    name: string;
  };
  subtitles: {
    format: "vtt" | "ass";
    src: string;
  }[];
  video: {
    id: number;
    quality: {
      href: string;
      quality: number;
      bitrate: number;
    }[];
  };
};
