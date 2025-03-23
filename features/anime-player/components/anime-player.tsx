import { useEpisodesAPI } from "@/features/title/api/use-episodes-api";

import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { useEffect, useMemo, useState } from "react";

import { useVideoPlayer, VideoView } from "expo-video";
import { useVideoServers } from "@/features/shared/api/use-video-servers";
import { useAnimeStore } from "@/features/anime-player/context/anime-context";
import { useEpisode } from "@/features/anime-player/api/use-episode";

import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Button } from "@/components/ui/button";
import { MenuView } from "@react-native-menu/menu";

export const AnimePlayer = () => {
  const { width } = useWindowDimensions();
  const [isLoaded, setLoaded] = useState(false);

  const { data: videoServers } = useVideoServers();

  const { slug_url, selectedEpisodeIndex } = useAnimeStore();

  const { data: episodes } = useEpisodesAPI(slug_url);
  const { data } = useEpisode(episodes && episodes[selectedEpisodeIndex].id);

  // prettier-ignore
  const source = videoServers && data?.players ? videoServers[0].url + data?.players[0].video.quality[0].href : ""

  const player = useVideoPlayer(
    {
      uri: source,
      headers: {
        Referer: "https://anilib.me/",
      },
    },
    (player) => {
      player.play();
    }
  );

  useEffect(() => {
    const listener = player.addListener("statusChange", (event) => {
      if (event.status == "readyToPlay") {
        setLoaded(true);
      }
    });

    return () => listener.remove();
  }, [player]);

  const qualityOptions = useMemo(() => {
    if (!data) return [];

    return data?.players[0].video.quality.reverse().map((quality) => ({
      id: quality.quality.toString(),
      title: `${quality.quality}p`,
    }));
  }, [data]);

  const processAction = (quality: string) => {
    console.log(quality);
    return;
    setData({
      ...context,
      selectedQuality: Number(quality),
    });
  };

  return (
    <View className="mt-3 mx-2 relative">
      <Animated.View entering={FadeIn}>
        <VideoView
          player={player}
          style={{
            width,
            height: width / 1.77777,
          }}
        />
      </Animated.View>
      {!isLoaded && (
        <Animated.View
          exiting={FadeOut}
          className="bg-zinc-800 absolute top-0 left-0 items-center justify-center"
          style={{
            width,
            height: width / 1.77777,
          }}
        >
          <ActivityIndicator color="gray" />
        </Animated.View>
      )}
      <MenuView
        onPressAction={(event) => processAction(event.nativeEvent.event)}
        actions={qualityOptions}
        style={{ marginTop: 12 }}
      >
        <Button>Quiality</Button>
      </MenuView>
    </View>
  );
};
