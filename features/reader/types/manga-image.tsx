export type MangaImage = {
  url: string;
  ratio: number;
};

export type MangaImageResponse = {
  pages: MangaImage[];
};
