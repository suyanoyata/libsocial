import { useFocusEffect, useNavigation } from "expo-router";
import { Loader } from "@/components/fullscreen-loader";
import { Alert, DeviceEventEmitter, Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { date } from "@/lib/date";
import { useCallback, useEffect, useState } from "react";
import { Button } from "./button";
import { RefreshCcw } from "lucide-react-native";
import i18n from "@/lib/intl";
import { storage } from "@/lib/storage";
import { Queries } from "@/hooks/queries";

export type Chapter = {
  id: string;
  item_number: number;
  volume: string;
  number: string;
  name: string;
  branches: {
    created_at: Date;
  }[];
};

export const MangaChapters = ({
  selected,
  slug_url,
  type,
}: {
  selected: string;
  slug_url: string;
  type: string;
}) => {
  if (slug_url.startsWith("anime")) return;

  const { data, isLoading, error, refetch } = Queries.chapters(slug_url);
  const navigation: any = useNavigation();

  const slugStorage = storage.getString(slug_url);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (slugStorage == undefined) {
      storage.set(slug_url, JSON.stringify([]));
    }
  }, [slug_url]);

  useEffect(() => {
    DeviceEventEmitter.addListener("title-counter-value", (count: number) => {
      setCount(count);
    });

    return () => {
      DeviceEventEmitter.removeAllListeners("title-counter-value");
    };
  }, []);

  const ChapterItem = ({
    chapter,
    index,
  }: {
    chapter: Chapter;
    index: number;
  }) => {
    const [includes, setIncludes] = useState<boolean>(false);

    useEffect(() => {
      if (slugStorage) {
        const storage: number[] = JSON.parse(slugStorage);
        if (storage.includes(index)) {
          setIncludes(true);
        }
      }
    }, [index, slugStorage]);

    return (
      <Pressable
        style={{
          backgroundColor: includes
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.1)",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
          marginBottom: 12,
          flexDirection: "row",
          alignItems: "center",
          display: "flex",
        }}
        onLongPress={() => {
          Alert.alert(
            "Удалить из прочитанных",
            `Вы действительно хотите удалить Том ${chapter.volume} Глава ${chapter.number} ${chapter.name && "(" + chapter.name + ")"} из прочитанных?`,
            [
              {
                text: "Отмена",
              },
              {
                text: "Удалить",
                style: "destructive",
                isPreferred: true,
                onPress: () => {
                  if (slugStorage) {
                    setIncludes(false);

                    // prettier-ignore
                    storage.set(slug_url, JSON.stringify(JSON.parse(slugStorage).filter((item: number) => item !== index)))
                  }
                },
              },
            ]
          );
        }}
        onPress={() => {
          navigation.navigate(type == "3" ? "ranobe-reader" : "manga-reader", {
            slug_url,
            volume: chapter.volume,
            number: chapter.number,
            name: chapter.name,
            chapters: data,
            chapterIndex: index,
          });

          if (!includes && slugStorage) {
            setIncludes(true);

            const prev: number[] = JSON.parse(slugStorage);
            storage.set(slug_url, JSON.stringify([...prev, index]));

            if (count < index + 1) {
              DeviceEventEmitter.emit("title-counter-value", index + 1);
            }
          }
        }}
      >
        <Text
          numberOfLines={1}
          style={{ color: "white", lineHeight: 24, flex: 1, marginRight: 24 }}
        >
          {i18n.t("content.reader", {
            volume: chapter.volume,
            chapter: chapter.number,
          })}
          {chapter.name && ` - ${chapter.name}`}
        </Text>
        <Text
          style={{
            color: "rgba(255,255,255,0.6)",
            marginLeft: "auto",
          }}
        >
          {date(chapter.branches[0].created_at)}
        </Text>
      </Pressable>
    );
  };

  if (selected == "chapters") {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <View style={{ width: "100%" }}>
          <Text style={{ color: "rgba(255,255,255,0.8)" }}>
            Ошибка загрузки глав
          </Text>
          <Button
            onPress={refetch}
            icon={<RefreshCcw color="white" size={18} strokeWidth={3} />}
          >
            Попробовать ещё раз
          </Button>
        </View>
      );
    }

    return (
      <View
        style={{
          marginVertical: 12,
          marginHorizontal: 12,
        }}
      >
        <Animated.FlatList
          scrollEnabled={false}
          entering={FadeIn}
          data={data}
          renderItem={({ item, index }: { item: Chapter; index: number }) => (
            <ChapterItem index={index} chapter={item} />
          )}
        />
      </View>
    );
  }
};
