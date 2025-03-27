export type TitleEpisodeBase = {
  id: number;
  created_at: string;
  number: string;
  season: string;
  item_number: number;
};

export type TitleEpisode = TitleEpisodeBase & {
  source: string | null;
  endingLength: number | null;
};
