import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import { Bookmark, EyeIcon, EyeOff } from "lucide-react-native";

import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import { memo, useCallback, useLayoutEffect, useMemo, useState, useTransition } from "react";
import { router, useFocusEffect } from "expo-router";

import { useQueryClient } from "@tanstack/react-query";
import { useWatchTracker } from "@/store/use-watch-tracker";

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";

import { toast } from "sonner-native";

export const Episode = memo(
  ({
    slug_url,
    index,
    episode,
  }: {
    slug_url: string;
    index: number;
    episode: TitleEpisodeBase;
  }) => {
    const queryClient = useQueryClient();

    const { add, isEpisodeExists, get, removeEpisode } = useWatchTracker();

    const [watch, setWatch] = useState(isEpisodeExists(slug_url, index));
    const WatchIcon = !watch ? EyeOff : EyeIcon;

    const [isPending, startTransition] = useTransition();

    const title = get(slug_url);

    const isLastWatchedEpisode = useMemo(() => {
      return get(slug_url)?.lastWatchedEpisode == index;
    }, [title]);

    const watchCallback = useCallback(() => setWatch(isEpisodeExists(slug_url, index)), [index]);

    useFocusEffect(watchCallback);
    useLayoutEffect(watchCallback, [index]);

    const addCallback = useCallback(() => {
      add(queryClient, slug_url, index);
    }, [slug_url, index]);

    return (
      <Pressable
        onPress={() => {
          if (isPending) return;

          setWatch(true);

          startTransition(() => {
            impactAsync(ImpactFeedbackStyle.Soft);

            addCallback();
            router.back();
            router.navigate({
              pathname: "/anime-watch",
              params: {
                slug_url,
                episodeIndex: index,
              },
            });
          });
        }}
        className="flex-row items-center gap-2 h-11 bg-zinc-900 active:bg-zinc-800 mb-2 px-4 rounded-lg"
      >
        <Pressable
          hitSlop={10}
          onPress={() => {
            if (watch) {
              setWatch(false);
              removeEpisode(slug_url, index);
            } else {
              setWatch(true);
              addCallback();
            }
            toast.success(`Marked Episode ${episode.number} as ${watch ? "unwatched" : "watched"}`);
          }}
        >
          {isLastWatchedEpisode ? (
            <Bookmark size={18} className="text-red-500 fill-red-500" />
          ) : (
            <WatchIcon className="text-zinc-500" size={20} />
          )}
        </Pressable>
        <Text className="text-zinc-200">Episode {episode.number}</Text>
      </Pressable>
    );
  }
);
