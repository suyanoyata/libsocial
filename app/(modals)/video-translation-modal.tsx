import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { VideoPlayerData } from "@/types/anime.type";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { View, DeviceEventEmitter } from "react-native";

export default function VideoTranslationModal() {
  const route = useRoute();
  const { episodeId } = route.params as { episodeId: number };
  const { data: episodeData } = useQuery<{
    players: VideoPlayerData[];
  }>({
    queryKey: ["episode-player", episodeId],
    queryFn: async () =>
      await api.get(`/episodes/${episodeId}`).then((res) => res.data.data),
  });

  const players = episodeData?.players.filter(
    (player: any) => player.player == "Animelib"
  );

  const emitPlayer = (teamId: number) => {
    DeviceEventEmitter.emit("change-episode-translation", teamId);
  };

  if (!episodeData || !players) {
    return <Loader />;
  }

  return (
    <ModalWrapper scrollable title="video-translation-picker">
      <View style={{ gap: 8 }}>
        {players.map((player: any) => (
          <View>
            <Button onPress={() => emitPlayer(player.team.id)}>
              {player.team.name}
            </Button>
          </View>
        ))}
      </View>
    </ModalWrapper>
  );
}
