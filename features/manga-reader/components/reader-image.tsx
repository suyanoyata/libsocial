import { useProperties } from "@/store/use-properties";
import { useState } from "react";

import { useWindowDimensions, View } from "react-native";

import FastImage from "@d11/react-native-fast-image";

import { Zoomable } from "@likashefqet/react-native-image-zoom";
import { ImageServer } from "@/features/shared/types/image-server";

type ReaderImageProps = {
  url: string;
  ratio: number;
  imageServers?: ImageServer[];
};

export const ReaderImage = ({ url, ratio, imageServers }: ReaderImageProps) => {
  const { width } = useWindowDimensions();

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
      onPinchStart={() => setFocused(true)}
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
          uri: url,
        }}
      />
    </Zoomable>
  );
};
