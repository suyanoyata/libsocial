import React from "react";

import { useRoute } from "@react-navigation/native";
import { useReaderAPI } from "@/features/reader/api/useReaderAPI";
import { useChapterTracker } from "@/features/reader/hooks/useChapterTracker";

import { SafeAreaView, Text, useWindowDimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import RenderHtml from "react-native-render-html";

import { Loader } from "@/components/fullscreen-loader";
import { Comments } from "@/features/shared/components/comments";
import { ReaderChapterNavigation } from "@/features/reader/components/reader-chapter-navigation-button";

import { RanobeRoute } from "@/features/reader/types/ranobe-route";
import { BackButton } from "@/components/ui/back-button";

export const RanobeReaderComponent = () => {
  const route = useRoute();
  const { slug_url, volume, number, chapterIndex, chapters, name } =
    route.params as RanobeRoute;

  useChapterTracker(chapterIndex, chapters, slug_url);

  const { data, isLoading } = useReaderAPI("ranobe", slug_url, volume, number);

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
        <BackButton absolute={false} />
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
          <ReaderChapterNavigation
            slug_url={slug_url}
            chapters={chapters}
            chapterIndex={chapterIndex}
            direction="backward"
            contentType="ranobe"
          />
          <ReaderChapterNavigation
            slug_url={slug_url}
            chapters={chapters}
            chapterIndex={chapterIndex}
            contentType="ranobe"
          />
        </View>
        <Comments
          selected="comments"
          slug_url={slug_url}
          model="chapter"
          post_id={data!.id}
        />
      </Animated.ScrollView>
    </SafeAreaView>
  );
};
