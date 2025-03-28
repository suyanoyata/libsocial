import { FadeView } from "@/components/ui/fade-view";
import { Text } from "@/components/ui/text";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useRoute } from "@react-navigation/native";

import { BlurView } from "expo-blur";
import FastImage from "@d11/react-native-fast-image";

import { DeviceEventEmitter, ImageBackground, ScrollView, View } from "react-native";

import { TitleSummary } from "@/features/title/components/title-summary";
import { Genres } from "@/features/title/components/genres";
import { useEffect } from "react";
import { router } from "expo-router";

export default function QuickSearchTitlePreview() {
  const route = useRoute();
  const { slug_url, site } = route.params as { slug_url: string; site: string };

  const { data } = useTitleInfo(slug_url, site);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    DeviceEventEmitter.addListener("title-info-navigate", (event) => {
      router.replace({
        pathname: "/title-info",
        params: { slug_url, site },
      });
    });

    return () => DeviceEventEmitter.removeAllListeners("title-info-navigate");
  }, []);

  return (
    <ScrollView
      className="bg-black flex-1"
      style={{
        paddingBottom: bottom + 8,
      }}
    >
      {data && (
        <FadeView withEnter className="flex-1 pb-24">
          <View className="flex-1">
            <ImageBackground
              source={{ uri: data.background.url }}
              style={{
                height: 280,
                paddingTop: 50,
                position: "relative",
              }}
            >
              <BlurView
                intensity={20}
                style={{
                  width: "100%",
                  height: 280,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  backgroundColor: "rgba(0,0,0,0.7)",
                }}
              />
              <View className="mx-auto flex-row">
                <FastImage
                  source={{ uri: data.cover.default }}
                  style={{
                    borderRadius: 8,
                    height: 220,
                    width: 140,
                  }}
                />
              </View>
            </ImageBackground>
            <View className="mx-2 gap-1 mt-2">
              <Text className="text-4xl text-zinc-200 font-bold">{data.eng_name ?? data.name}</Text>
              <TitleSummary>{data.summary}</TitleSummary>
              <Genres genres={data.genres} />
            </View>
          </View>
        </FadeView>
      )}
    </ScrollView>
  );
}
