import { Image, ImageBackground } from "expo-image";
import { View, Text, DeviceEventEmitter } from "react-native";
import { BlurView } from "expo-blur";

import { AddToBookmarksButton } from "@/features/bookmarks/components/add-to-bookmarks";
import { Conditional } from "@/components/misc/conditional";
import { BackButton } from "@/components/ui/back-button";

import { Anime } from "@/types/anime.type";

import { TitleColors } from "@/hooks/useStore";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";

import { getTitle, useRussianTitle } from "@/constants/app.constants";

import { clearOtherNames } from "@/lib/clearOtherNames";
import { storage } from "@/features/shared/lib/storage";
import { StartButton } from "@/features/title/components/start-button";
import { logger } from "@/lib/logger";

export const TitleBackgroundData = ({
  data,
  accent,
}: {
  data: Anime;
  accent: TitleColors;
}) => {
  const [count, setCount] = useState(0);

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
  const name = getTitle(data);

  useEffect(() => {
    if (title == undefined) {
      return setCount(0);
    }

    const chapters: number[] = JSON.parse(title);
    const last = chapters.sort().toReversed()[0] + 1;

    setCount(last);
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
      <BackButton />
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
          {name}
        </Text>
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
          <Conditional conditions={[!useRussianTitle()]}>
            {clearOtherNames(data.otherNames)[0]}
          </Conditional>
          <Conditional conditions={[!!useRussianTitle(), !!data.rus_name]}>
            {data.name}
          </Conditional>
        </Text>
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
            siteId={String(data.site)}
            slug_url={data.slug_url}
          />
          <StartButton data={data} count={count} accent={accent} />
        </View>
      </View>
    </ImageBackground>
  );
};
