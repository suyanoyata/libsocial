import { useEffect, useState } from "react";

import { VideoPlayerData } from "@/types/anime.type";
import { logger } from "@/lib/logger";
import { useEpisodeTranslationTeamId } from "@/features/anime-player/hooks/useTranslationTeamId";
import { store } from "@/hooks/useStore";

type Player = VideoPlayerData & { subtitle: string | undefined };

export const useAnimePlayer = (
  episodeData: { players: VideoPlayerData[] } | undefined
) => {
  const episodeTranslationTeamId = useEpisodeTranslationTeamId();
  const { videoServers } = store();

  const [player, setPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (episodeData) {
      const data = episodeData.players.filter(
        (player) => player.player == "Animelib"
      );
      const player = data.find(
        (player) => player.team.id == episodeTranslationTeamId
      );

      if (player) {
        logger.verbose("file: player.tsx:38 ~ useEffect ~ player:", player);
        const subtitles = player?.subtitles.find(
          (subtitle) => subtitle.format == "vtt"
        );
        setPlayer({
          ...player,
          subtitle: subtitles?.src,
        });
      } else {
        setPlayer({ ...data[0], subtitle: undefined });
      }
    }

    return () => setPlayer(null);
  }, [episodeData, episodeTranslationTeamId]);

  return {
    player,
    source: videoServers[0].url + player?.video.quality[0].href,
  };
};
