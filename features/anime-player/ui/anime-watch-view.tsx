import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";
import { AnimeEpisodeSwitcher } from "@/features/anime-player/components/anime-episode-switcher";
import { AnimeHeaderInfo } from "@/features/anime-player/components/anime-header-info";
import { AnimePlayer } from "@/features/anime-player/components/anime-player";

import { useAnimeStore } from "@/features/anime-player/context/anime-context";
import { AnimeRouteSchema } from "@/features/anime-player/types/anime-route-params";

import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useWatchTracker } from "@/store/use-watch-tracker";
import { useRoute } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import { ActivityIndicator, SafeAreaView, View } from "react-native";

export const AnimeWatchView = () => {
  const route = useRoute();
  const { selectedEpisodeIndex, setSlugUrl, setEpisodeIndex } = useAnimeStore();

  const { data, error } = useMemo(() => AnimeRouteSchema.safeParse(route.params), [route.params]);

  const { add } = useWatchTracker();
  const client = useQueryClient();

  useEffect(() => {
    if (!data) return;

    setEpisodeIndex(Number(data.episodeIndex) ?? 0);
    setSlugUrl(data.slug_url);
  }, [data]);

  useEffect(() => {
    if (data) {
      add(client, data?.slug_url, selectedEpisodeIndex);
    }
  }, [data, selectedEpisodeIndex]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <BackButton />
        <Text className="text-zinc-200">Something went wrong</Text>
      </View>
    );
  }

  const { data: titleInfo } = useTitleInfo(data.slug_url, "5");

  if (!titleInfo) {
    return (
      <View className="flex-1 items-center justify-center">
        <BackButton />
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <BackButton />
      <AnimeHeaderInfo />
      <AnimePlayer />
      <AnimeEpisodeSwitcher />
    </SafeAreaView>
  );
};
