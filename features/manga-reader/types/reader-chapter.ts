export type ReaderChapter = {
  volume: string;
  number: string;
  pages: {
    url: string;
    ratio: number;
  }[];
};
