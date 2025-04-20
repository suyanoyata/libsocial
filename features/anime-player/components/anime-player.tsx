import { useEpisodesAPI } from "@/features/title/api/use-episodes-api";

import { useWindowDimensions, View } from "react-native";
import { useEffect, useState } from "react";

import { useVideoPlayer, VideoView } from "expo-video";
import { useAnimeStore } from "@/features/anime-player/context/anime-context";
import { useEpisode } from "@/features/anime-player/api/use-episode";

import Animated, { FadeIn, FadeInDown, FadeOut, FadeOutDown } from "react-native-reanimated";
import { Text } from "@/components/ui/text";
import { useEventListener } from "expo";
import { Button } from "@/components/ui/button";
import { ActivityIndicator } from "@/components/ui/activity-indicator";

export const AnimePlayer = () => {
  const { width } = useWindowDimensions();
  const [isLoaded, setLoaded] = useState(false);

  const { slug_url, selectedEpisodeIndex, setEpisodeIndex } = useAnimeStore();

  const { data: episodes } = useEpisodesAPI(slug_url);
  const { data } = useEpisode(episodes && episodes[selectedEpisodeIndex - 1].id);

  const [shouldDisplayNextEpisode, setShouldDisplayNextEpisode] = useState(false);

  useEffect(() => {
    setLoaded(false);
  }, [selectedEpisodeIndex]);

  const player = useVideoPlayer(
    {
      uri: data?.source ?? "",
      headers: {
        Referer: "https://anilib.me/",
      },
    },
    (player) => {
      player.timeUpdateEventInterval = 1;
      player.play();
    }
  );

  useEventListener(player, "statusChange", (event) => {
    if (event.status == "readyToPlay") {
      setLoaded(true);
    }
  });

  useEventListener(player, "timeUpdate", (event) => {
    if (!isLoaded) return null;

    setShouldDisplayNextEpisode(event.currentTime >= player.duration - (data?.endingLength ?? 90));
  });

  return (
    <View className="mt-3 mx-2 relative overflow-hidden rounded-xl">
      <Animated.View entering={FadeIn}>
        {shouldDisplayNextEpisode && episodes && selectedEpisodeIndex + 1 <= episodes.length && (
          <Animated.View
            className="absolute right-8 bottom-8 z-20"
            entering={FadeInDown}
            exiting={FadeOutDown}
          >
            <Button
              onPress={() => {
                if (episodes && selectedEpisodeIndex + 1 <= episodes?.length) {
                  setEpisodeIndex(selectedEpisodeIndex + 1);
                  setShouldDisplayNextEpisode(false);
                  setLoaded(false);
                }
              }}
              variant="ghost"
              textClassName="text-white"
              className="bg-orange-500 active:bg-orange-500"
              size="sm"
            >
              Next episode
            </Button>
          </Animated.View>
        )}
        <VideoView
          player={player}
          style={{
            width: width - 12,
            height: (width - 16) / 1.77777,
          }}
        />
      </Animated.View>
      {!isLoaded && (
        <Animated.View
          exiting={FadeOut}
          className="bg-muted absolute top-0 left-0 items-center justify-center"
          style={{
            width,
            height: width / 1.77777,
          }}
        >
          {data && data?.source && <ActivityIndicator />}
          {data && !data?.source && (
            <Text className="text-muted font-medium text-sm">Can't play this type of media</Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};
