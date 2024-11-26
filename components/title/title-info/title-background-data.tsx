import { Image, ImageBackground } from "expo-image";
import { BookmarkIcon, Play } from "lucide-react-native";
import { View, Text, DeviceEventEmitter } from "react-native";
import { BlurView } from "expo-blur";

import { AddToBookmarksButton } from "@/components/title/add-to-bookmarks-button";
import { Conditional } from "@/components/misc/conditional";
import { BackButton } from "@/components/title/back-button";
import { Button } from "@/components/button";

import { Anime } from "@/types/anime.type";

import { TitleColors } from "@/hooks/useStore";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";

import { getTitle, useRussianTitle } from "@/constants/app.constants";

import { clearOtherNames } from "@/lib/clearOtherNames";
import i18n from "@/lib/intl";
import { storage } from "@/lib/storage";

export const TitleBackgroundData = ({
  data,
  accent,
}: {
  data: Anime;
  accent: TitleColors;
}) => {
  const [count, setCount] = useState(0);
  const navigation: any = useNavigation();

  useEffect(() => {
    DeviceEventEmitter.addListener("title-counter-value", (count: number) => {
      setCount(count);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners("title-counter-value");
    };
  }, []);

  const BackgroundOverlay = () => {
    return (
      <BlurView
        intensity={40}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          backgroundColor: "rgba(0,0,0,0.7)",
        }}
      />
    );
  };

  const storageName = `${data.site != "5" ? `manga/${data.slug_url}` : `anime/${data.slug_url}`}`;

  const title = storage.getString(storageName);

  const type = data.site != "5" ? "reading" : "watching";

  const emitCounter = (count: number) => {
    DeviceEventEmitter.emit("title-counter-change", count);
  };

  useEffect(() => {
    if (title == undefined) {
      storage.set(storageName, JSON.stringify([]));
      emitCounter(0);

      return;
    }
    const last = JSON.parse(title ?? "").toReversed()[0];

    if (typeof last == "number") {
      emitCounter(last);
    }
  }, [title]);

  const insets = useSafeAreaInsets();

  return (
    <ImageBackground
      contentFit="cover"
      source={{
        uri: data.background.url.startsWith("/static")
          ? data.cover.default
          : data.background.url,
      }}
      style={{
        minHeight: 250,
        width: "100%",
        position: "relative",
      }}
    >
      {/* <View style={{ paddingTop: insets.top }}> */}
      <BackButton />
      {/* </View> */}
      <BackgroundOverlay />
      <View
        style={{
          zIndex: 3,
          width: "100%",
          alignItems: "center",
          marginTop: 24,
        }}
      >
        <Image
          source={{ uri: data.cover.default }}
          style={{
            width: 195,
            height: 260,
            borderRadius: 6,
            marginTop: insets.top - 10,
          }}
          contentFit="cover"
        />
        <Text
          selectable
          style={{
            color: "#bfbfbf",
            fontSize: 20,
            fontWeight: "600",
            marginTop: 12,
            textAlign: "center",
            marginHorizontal: 12,
          }}
        >
          {getTitle(data)}
        </Text>
        <Conditional conditions={[!useRussianTitle()]}>
          <Text
            selectable
            style={{
              color: "#bfbfbf",
              fontSize: 16,
              marginTop: 4,
              textAlign: "center",
              marginHorizontal: 12,
            }}
          >
            {clearOtherNames(data.otherNames)[0]}
          </Text>
        </Conditional>
        <Conditional conditions={[!!useRussianTitle(), !!data.rus_name]}>
          <Text
            selectable
            style={{
              color: "#bfbfbf",
              fontSize: 16,
              marginTop: 4,
              textAlign: "center",
              marginHorizontal: 12,
            }}
          >
            {data.name}
          </Text>
        </Conditional>
        <View
          style={{
            flexDirection: "row",
            marginTop: 14,
            marginBottom: 24,
            gap: 12,
            marginHorizontal: 14,
          }}
        >
          <AddToBookmarksButton
            title={getTitle(data)}
            type={data.model}
            siteId={data.site}
            slug_url={data.slug_url}
          />
          <Button
            icon={
              data.site == "5" ? (
                <Play color="white" fill="white" size={18} />
              ) : (
                <BookmarkIcon color="white" strokeWidth={3} size={18} />
              )
            }
            onPress={() => {
              if (data.site == "5") {
                navigation.navigate("anime-watch", {
                  slug_url: data.slug_url,
                });
              } else {
                DeviceEventEmitter.emit("tab-value-change", "chapters");
              }
            }}
            style={{
              flex: 1,
              backgroundColor: accent.primary,
            }}
          >
            {i18n.t(`content.start.${type}`, {
              count,
              total: data.items_count.uploaded,
            })}
          </Button>
        </View>
      </View>
    </ImageBackground>
  );
};
