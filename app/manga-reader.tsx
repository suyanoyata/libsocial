import { Button } from "@/components/button";
import { Loader } from "@/components/fullscreen-loader";
import { Chapter } from "@/components/manga-chapters";
import { colors } from "@/constants/app.constants";
import { Queries } from "@/hooks/queries";
import { store } from "@/hooks/useStore";
import { token } from "@/lib/axios";
import i18n from "@/lib/intl";
import { logger } from "@/lib/logger";
import { storage } from "@/lib/storage";
import { useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight, Settings } from "lucide-react-native";
import React, { useState } from "react";
import {
  useWindowDimensions,
  Text,
  View,
  SafeAreaView,
  Pressable,
  DeviceEventEmitter,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function MangaReader() {
  const route = useRoute();
  const {
    slug_url,
    volume,
    number,
    chapterIndex,
    chapters,
    // name
  } = route.params as {
    slug_url: string;
    volume: number;
    number: number;
    chapterIndex: number;
    chapters: Chapter[];
    // name: string;
  };

  const navigation: any = useNavigation();

  const { data: titleData } = Queries.titleData(slug_url);

  const { data, isLoading } = Queries.mangaReader({
    slug_url,
    volume,
    number,
  });

  const [loadLimit, setLoadLimit] = useState(6);

  const { imageServers, imageServerIndex } = store();

  const { width } = useWindowDimensions();

  const imageWidth = width >= 600 ? 600 : width;

  if (isLoading) {
    return <Loader />;
  }

  if (!data) return;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.ScrollView
        entering={FadeIn}
        contentContainerStyle={{
          gap: 3,
        }}
      >
        {/* #region back button */}
        <View
          style={{
            backgroundColor: "black",
            marginHorizontal: 8,
            paddingVertical: 6,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{ marginRight: 12 }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeft
              size={28}
              color="rgba(255,255,255,0.5)"
              strokeWidth={2.7}
            />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 16,
                fontWeight: "500",
              }}
              numberOfLines={1}
            >
              {titleData?.rus_name ? titleData.rus_name : titleData!.name}
            </Text>
            <Text
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              {i18n.t("content.reader", { volume, chapter: number })}
            </Text>
          </View>
          <Pressable
            onPress={() => {
              navigation.navigate("image-server-select", {
                slug_url,
              });
            }}
          >
            <Settings
              size={28}
              color="rgba(255,255,255,0.5)"
              strokeWidth={1.8}
              style={{
                marginLeft: 12,
                transform: [{ rotate: "60deg" }],
              }}
            />
          </Pressable>
        </View>
        {/* #endregion */}
        <View style={{ alignItems: "center" }}>
          {data.pages.map((page, index) => {
            if (index > loadLimit) return;
            return (
              <Image
                onLoad={() => {
                  if (index == loadLimit) {
                    logger.verbose("last item loaded, increasing load limit");
                    setLoadLimit(loadLimit + 3);
                  }
                }}
                source={{
                  uri: imageServers[imageServerIndex].url + page.url,
                  cacheKey: imageServers[imageServerIndex].url + page.url,
                  headers: {
                    // Referer: "https://hentailib.me/",
                    Authorization: token,
                  },
                }}
                style={{
                  width: imageWidth,
                  height: imageWidth / page.ratio,
                }}
              />
            );
          })}
        </View>
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
                navigation.replace("manga-reader", {
                  slug_url: slug_url,
                  volume: chapter.volume,
                  number: chapter.number,
                  name: chapter.name,
                  chapterIndex: chapterIndex - 1,
                  chapters: chapters,
                });

                const currentTitle = storage.getString(slug_url);

                if (currentTitle) {
                  const prev = JSON.parse(currentTitle);

                  if (!prev.includes(chapterIndex - 1)) {
                    storage.set(
                      slug_url,
                      JSON.stringify([...prev, chapterIndex - 1])
                    );
                  }
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
              style={{ flex: 1, backgroundColor: colors[0].primary }}
            >
              К {chapters[chapterIndex - 1].number} главе
            </Button>
          )}
          {chapters[chapterIndex + 1] != null && (
            <Button
              onPress={() => {
                const chapter = chapters[chapterIndex + 1];
                navigation.replace("manga-reader", {
                  slug_url: slug_url,
                  volume: chapter.volume,
                  number: chapter.number,
                  name: chapter.name,
                  chapterIndex: chapterIndex + 1,
                  chapters: chapters,
                });

                const currentTitle = storage.getString(slug_url);

                if (currentTitle) {
                  const prev = JSON.parse(currentTitle);

                  if (!prev.includes(chapterIndex + 1)) {
                    // prettier-ignore
                    DeviceEventEmitter.emit("title-counter-value", chapterIndex + 1);
                    storage.set(
                      slug_url,
                      JSON.stringify([...prev, chapterIndex + 1])
                    );
                  }
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
              style={{ flex: 1, backgroundColor: colors[0].primary }}
            >
              К {chapters[chapterIndex + 1].number} главе
            </Button>
          )}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
