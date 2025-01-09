import { VideoPlayerData } from "@/types/anime.type";
import axios from "axios";
import { VideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import RenderHTML from "react-native-render-html";
import { VTTData, WebVTTParser } from "webvtt-parser";
import { Text, useWindowDimensions } from "react-native";

export const SubtitlesComponent = ({
  player,
  video,
}: {
  player: (VideoPlayerData & { subtitle: string | undefined }) | null;
  video: VideoPlayer;
}) => {
  const [subtitle, setSubtitle] = useState<VTTData>();
  const [subtitleText, setSubtitleText] = useState<string | undefined>();
  const { width } = useWindowDimensions();

  const parser = new WebVTTParser();

  useEffect(() => {
    if (player && player?.subtitle) {
      axios.get(player?.subtitle).then((res) => {
        const sub = parser.parse(res.data);
        setSubtitle(parser.parse(res.data));
      });
    }
  }, [player]);

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
        console.log(part.text);
        return setSubtitleText(part.text);
      }
      if (!part?.text) {
        return setSubtitleText(undefined);
      }
    }, 100);

    return () => {
      clearInterval(clear);
    };
  });

  if (!subtitleText) return null;

  return (
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
  );
};
