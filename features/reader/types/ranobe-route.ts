import { Chapter } from "@/features/chapters/types/manga-chapter";

export type RanobeRoute = {
  slug_url: string;
  volume: number;
  number: number;
  chapterIndex: number;
  chapters: Chapter[];
  name: string;
};
