import { useTitleCounterValue } from "@/features/title/hooks/useTitleCounterValue";
import { Chapter } from "@/features/chapters/types/manga-chapter";
import { storage } from "@/features/shared/lib/storage";
import { date } from "@/lib/date";
import i18n from "@/lib/intl";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, DeviceEventEmitter, Pressable, Text } from "react-native";
import { useChapters } from "@/features/chapters/api/useChapters";

type ChapterItemProps = {
  slug_url: string;
  chapter: Chapter;
  index: number;
  type: string;
};

export const ChapterItem = ({ slug_url, chapter, index, type }: ChapterItemProps) => {
  const { data } = useChapters(slug_url);

  const { count } = useTitleCounterValue();
  const navigation: any = useNavigation();

  const [includes, setIncludes] = useState(false);

  const slugStorage = storage.getString(slug_url);

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
        backgroundColor: includes ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
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
          i18n.t("content.remove-chapter-alert.title"),
          i18n.t("content.remove-chapter-alert.text", {
            volume: chapter.volume,
            chapter: chapter.number,
          }),
          [
            {
              text: i18n.t("content.remove-chapter-alert.cancel"),
            },
            {
              text: i18n.t("content.remove-chapter-alert.remove"),
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
      <Text numberOfLines={1} style={{ color: "white", lineHeight: 24, flex: 1, marginRight: 24 }}>
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
        {/* {date(chapter.branches[0].created_at)} */}
        {date(chapter.created_at)}
      </Text>
    </Pressable>
  );
};
