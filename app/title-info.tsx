import { useTitleInfo } from "@/features/title/api/useTitleInfo";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image, ImageBackground } from "expo-image";
import { ScrollView, Text, View } from "react-native";

import { BackButton } from "@/components/ui/back-button";
import { FadeView } from "@/components/ui/fade-view";
import { TitleSummary } from "@/features/title/components/title-summary";
import { BlurView } from "expo-blur";
import { Genres } from "@/features/title/ui/genres";
import { TabsSwitcher } from "@/features/title/ui/tabs-switcher";

export default function TitleInfo() {
  const router = useRoute();

  const { slug_url, site } = router.params as { slug_url: string; site: string };

  if (!slug_url || typeof slug_url != "string") {
    throw new Error(`Slug url is required or its type is mismatched`);
  }

  if (!site || typeof site != "string") {
    throw new Error(`Site is required or its type is mismatched`);
  }

  const { top } = useSafeAreaInsets();

  const { data } = useTitleInfo(slug_url, site);

  if (!data) {
    return (
      <View className="items-center justify-center">
        <Text className="text-white text-sm">Wait...</Text>
      </View>
    );
  }

  return (
    <FadeView withEnter className="flex-1">
      <ScrollView contentContainerClassName="flex-1">
        <BackButton />
        <ImageBackground
          source={{ uri: data.background.url }}
          style={{
            height: 300,
            paddingTop: top + 50,
            position: "relative",
          }}
        >
          <BlurView
            intensity={20}
            style={{
              width: "100%",
              height: 300,
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
        </ImageBackground>
        <View className="mx-2 -mt-60 gap-0.5">
          <Image
            source={{ uri: data.cover.default }}
            style={{
              borderRadius: 8,
              height: 220,
              width: 140,
            }}
          />
          <Text className="text-3xl text-zinc-200 font-bold">
            {data.rus_name ?? data.name}
          </Text>
          <TabsSwitcher />
          <TitleSummary>{data.summary}</TitleSummary>
          <Genres genres={data.genres} />
        </View>
      </ScrollView>
    </FadeView>
  );
}
