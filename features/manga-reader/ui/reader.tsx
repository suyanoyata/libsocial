import { FadeView } from "@/components/ui/fade-view";
import { ReaderHeader } from "@/features/manga-reader/components/reader-header";

import { useChapter } from "@/features/manga-reader/api/use-chapter";
import { useChapters } from "@/features/title/api/use-chapters";

import { Image } from "expo-image";

import { useRoute } from "@react-navigation/native";
import { ActivityIndicator, FlatList, useWindowDimensions, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";

import { useProperties } from "@/store/use-properties";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useImageServers } from "@/features/shared/api/use-image-servers";

import { ReaderChapterNavigation } from "@/features/manga-reader/components/reader-chapter-navigation";
import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";

export const MangaReaderUI = () => {
  const route = useRoute();

  const { slug_url, index } = route.params as {
    slug_url: string;
    index: string;
  };

  const { width } = useWindowDimensions();

  // #region route arguments error handling
  if (!slug_url || !index) {
    console.error({
      slug_url,
      index,
    });
    throw new Error("Missing required params");
  }

  if (typeof slug_url !== "string" || typeof index !== "string") {
    throw new Error("Route params types are mismatched");
  }
  // #endregion

  const chapterIndex = Number(index);

  const { data: title } = useTitleInfo(slug_url, "1");
  const { data: chapters } = useChapters(slug_url);

  const { currentImageServerIndex } = useProperties();
  const { data: imageServers } = useImageServers();

  const nextChapter = chapters && chapters[chapterIndex + 1];

  const queryClient = useQueryClient();

  const preloadNextChapter = async () => {
    if (chapters && nextChapter) {
      const response = (
        await api.get(
          `/manga/${slug_url}/chapter?volume=${nextChapter.volume}&number=${nextChapter.number}`
        )
      ).data.data;

      await Promise.all([
        queryClient.prefetchQuery<ReaderChapter>({
          queryKey: [
            "manga-chapter-reader",
            slug_url,
            nextChapter.volume,
            nextChapter.number,
          ],
          queryFn: response,
        }),
        Image.prefetch(
          response.pages.map(
            (page: { url: string }) => "https://img2.imglib.info" + page.url
          ),
          "disk"
        ),
      ]);
    }
  };

  if (!chapters || !title) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  const { data } = useChapter(
    slug_url,
    chapters[chapterIndex].volume,
    chapters[chapterIndex].number
  );

  if (!imageServers) return null;

  return (
    data && (
      <FadeView withEnter className="flex-1 items-center justify-center">
        <FlatList
          initialNumToRender={5}
          onEndReached={() => preloadNextChapter()}
          onEndReachedThreshold={0.7}
          ListHeaderComponent={() => <ReaderHeader chapter={data} title={title} />}
          ListFooterComponent={() => (
            <ReaderChapterNavigation chapterIndex={chapterIndex} chapters={chapters} />
          )}
          data={data.pages}
          renderItem={({ item }) => (
            <Image
              style={{
                width,
                height: width / item.ratio,
              }}
              source={{
                uri: imageServers[currentImageServerIndex].url + item.url,
                recyclingKey: imageServers[currentImageServerIndex].url + item.url,
              }}
            />
          )}
        />
      </FadeView>
    )
  );
};
