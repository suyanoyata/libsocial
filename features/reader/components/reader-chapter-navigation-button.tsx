import { useNavigation } from "expo-router";
import { ChevronLeft, ChevronRight } from "lucide-react-native";

import { Button } from "@/components/ui/button";

import { storage } from "@/features/shared/lib/storage";
import { colors } from "@/constants/app.constants";

import { Chapter } from "@/features/chapters/types/manga-chapter";
import { DeviceEventEmitter } from "react-native";

type ReaderChapterNavigationProps = {
  slug_url: string;
  chapters: Chapter[];
  chapterIndex: number;
  direction?: "forward" | "backward";
  contentType?: "manga" | "ranobe";
};

export const ReaderChapterNavigation = ({
  slug_url,
  chapters,
  chapterIndex,
  direction = "forward",
  contentType = "manga",
}: ReaderChapterNavigationProps) => {
  const navigation: any = useNavigation();

  // prettier-ignore
  const chapter = direction == "backward" ? chapters[chapterIndex - 1] : chapters[chapterIndex + 1];
  const iconPosition = direction == "backward" ? "left" : "right";
  const Icon = direction == "backward" ? ChevronLeft : ChevronRight;

  if (chapter == null) return;

  return (
    <Button
      onPress={() => {
        navigation.replace(
          contentType == "manga" ? "manga-reader" : "ranobe-reader",
          {
            slug_url: slug_url,
            volume: chapter.volume,
            number: chapter.number,
            name: chapter.name,
            chapterIndex:
              direction == "backward" ? chapterIndex - 1 : chapterIndex + 1,
            chapters: chapters,
          }
        );

        const currentTitle = storage.getString(slug_url);

        if (currentTitle) {
          const prev = JSON.parse(currentTitle);
          const newChapterIndex =
            direction == "backward" ? chapterIndex - 1 : chapterIndex + 1;

          if (direction == "forward") {
            DeviceEventEmitter.emit("title-counter-value", chapterIndex + 1);
          }

          if (!prev.includes(newChapterIndex)) {
            storage.set(slug_url, JSON.stringify([...prev, newChapterIndex]));
          }
        }
      }}
      iconPosition={iconPosition}
      icon={
        <Icon
          size={20}
          color="white"
          style={{
            marginLeft: direction == "forward" ? "auto" : undefined,
            marginRight: direction == "backward" ? "auto" : undefined,
          }}
        />
      }
      style={{
        flex: 1,
        backgroundColor: colors[contentType == "manga" ? 0 : 2].primary,
      }}
    >
      К {chapter.number} главе
    </Button>
  );
};
