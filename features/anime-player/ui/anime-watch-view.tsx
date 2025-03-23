import { BackButton } from "@/components/ui/back-button";
import { Text } from "@/components/ui/text";
import { AnimeHeaderInfo } from "@/features/anime-player/components/anime-header-info";
import { AnimePlayer } from "@/features/anime-player/components/anime-player";

import { useAnimeStore } from "@/features/anime-player/context/anime-context";
import { AnimeRouteSchema } from "@/features/anime-player/types/anime-route-params";

import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useRoute } from "@react-navigation/native";
import { useEffect, useMemo } from "react";

import { ActivityIndicator, SafeAreaView, View } from "react-native";

export const AnimeWatchView = () => {
  const route = useRoute();
  const { setSlugUrl } = useAnimeStore();

  const { data, error } = useMemo(
    () => AnimeRouteSchema.safeParse(route.params),
    [route.params]
  );

  useEffect(() => {
    if (!data) return;

    setSlugUrl(data.slug_url);
  }, [data]);

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
    </SafeAreaView>
  );
};
