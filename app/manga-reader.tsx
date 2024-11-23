import { Loader } from "@/components/fullscreen-loader";
import { Queries } from "@/hooks/queries";
import { store } from "@/hooks/useStore";
import { token } from "@/lib/axios";
import i18n from "@/lib/intl";
import { logger } from "@/lib/logger";
import { useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { ChevronLeft, Settings } from "lucide-react-native";
import React, { useState } from "react";
import {
  useWindowDimensions,
  Text,
  View,
  SafeAreaView,
  Pressable,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export default function MangaReader() {
  const route = useRoute();
  const { slug_url, volume, number } = route.params as any;

  const navigation: any = useNavigation();

  const { data: titleData } = Queries.titleData(slug_url);

  const { data, isLoading } = Queries.mangaReader({
    slug_url,
    volume,
    number,
  });

  const [loadLimit, setLoadLimit] = useState(3);

  const { imageServers, imageServerIndex } = store();

  const { width } = useWindowDimensions();

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
              navigation.navigate("image-server-select");
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
        {data.pages.map((page, index) => {
          if (index > loadLimit) return;
          return (
            <Image
              onLoad={() => {
                console.log(`${index} loaded`);
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
              style={{ width: width, height: width / page.ratio }}
            />
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
