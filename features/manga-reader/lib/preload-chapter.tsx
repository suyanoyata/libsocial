import { useQueryClient } from "@tanstack/react-query";

import FastImage from "@d11/react-native-fast-image";

import { api } from "@/lib/axios";

import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { Chapter } from "@/features/shared/types/chapter";

export const preloadNextChapter = async (slug_url: string, nextChapter?: Chapter) => {
  const queryClient = useQueryClient();

  if (nextChapter) {
    const response = await api
      .get(
        `/manga/${slug_url}/chapter?volume=${nextChapter.volume}&number=${nextChapter.number}`
      )
      .then((res) => res.data.data)
      .catch((err) => console.error(err));

    console.log(response);

    queryClient.setQueryData<ReaderChapter>(
      ["manga-chapter-reader", slug_url, nextChapter.volume, nextChapter.number],
      response
    ),
      FastImage.preload(
        response.pages.map(
          (page: { url: string }) => "https://img2.imglib.info" + page.url
        )
      ),
      console.log("preloaded next chapter");
  }
};
