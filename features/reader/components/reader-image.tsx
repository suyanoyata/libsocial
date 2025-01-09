import { Image } from "expo-image";

import { logger } from "@/lib/logger";
import { store } from "@/hooks/useStore";
import { useWindowDimensions } from "react-native";
import { MangaImage } from "@/features/reader/types/manga-image";
import { token } from "@/lib/axios";

type MangaReaderImageProps = {
  page: MangaImage;
  index: number;
  loadLimit: number;
  setLoadLimit: (value: number) => void;
};

export const MangaReaderImage = ({
  page,
  index,
  loadLimit,
  setLoadLimit,
}: MangaReaderImageProps) => {
  const { imageServers, imageServerIndex } = store();

  const { width } = useWindowDimensions();

  const imageWidth = width >= 600 ? 600 : width;

  if (index > loadLimit) return;

  return (
    <Image
      key={index}
      onLoad={() => {
        if (index == loadLimit) {
          setLoadLimit(loadLimit + 3);
        }
      }}
      source={{
        uri: imageServers[imageServerIndex].url + page.url,
        cacheKey: imageServers[imageServerIndex].url + page.url,
        headers: {
          Authorization: token,
        },
      }}
      style={{
        width: imageWidth,
        height: imageWidth / page.ratio,
      }}
    />
  );
};
