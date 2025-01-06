import { storage } from "@/lib/storage";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import {
  DeviceEventEmitter,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Queries } from "@/hooks/queries";
import Animated, { FadeIn } from "react-native-reanimated";
import { Image } from "expo-image";
import { X } from "lucide-react-native";
import { getTitle, siteUrls } from "@/constants/app.constants";
import i18n from "@/lib/intl";

type LastReadTitleProps = {
  slug_url: string;
  lastReadChapter: number;
  cachedOverallChapters: number;
  model: string;
};

const TitleProgressBar = ({ title }: { title: LastReadTitleProps }) => {
  const progress = (title.lastReadChapter / title.cachedOverallChapters) * 100;
  return (
    <View
      style={{
        marginTop: "auto",
        height: 8,
        width: "100%",
        overflow: "hidden",
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
      }}
    >
      <View
        style={{ height: 8, backgroundColor: "white", width: `${progress}%` }}
      />
    </View>
  );
};

const LastReadTitleCard = ({ title }: { title: LastReadTitleProps }) => {
  const router = useRouter();

  const { data, isPending } = Queries.getRecentViewedTitle(
    title.slug_url,
    title.model
  );

  // check if title counter has increased & update it
  useEffect(() => {
    if (!data || isPending) return;

    if (data.items_count.uploaded > title.cachedOverallChapters) {
      const lastReadTitles = storage.getString("lastReadTitles");
      if (!lastReadTitles) return;

      const filteredTitles = JSON.parse(lastReadTitles).filter(
        (title: LastReadTitleProps) => title.slug_url !== title.slug_url
      );
      const newTitlePayload = {
        ...title,
        cachedOverallChapters: data.items_count.uploaded,
      };

      storage.set(
        "lastReadTitles",
        JSON.stringify([filteredTitles, newTitlePayload])
      );
    }
  }, [data, isPending]);

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
      <View style={{ marginVertical: 8, flex: 1, marginRight: 12 }}>
        <Text
          style={{
            color: "white",
            opacity: 0.8,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          {getTitle(data)}
        </Text>
        <TitleProgressBar title={title} />
      </View>
    </View>
  );
};

export const LastReadTitles = () => {
  const [lastReadTitles, setLastReadTitles] = useState<LastReadTitleProps[]>(
    () => {
      const titles = storage.getString("lastReadTitles");

      if (titles) {
        return JSON.parse(titles);
      } else {
        return [];
      }
    }
  );

  const deleteTitleFromStorage = (slug_url: string) => {
    console.log(lastReadTitles.length);
    if (lastReadTitles.length == 1) {
      setLastReadTitles([]);
      storage.delete("lastReadTitles");
    }
    const newTitles = lastReadTitles.filter(
      (title) => title.slug_url !== slug_url
    );
    setLastReadTitles(newTitles);
    storage.set("lastReadTitles", JSON.stringify(newTitles));
  };

  useEffect(() => {
    DeviceEventEmitter.addListener(
      "deleteTitleFromStorage",
      deleteTitleFromStorage
    );

    return () => {
      DeviceEventEmitter.removeAllListeners("deleteTitleFromStorage");
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const titles = storage.getString("lastReadTitles");

      if (titles) {
        setLastReadTitles(JSON.parse(titles));
      }
    }, [])
  );

  if (lastReadTitles.length == 0) return null;

  return (
    <Animated.View entering={FadeIn} style={{ marginHorizontal: 12 }}>
      <Text
        style={{
          color: "white",
          fontSize: 28,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        {i18n.t("content.continue_reading")}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {lastReadTitles.map((title, index) => (
          <LastReadTitleCard title={title} key={index} />
        ))}
      </ScrollView>
    </Animated.View>
  );
};
