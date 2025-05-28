export const Mangadex = {
  search: (q: string) =>
    `https://api.mangadex.org/manga?contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&title=${q}&limit=5&order[relevance]=desc`,
  chapters: (id: string) =>
    `https://api.mangadex.org/manga/${id}/feed?limit=500&order[volume]=asc&order[chapter]=asc&offset=0&contentRating[]=safe&contentRating[]=suggestive&contentRating[]=erotica&contentRating[]=pornographic`,
  manga: (id: string) =>
    `https://api.mangadex.org/manga/${id}?includes[]=cover_art`,
};
