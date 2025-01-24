import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  ImageBackground,
  Platform,
  ScrollView,
  View,
} from "react-native";
import FastImage from "@d11/react-native-fast-image";
import { BlurView } from "expo-blur";

import { BackButton } from "@/components/ui/back-button";
import { FadeView } from "@/components/ui/fade-view";
import { Text } from "@/components/ui/text";

import { TabsSwitcher } from "@/features/title/components/tabs-switcher";
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
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
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
            paddingTop: Platform.OS == "ios" ? top + 40 : 60,
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
              zIndex: 1,
              top: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.7)",
            }}
          />
          <View className="mx-2 flex-row z-10">
            <FastImage
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
            {data.eng_name != "" ? data.eng_name : data.name}
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
