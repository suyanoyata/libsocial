import { Loader } from "@/components/fullscreen-loader";
import { store } from "@/hooks/useStore";
import { api, token } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { ChevronLeft, Settings } from "lucide-react-native";
import React from "react";
import {
  useWindowDimensions,
  Text,
  View,
  SafeAreaView,
  Pressable,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// import { ReactNativeZoomableView } from "@openspacelabs/react-native-zoomable-view";

export default function MangaReader() {
  const route = useRoute();
  const { slug_url, volume, number } = route.params as any;

  const navigation: any = useNavigation();

  const { data: titleData } = useQuery<Anime>({
    queryKey: ["title-data", slug_url],
  });

  const { data, isLoading, error } = useQuery<{
    pages: {
      url: string;
      ratio: number;
    }[];
  }>({
    queryKey: ["manga-reader", slug_url, volume, number],

    queryFn: async () => {
      const response = await api.get(
        `/${slug_url}/chapter?number=${number}&volume=${volume}`,
        {
          withCredentials: true,
        },
      );
      return response.data.data;
    },
    staleTime: 1000 * 60 * 60,
    enabled: !!slug_url,
  });

  const { imageServers, imageServerIndex } = store();

  const { width } = useWindowDimensions();

  if (isLoading) {
    return <Loader />;
  }

  if (!data) return;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <ReactNativeZoomableView
        maxZoom={2}
        minZoom={1}
        zoomStep={1}
        initialZoom={1}
        bindToBorders={true}
        style={{
          width: "100%",
          height: "100%",
          flex: 1,
        }}
      > */}
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
              Том {volume} Глава {number}
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
        {data.pages.map((page) => (
          <>
            <Image
              source={{
                uri: imageServers[imageServerIndex].url + page.url,
                cacheKey: imageServers[imageServerIndex].url + page.url,
                headers: {
                  Referer: "https://hentailib.me/",
                  Authorization: token,
                },
              }}
              style={{ width: width, height: width / page.ratio }}
            />
            {__DEV__ && 
              <Text style={{ color: "rgba(255,255,255,0.5)" }}>
                Ссылка: {imageServers[imageServerIndex].url + page.url}
              </Text>
            }
          </>
        ))}
      </Animated.ScrollView>
      {/* </ReactNativeZoomableView> */}
    </SafeAreaView>
  );
}
