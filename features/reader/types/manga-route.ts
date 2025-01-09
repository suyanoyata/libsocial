import { Chapter } from "@/features/chapters/types/manga-chapter";

export type MangaRoute = {
  slug_url: string;
  volume: number;
  number: number;
  chapterIndex: number;
  chapters: Chapter[];
};
