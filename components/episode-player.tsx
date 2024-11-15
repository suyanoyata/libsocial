import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { store } from "@/hooks/useStore";

export const EpisodePlayer = ({ episodeId }: { episodeId: number }) => {
  // #region Episode Fetch Thingy
  const { videoServers } = store();
  const { data: episodeData } = useQuery({
    queryKey: ["episode-player", episodeId],
    queryFn: async () =>
      await api.get(`/episodes/${episodeId}`).then((res) => res.data.data),
  });

  const [player, setPlayer] = useState<
    | {
        href: string;
        quality: number;
      }[]
    | null
  >(null);

  useEffect(() => {
    if (episodeData) {
      const players = episodeData.players;
      const originPlayers = players.filter(
        (player: any) => player.player == "Animelib"
      );

      if (originPlayers.length !== 0) {
        setPlayer(originPlayers[0].video.quality);
      }
    }
  }, [episodeData]);

  // #endregion

  const video = useVideoPlayer(
    player ? `${videoServers[0].url}${player[0].href}` : "",
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  const { width } = useWindowDimensions();

  return (
    <View style={{ flex: 1 }}>
      <VideoView
        allowsPictureInPicture
        style={{
          width,
          height: width / 1.7777,
          backgroundColor: "gray",
        }}
        player={video}
      />
    </View>
  );
};
