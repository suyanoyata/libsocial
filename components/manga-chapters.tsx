import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Loader } from "@/components/fullscreen-loader";
import { Alert, Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { date } from "@/lib/date";
import { useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { Button } from "./button";
import { RefreshCcw } from "lucide-react-native";
import i18n from "@/lib/intl";

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
  count,
  setCount,
}: {
  selected: string;
  slug_url: string;
  type: number;
  count: number;
  setCount: (n: number) => void;
}) => {
  if (slug_url.startsWith("anime")) return;

  const storage = useAsyncStorage(slug_url);

  const { data, isLoading, error, refetch } = useQuery<Chapter[]>({
    queryKey: ["chapter-data", slug_url],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/chapters`);
      return response.data.data;
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!slug_url,
  });

  useEffect(() => {
    storage.getItem().then((res) => {
      if (!res) {
        storage.setItem(JSON.stringify([]));
      }
    });
  }, [slug_url]);

  const navigation: any = useNavigation();

  const ChapterItem = ({
    chapter,
    index,
  }: {
    chapter: Chapter;
    index: number;
  }) => {
    const [includes, setIncludes] = useState<boolean>(false);

    useEffect(() => {
      storage.getItem().then((res) => {
        const list = JSON.parse(res ?? "") ?? [];

        setIncludes(list.includes(index + 1));
      });
    }, [index, storage]);

    return (
      <Pressable
        style={{
          backgroundColor: includes
            ? "rgba(255,255,255,0.05)"
            : "rgba(255,255,255,0.1)",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 8,
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
                text: "Удалить",
                style: "destructive",
                isPreferred: true,
                onPress: () => {
                  setIncludes(false);

                  storage.getItem().then((res) => {
                    const list = JSON.parse(res ?? "") ?? [];

                    storage.setItem(
                      JSON.stringify(
                        list.filter((item: number) => item !== index + 1)
                      )
                    );
                  });
                },
              },
              {
                text: "Отмена",
              },
            ]
          );
        }}
        onPress={() => {
          navigation.navigate(type == 3 ? "ranobe-reader" : "manga-reader", {
            slug_url: slug_url,
            volume: chapter.volume,
            number: chapter.number,
            name: chapter.name,
            chapterIndex: index,
            chapters: data,
            setIncludes: setIncludes,
            includes: includes,
            setCount: setCount,
            count: count,
          });
          storage.getItem().then((res) => {
            const prev = JSON.parse(res ?? "") ?? [];

            if (!includes) {
              storage.setItem(JSON.stringify([...prev, index + 1]));
              setIncludes(true);
              if (count < index + 1) {
                setCount(index + 1);
              }
            }
          });
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
      <>
        <Animated.FlatList
          entering={FadeIn}
          data={data}
          contentContainerStyle={{
            gap: 12,
            marginVertical: 12,
            marginHorizontal: 12,
          }}
          renderItem={({ item, index }) => (
            <ChapterItem key={item.id} index={index} chapter={item} />
          )}
        />
      </>
    );
  }
};
