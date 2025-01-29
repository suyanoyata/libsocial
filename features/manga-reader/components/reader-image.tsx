import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useProperties } from "@/store/use-properties";
import { useState } from "react";

import { useWindowDimensions, View } from "react-native";

import FastImage from "@d11/react-native-fast-image";

import { Zoomable } from "@likashefqet/react-native-image-zoom";

type ReaderImageProps = {
  url: string;
  ratio: number;
};

export const ReaderImage = ({ url, ratio }: ReaderImageProps) => {
  const { width } = useWindowDimensions();

  const { data: imageServers } = useImageServers();

  const { currentImageServerIndex } = useProperties();
  const [focused, setFocused] = useState(false);

  if (!imageServers) {
    return (
      <View
        style={{
          marginHorizontal: "auto",
          width: width > 800 ? 800 : width,
          height: width > 800 ? 800 : width / ratio,
        }}
        className="bg-zinc-800"
      />
    );
  }

  return (
    <Zoomable
      onInteractionStart={() => setFocused(true)}
      onResetAnimationEnd={() => setFocused(false)}
      style={{ zIndex: focused ? 10 : 5 }}
    >
      <FastImage
        resizeMode="contain"
        style={{
          marginHorizontal: "auto",
          width: width > 800 ? 800 : width,
          height: width > 800 ? 800 : width / ratio,
        }}
        source={{
          uri: imageServers[currentImageServerIndex].url + url,
        }}
      />
    </Zoomable>
  );
};
