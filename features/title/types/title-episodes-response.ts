export type TitleEpisodeBase = {
  id: number;
  created_at: string;
  number: string;
  season: string;
};

export type TitleEpisode = TitleEpisodeBase & {
  players: {
    created_at: string;
    player: "Kodik" | "Animelib";
    video: {
      quality: {
        quality: number;
        href: string;
      }[];
    };
  }[];
};
