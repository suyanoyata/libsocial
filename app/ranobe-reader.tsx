import { Button } from "@/components/button";
import { Comments } from "@/components/title/comments";
import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React from "react";
import { SafeAreaView, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import RenderHtml from "react-native-render-html";
import { storage } from "@/lib/storage";

type RanobeChapter = {
  content: string;
  id: number;
};

export default function RanobeReader() {
  const route = useRoute();
  const { slug_url, volume, number, name, chapterIndex, chapters, includes } =
    route.params as any;

  const navigation: any = useNavigation();

  const { data, isLoading } = useQuery<RanobeChapter>({
    queryKey: ["ranobe-reader", slug_url, volume, number],

    queryFn: async () => {
      const response = await api.get(
        `/${slug_url}/chapter?number=${number}&volume=${volume}`
      );
      console.log(response.data.data, null, 2);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!slug_url,
  });

  const tagsStyles = {
    p: {
      color: "rgba(255,255,255,0.7)",
      margin: 0,
      marginTop: 6,
      marginBottom: 6,
      fontSize: 16,
      lineHeight: 24,
    },
  };

  const { width } = useWindowDimensions();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) return;

  return (
    <SafeAreaView>
      <Animated.ScrollView
        entering={FadeIn}
        style={{
          marginHorizontal: 12,
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 28,
            fontWeight: "700",
          }}
        >
          Том {volume} Глава {number}
          {name != "" && ` - ${name}`}
        </Text>
        <RenderHtml
          contentWidth={width}
          source={{
            html: data.content,
          }}
          tagsStyles={tagsStyles}
        />
        <View
          style={{
            flexDirection: "row",
            marginBottom: 24,
            marginTop: 12,
            gap: 12,
          }}
        >
          {chapters[chapterIndex - 1] != null && (
            <Button
              onPress={() => {
                const chapter = chapters[chapterIndex - 1];
                navigation.replace("ranobe-reader", {
                  slug_url: slug_url,
                  volume: chapter.volume,
                  number: chapter.number,
                  name: chapter.name,
                  chapterIndex: chapterIndex - 1,
                  chapters: chapters,
                });

                const currentTitle = storage.getString(slug_url);

                const prev = JSON.parse(currentTitle ?? "") ?? [];

                if (!includes) {
                  storage.set(
                    slug_url,
                    JSON.stringify([...prev, chapterIndex - 1])
                  );
                }
              }}
              iconPosition="left"
              icon={
                <ChevronLeft
                  size={20}
                  color="white"
                  style={{ marginRight: "auto" }}
                />
              }
              style={{ flex: 1, backgroundColor: "#1665c0" }}
            >
              К {chapters[chapterIndex - 1].number} главе
            </Button>
          )}
          {chapters[chapterIndex + 1] != null && (
            <Button
              onPress={() => {
                const chapter = chapters[chapterIndex + 1];
                navigation.replace("ranobe-reader", {
                  slug_url: slug_url,
                  volume: chapter.volume,
                  number: chapter.number,
                  name: chapter.name,
                  chapterIndex: chapterIndex + 1,
                  chapters: chapters,
                });

                const currentTitle = storage.getString(slug_url);

                const prev = JSON.parse(currentTitle ?? "") ?? [];

                if (!includes) {
                  storage.set(
                    slug_url,
                    JSON.stringify([...prev, chapterIndex - 1])
                  );
                }
              }}
              iconPosition="right"
              icon={
                <ChevronRight
                  size={20}
                  color="white"
                  style={{ marginLeft: "auto" }}
                />
              }
              style={{ flex: 1, backgroundColor: "#1665c0" }}
            >
              К {chapters[chapterIndex + 1].number} главе
            </Button>
          )}
        </View>
        <Comments
          selected="Комментарии"
          slug_url={slug_url}
          model="chapter"
          post_id={data!.id}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
