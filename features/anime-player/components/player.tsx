import { useCallback, useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Link, useFocusEffect } from "expo-router";

import { VideoPlayerData } from "@/types/anime.type";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/fullscreen-loader";

import { SubtitlesComponent } from "@/features/anime-player/components/subtitltes-component";

import { api } from "@/lib/axios";
import { logger } from "@/lib/logger";

import { useQuery } from "@tanstack/react-query";
import { useAnimePlayer } from "@/features/anime-player/hooks/useAnimePlayer";

export const EpisodePlayer = ({ episodeId }: { episodeId: number }) => {
  const { data: episodeData } = useQuery<{
    players: VideoPlayerData[];
  }>({
    queryKey: ["episode-player", episodeId],
    queryFn: async () =>
      await api.get(`/episodes/${episodeId}`).then((res) => res.data.data),
  });

  const { player, source } = useAnimePlayer(episodeData);
  logger.verbose("file: player.tsx:29 ~ EpisodePlayer ~ source:", source);

  const video = useVideoPlayer(source, (player) => {
    player.loop = false;
    player.play();
  });

  useEffect(() => {
    video.replace(source);
  }, [source]);

  // useFocusEffect(
  //   useCallback(() => {
  //     // FIXME: quirk, player is not unloading on its own when closing screen, something is still using it?
  //     return () => {
  //       logger.verbose("player should unload now");
  //       video.release();
  //     };
  //   }, [])
  // );

  const { width } = useWindowDimensions();

  if (!player) return <Loader />;

  return (
    <View>
      {/* <View style={{ position: "relative", alignItems: "center" }}> */}
      <VideoView
        allowsPictureInPicture={false}
        style={{
          width,
          height: width / 1.7777,
          backgroundColor: "gray",
        }}
        player={video}
      />
      {/* <SubtitlesComponent player={player} video={video} />
      </View> */}
      <Link
        style={{
          marginTop: 8,
        }}
        asChild
        href={{
          pathname: "/(modals)/video-translation-modal",
          params: {
            episodeId,
          },
        }}
      >
        <Button>{player?.team.name}</Button>
      </Link>
    </View>
  );
};
