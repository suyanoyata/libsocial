import { logger } from "@/lib/logger";
import { useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export const useEpisodeTranslationTeamId = () => {
  const [episodeTranslationTeamId, setEpisodeTranslationTeamId] = useState(0);
  useEffect(() => {
    DeviceEventEmitter.addListener(
      "change-episode-translation",
      (teamId: number) => {
        setEpisodeTranslationTeamId(teamId);
        logger.verbose(
          `changed episode translation team id from modal to ${teamId}`
        );
      }
    );

    return () => {
      DeviceEventEmitter.removeAllListeners("change-episode-translation");
    };
  }, []);

  return episodeTranslationTeamId;
};
