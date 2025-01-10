import { Queries } from "@/hooks/queries";

import { Image } from "expo-image";
import { useEffect } from "react";
import { X } from "lucide-react-native";
import { DeviceEventEmitter, Pressable, View, Text } from "react-native";

import { useRouter } from "expo-router";

import { getTitle, siteUrls } from "@/constants/app.constants";

import { TitleProgressBar } from "@/features/last-read-tracking/components/last-read-progress";

import { LastReadTitle } from "@/features/last-read-tracking/types/last-read-title";
import { useTitleChaptersUpdater } from "@/features/last-read-tracking/hooks/useTitleChaptersUpdater";

export const LastReadTitleCard = ({ title }: { title: LastReadTitle }) => {
  const router = useRouter();

  const { data } = Queries.getRecentViewedTitle(title.slug_url, title.model);

  useTitleChaptersUpdater(title);

  if (!data) return null;

  return (
    <View
      style={{
        height: 160,
        width: 380,
        backgroundColor: "rgba(255,255,255,0.1)",
        overflow: "hidden",
        borderRadius: 8,
        marginRight: 12,
        position: "relative",
        flexDirection: "row",
        gap: 12,
      }}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/title-details",
            params: {
              type: data.site,
              slug_url: `${siteUrls[data.site as keyof typeof siteUrls].url}/${data.slug_url}`,
            },
          })
        }
        style={{
          width: "91%",
          height: "100%",
          position: "absolute",
        }}
      />
      <Pressable
        onPress={() => {
          DeviceEventEmitter.emit("deleteTitleFromStorage", title.slug_url);
        }}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          padding: 8,
          zIndex: 99,
        }}
      >
        <X color="gray" size={20} />
      </Pressable>
      <Image
        source={{
          uri: data.cover.default,
        }}
        style={{
          height: 160,
          width: 120,
        }}
      />
      <View style={{ marginVertical: 8, flex: 1, marginRight: 24 }}>
        <Text
          style={{
            color: "white",
            opacity: 0.8,
            fontSize: 16,
            fontWeight: "600",
          }}
          numberOfLines={2}
        >
          {getTitle(data)}
        </Text>
        <TitleProgressBar title={title} />
      </View>
    </View>
  );
};
