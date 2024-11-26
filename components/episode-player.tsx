import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  useWindowDimensions,
  View,
  DeviceEventEmitter,
  Text,
} from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { store } from "@/hooks/useStore";
import { Link } from "expo-router";
import { Button } from "./button";
import { logger } from "@/lib/logger";
import { VideoPlayerData } from "@/types/anime.type";
import { Loader } from "./fullscreen-loader";
import { VTTData, WebVTTParser } from "webvtt-parser";
import axios from "axios";
import RenderHTML from "react-native-render-html";
import { Conditional } from "./misc/conditional";

export const EpisodePlayer = ({ episodeId }: { episodeId: number }) => {
  const { videoServers } = store();
  // #region episodes fetching
  const { data: episodeData } = useQuery<{
    players: VideoPlayerData[];
  }>({
    queryKey: ["episode-player", episodeId],
    queryFn: async () =>
      await api.get(`/episodes/${episodeId}`).then((res) => res.data.data),
  });
  // #endregion

  const [episodeTranslationTeamId, setEpisodeTranslationTeamId] = useState(0);
  // prettier-ignore
  const [player, setPlayer] = useState<VideoPlayerData & { subtitle: string | undefined } | null>(null);
  // #region listening for translation change
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
  // #endregion

  // #region handling translation change
  // prettier-ignore
  useEffect(() => {
    if (episodeData) {
      const data = episodeData.players.filter((player) => player.player == "Animelib");
      const player = data.find((player) => player.team.id == episodeTranslationTeamId);
      
      if (player){
        const subtitles = player?.subtitles.find((subtitle) => subtitle.format == "vtt")
        setPlayer({
          ...player,
          subtitle: subtitles?.src
        })
      } else {
        setPlayer({...data[0], subtitle: undefined})
      }
    }
  }, [episodeData, episodeTranslationTeamId]);
  // #endregion

  const video = useVideoPlayer(
    player ? `${videoServers[0].url}${player.video.quality[0].href}` : "",
    (player) => {
      player.loop = false;
      player.play();
    }
  );

  const [subtitle, setSubtitle] = useState<VTTData>();
  const [subtitleText, setSubtitleText] = useState<string | undefined>();
  const parser = new WebVTTParser();

  useEffect(() => {
    if (player && player?.subtitle) {
      axios.get(player?.subtitle).then((res) => {
        const sub = parser.parse(res.data);
        console.log(sub);
        setSubtitle(parser.parse(res.data));
      });
    }
  }, [player]);

  const { width } = useWindowDimensions();

  useEffect(() => {
    const clear = setInterval(() => {
      if (!subtitle) return;
      if (!video.playing) return;
      const parts = subtitle.cues;

      const part = parts.find((part) => {
        return (
          video.currentTime >= part.startTime &&
          video.currentTime <= part.endTime
        );
      });

      if (part?.text && part.text !== subtitleText) {
        return setSubtitleText(part?.text);
      }
      if (!part?.text) {
        return setSubtitleText(undefined);
      }
    }, 100);

    return () => {
      clearInterval(clear);
    };
  });

  if (!player) {
    return <Loader />;
  }

  return (
    <View>
      <View style={{ position: "relative", alignItems: "center" }}>
        <VideoView
          allowsPictureInPicture
          style={{
            width,
            height: width / 1.7777,
            backgroundColor: "gray",
          }}
          player={video}
        />
        <Conditional conditions={[!!subtitleText]}>
          <Text
            style={{
              color: "white",
              backgroundColor: "black",
              padding: 8,
              borderRadius: 4,
              position: "absolute",
              bottom: 32,
            }}
          >
            <RenderHTML
              contentWidth={width}
              defaultTextProps={{
                style: {
                  marginHorizontal: 6,
                  textAlign: "center",
                  color: "rgba(255,255,255,1)",
                },
              }}
              source={{ html: subtitleText ?? "" }}
            />
          </Text>
        </Conditional>
      </View>
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
