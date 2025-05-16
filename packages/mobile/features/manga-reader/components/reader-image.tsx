import { useProperties } from "@/store/use-properties"
import { memo, useState } from "react"

import { useWindowDimensions } from "react-native"

import FastImage from "@d11/react-native-fast-image"

import { Zoomable } from "@likashefqet/react-native-image-zoom"

type ReaderImageProps = {
  url: string
  ratio: number
}

export const ReaderImage = memo(
  ({ url, ratio }: ReaderImageProps) => {
    const { width } = useWindowDimensions()

    const paddingBottom = useProperties((state) => state.readerImagePadding)

    const [focused, setFocused] = useState(false)

    return (
      <Zoomable
        onPinchStart={() => setFocused(true)}
        onInteractionStart={() => setFocused(true)}
        onResetAnimationEnd={() => setFocused(false)}
        style={{ zIndex: focused ? 10 : 5, paddingBottom }}
        isPanEnabled={true}
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
    )
  },
  (prevProps, nextProps) => prevProps.url === nextProps.url
)
