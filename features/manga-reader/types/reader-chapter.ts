import { Chapter } from "@/features/shared/types/chapter";

export type ReaderChapter = {
  volume: string;
  number: string;
  pages: {
    url: string;
    ratio: number;
  }[];
} & Chapter;
