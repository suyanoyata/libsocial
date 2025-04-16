import { Download } from "lucide-react-native";

import { ActivityIndicator, Pressable } from "react-native";

import { toast } from "sonner-native";
import { api } from "@/lib/axios";

import { useMutation } from "@tanstack/react-query";

import { Chapter } from "@/features/shared/types/chapter";
import { ReaderChapter } from "@/features/manga-reader/types/reader-chapter";
import { useDownloads } from "@/features/downloads/store/use-downloads";
import { Title } from "@/features/shared/types/title";

import * as FileSystem from "expo-file-system";
import { throwable } from "@/lib/utils";

import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useState } from "react";

export const DownloadChapterButton = ({
  slug_url,
  chapter,
}: {
  slug_url: string;
  chapter: Chapter;
}) => {
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

      const {
        data: { data: title },
      } = await api.get<{ data: Title }>(`/manga/${slug_url}/`);

      const {
        data: { data: chapterData },
      } = await api.get<{ data: ReaderChapter }>(
        `/manga/${slug_url}/chapter?volume=${chapter.volume}&number=${chapter.number}`
      );

      if (chapterData.pages.length == 0) {
        throw new Error("No pages in this chapter");
      }

      const folderName = `v${chapter.volume}-c${chapter.number}`;

      // #region Check if folder exists, if not create
      const { error: slugFolderFails } = await throwable(
        FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}${slug_url}`)
      );

      if (slugFolderFails) {
        await FileSystem.makeDirectoryAsync(`${FileSystem.documentDirectory}${slug_url}`);
      }

      const { data, error: chapterFolderFails } = await throwable(
        FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}${slug_url}/${folderName}`)
      );

      // Check if chapter is already downloaded
      if (data?.length == chapterData.pages.length) {
        return {
          message: "This chapter is already downloaded",
        };
      }

      if (chapterFolderFails) {
        await FileSystem.makeDirectoryAsync(
          `${FileSystem.documentDirectory}${slug_url}/${folderName}`
        );
      }
      // #endregion

      const total = chapterData.pages.length;
      let completed = 0;

      const downloadResponse = await Promise.all(
        chapterData.pages.map(async (page, index) => {
          const i = index + 1 > 9 ? index + 1 : `0${index + 1}`;
          const { uri } = await FileSystem.downloadAsync(
            page.url,
            `${FileSystem.documentDirectory}${slug_url}/${folderName}/${i}.jpg`
          );

          completed += 1;

          bottom.value = withTiming(0, { duration: 1200 });

          toast.loading(
            `Downloading... ${completed} / ${total} (${Math.round((completed / total) * 100)}%)`,
            {
              id: toastId,
            }
          );

          progress.value = withTiming((completed / total) * 108, { duration: 300 });

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
      loading: `Downloading...`,
      success: (data) => {
        if (data?.message) {
          return data.message;
        }

        bottom.value = withTiming(-3, { duration: 500 });

        return `Volume ${data.chapter.volume} Chapter ${data.chapter.number} has been downloaded`;
      },
      error: () => {
        bottom.value = withTiming(-3, { duration: 500 });

        return `Something went wrong, try again later`;
      },
    });

    setToastId(toastId);
  };

  return (
    <>
      <Pressable disabled={isPending} className="ml-auto" onPress={() => downloadChapter()}>
        {isPending ? (
          <ActivityIndicator size="small" className="scale-90" />
        ) : (
          <Download className="text-zinc-600" size={18} strokeWidth={2.8} />
        )}
      </Pressable>
      <Animated.View
        style={progressStyle}
        className="absolute left-0 w-full h-[3px] bg-orange-400"
      />
    </>
  );
};
