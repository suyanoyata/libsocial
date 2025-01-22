import { useTitleInfo } from "@/features/title/api/use-title-info";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Image, ImageBackground } from "expo-image";
import { ScrollView, Text, View } from "react-native";
import { BlurView } from "expo-blur";

import { BackButton } from "@/components/ui/back-button";
import { FadeView } from "@/components/ui/fade-view";

import { TabsSwitcher } from "@/features/title/components/tabs-switcher";
import { useEffect, useState } from "react";
import { TitleContext } from "@/features/title/context/title-context";
import { TitleAbout } from "@/features/title/ui/title-about";
import { TitleChapters } from "@/features/title/ui/title-chapters";

export default function TitleInfo() {
  const router = useRoute();

  const [shouldRender, setShouldRender] = useState(false);

  const { slug_url, site, withDelay } = router.params as {
    slug_url: string;
    site: string;
    withDelay: string | undefined;
  };

  if (!slug_url || typeof slug_url != "string") {
    throw new Error(`Slug url is required or its type is mismatched`);
  }

  if (!site || typeof site != "string") {
    throw new Error(`Site is required or its type is mismatched`);
  }

  const { top } = useSafeAreaInsets();

  const { data } = useTitleInfo(slug_url, site);

  const [tab, setTab] = useState("about");

  useEffect(() => {
    if (!withDelay && data) {
      setShouldRender(true);
    }

    if (withDelay && data) {
      setTimeout(() => {
        setShouldRender(true);
      }, 500);
    }
  }, [withDelay, data]);

  if (!data) {
    return (
      <View className="items-center justify-center">
        <Text className="text-white text-sm">Wait...</Text>
      </View>
    );
  }

  if (!shouldRender) return null;

  return (
    <FadeView withEnter className="flex-1">
      <ScrollView>
        <BackButton />
        <ImageBackground
          source={{ uri: data.background.url }}
          style={{
            height: 320,
            paddingTop: top + 40,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={20}
            style={{
              width: "100%",
              height: 320,
              position: "absolute",
              top: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
          <View className="mx-2 flex-row">
            <Image
              source={{ uri: data.cover.default }}
              style={{
                borderRadius: 8,
                height: 220,
                width: 140,
              }}
            />
            <View className="flex-1 gap-1.5 mx-2">
              {data.otherNames.map((name) => (
                <Text key={name} className="text-zinc-200 font-medium">
                  {name}
                </Text>
              ))}
            </View>
          </View>
        </ImageBackground>
        <View className="mx-2 gap-0.5 mt-2 flex-1">
          <Text className="text-4xl text-zinc-200 font-bold" numberOfLines={2}>
            {data.rus_name ?? data.name}
          </Text>
          <TabsSwitcher tab={tab} setTab={setTab} />
          <TitleContext.Provider value={tab}>
            <TitleAbout data={data} />
            <TitleChapters slug_url={slug_url} />
          </TitleContext.Provider>
        </View>
      </ScrollView>
    </FadeView>
  );
}
