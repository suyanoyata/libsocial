import { useEffect, useState } from "react";

import { View, ViewProps } from "react-native";
import FastImage, { Source } from "@d11/react-native-fast-image";

import Animated, { FadeOut } from "react-native-reanimated";

type TransitionedImageProps = ViewProps & {
  width: number;
  height: number;
  source: Source;
  recycleId?: any;
};

/**
 *
 * @param recycleId - use recycleId if you're using this component in FlashList
 * @returns
 */

export const TransitionedImage = ({
  width,
  height,
  source,
  recycleId,
  ...props
}: TransitionedImageProps) => {
  const [showImage, setShowImage] = useState(false);

  const onImageLoad = () => {
    setShowImage(true);
  };

  const onError = () => {
    setShowImage(false);
  };

  useEffect(() => {
    return () => setShowImage(false);
  }, [recycleId]);

  return (
    <View
      style={{
        width,
        height,
      }}
      className="relative overflow-hidden rounded-md"
      {...props}
    >
      {!showImage && (
        <Animated.View
          exiting={FadeOut}
          style={{
            width,
            height,
          }}
          className="bg-zinc-900 absolute top-0 left-0 z-10"
        />
      )}
      <FastImage
        onError={onError}
        onLoadEnd={onImageLoad}
        source={source}
        style={{ width, height, zIndex: 1 }}
      />
    </View>
  );
};
