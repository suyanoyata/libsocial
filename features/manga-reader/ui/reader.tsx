import { Button } from "@/components/ui/button";
import { FadeView } from "@/components/ui/fade-view";

import { useChapter } from "@/features/manga-reader/api/use-chapter";
import { useChapters } from "@/features/title/api/use-chapters";

import { Image } from "expo-image";
import { router } from "expo-router";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { ChevronLeft, Cog } from "lucide-react-native";
import { useProperties } from "@/store/use-properties";
import { useImageServers } from "@/features/shared/api/use-image-servers";

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
        queryClient.prefetchQuery({
          queryKey: [
            "manga-chapter-reader",
            slug_url,
            nextChapter.volume,
            nextChapter.number,
          ],
          queryFn: response,
        }),
        Image.prefetch(
          response.pages.map((page) => "https://img2.imglib.info" + page.url),
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

  const { top, bottom } = useSafeAreaInsets();

  return (
    data && (
      <FadeView withEnter className="flex-1 items-center justify-center">
        <FlatList
          initialNumToRender={5}
          onEndReached={() => preloadNextChapter()}
          onEndReachedThreshold={0.7}
          ListHeaderComponent={() => (
            <View
              style={{ paddingTop: top, paddingBottom: 8 }}
              className="mx-3 flex-row items-center gap-2"
            >
              <ChevronLeft
                onPress={() => router.back()}
                size={24}
                strokeWidth={3}
                color="#a1a1aa"
              />
              <View className="flex-1">
                <Text className="text-zinc-200 font-medium text-base">
                  Том {data.volume} Глава {data.number}
                </Text>
                <Text numberOfLines={1} className="text-zinc-400 font-medium text-sm">
                  {title.eng_name ?? title.name}
                </Text>
              </View>
              <Cog
                onPress={() => router.navigate("/reader-properties")}
                color="#a1a1aa"
              />
            </View>
          )}
          ListFooterComponent={() => (
            <View className="flex-row m-2 gap-2" style={{ paddingBottom: bottom }}>
              <Button className="flex-1">Previous Chapter</Button>
              {nextChapter && (
                <Button
                  onPress={() =>
                    router.replace({
                      pathname: "/manga-reader",
                      params: {
                        slug_url,
                        index: chapterIndex + 1,
                      },
                    })
                  }
                  className="flex-1"
                >
                  Next Chapter
                </Button>
              )}
            </View>
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
