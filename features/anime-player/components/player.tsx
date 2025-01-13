import { useWindowDimensions, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { Link } from "expo-router";

import { Button } from "@/components/ui/button";
import { Loader } from "@/components/fullscreen-loader";

import { SubtitlesComponent } from "@/features/anime-player/components/subtitltes-component";

import { logger } from "@/lib/logger";

import { useAnimePlayer } from "@/features/anime-player/hooks/useAnimePlayer";
import { useEpisodeData } from "@/features/anime-player/api/useEpisodeData";
import { Comments } from "@/features/shared/components/comments";
import { colors } from "@/constants/app.constants";

export const EpisodePlayer = ({ episodeId }: { episodeId: number }) => {
  const { data: episodeData } = useEpisodeData(episodeId);

  const { player, source } = useAnimePlayer(episodeData);
  logger.verbose("file: player.tsx:29 ~ EpisodePlayer ~ source:", source);

  const video = useVideoPlayer(source, (player) => {
    player.loop = false;
    player.play();
  });

  const { width } = useWindowDimensions();

  if (!player) return <Loader />;

  return (
    <View>
      <View
        style={{
          position: "relative",
          alignItems: "center",
        }}
      >
        <VideoView
          allowsPictureInPicture={false}
          style={{
            width: width,
            height: width / 1.7777,
            backgroundColor: "gray",
          }}
          player={video}
        />
        <SubtitlesComponent player={player} video={video} />
      </View>
      <Link
        style={{
          backgroundColor: colors[4].primary,
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
