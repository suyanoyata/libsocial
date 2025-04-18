import { Download } from "lucide-react-native";

import { ActivityIndicator, Pressable } from "react-native";

import { toast } from "sonner-native";

import { useMutation } from "@tanstack/react-query";

import { Chapter } from "@/features/shared/types/chapter";
import { useDownloads } from "@/features/downloads/store/use-downloads";

import * as FileSystem from "expo-file-system";
import { cn } from "@/lib/utils";

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

import { useState } from "react";
import { getTitleWithChapters } from "@/features/downloads/api/get-title-with-chapters";
import { handleFolderCreate } from "@/features/downloads/lib/handle-folder-create";

export const DownloadChapterButton = ({
  slug_url,
  chapter,
}: {
  slug_url: string;
  chapter: Chapter;
}) => {
  const isDownloaded = useDownloads((state) => state.isChapterDownloaded);

  const add = useDownloads((state) => state.add);

  const progress = useSharedValue(0);
  const bottom = useSharedValue(0);

  const [toastId, setToastId] = useState<string | number>(0);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    bottom: bottom.value,
  }));

  const { isPending, mutateAsync } = useMutation({
    mutationKey: ["download-chapter", chapter.id],
    mutationFn: async () => {
      progress.value = 0;

      const { chapterData, title } = await getTitleWithChapters(slug_url, chapter);

      const total = chapterData.pages.length;

      if (total == 0) {
        throw new Error("No pages in this chapter");
      }

      const folderName = `v${chapter.volume}-c${chapter.number}`;

      const folder = await handleFolderCreate(slug_url, folderName, total);

      if (folder == "exists") {
        const downloadResponse = await FileSystem.readDirectoryAsync(
          `${FileSystem.documentDirectory}${slug_url}/${folderName}`
        );

        add(title, {
          ...chapterData,
          pages: downloadResponse.sort().map((url, index) => ({
            url,
            ratio: chapterData.pages[index].ratio,
          })),
        });

        return {
          message: "This chapter is already downloaded",
        };
      }

      let completed = 0;

      const downloadResponse = await Promise.all(
        chapterData.pages.map(async (page, index) => {
          const i = index + 1 > 9 ? index + 1 : `0${index + 1}`;
          const { uri } = await FileSystem.downloadAsync(
            page.url,
            `${FileSystem.documentDirectory}${slug_url}/${folderName}/${i}.jpg`
          );

          completed += 1;

          bottom.value = 0;

          toast.loading(
            `Downloading... ${completed} / ${total} (${Math.round((completed / total) * 100)}%)`,
            {
              id: toastId,
            }
          );

          progress.value = withTiming((completed / total) * 108, {
            duration: 400,
          });

          return uri;
        })
      );

      add(title, {
        ...chapterData,
        pages: downloadResponse.sort().map((url, index) => ({
          url,
          ratio: chapterData.pages[index].ratio,
        })),
      });

      return { localFiles: downloadResponse, title, chapter: chapterData };
    },
  });

  const downloadChapter = () => {
    const toastId = toast.promise(mutateAsync(), {
      loading: `Download requested...`,
      success: (data) => {
        if (data?.message) {
          return data.message;
        }

        bottom.value = withTiming(-3, { duration: 500 });

        return `Volume ${data.chapter.volume} Chapter ${data.chapter.number} has been downloaded`;
      },
      error: (e) => {
        bottom.value = withTiming(-3, { duration: 500 });

        if (__DEV__) {
          console.log(e);
        }

        return `Something went wrong, try again later`;
      },
    });

    setToastId(toastId);
  };

  const isChapterDownloaded = isDownloaded(slug_url, chapter.volume, chapter.number);

  return (
    <>
      <Pressable
        disabled={isPending || isChapterDownloaded}
        className="ml-auto"
        onPress={() => downloadChapter()}
      >
        {isPending ? (
          <ActivityIndicator size="small" className="scale-90" />
        ) : (
          <Download
            className={cn(!isChapterDownloaded ? "text-zinc-600" : "text-orange-400")}
            size={18}
            strokeWidth={2.8}
          />
        )}
      </Pressable>
      <Animated.View
        style={progressStyle}
        className="absolute left-0 w-full h-[3px] bg-orange-400"
      />
    </>
  );
};
