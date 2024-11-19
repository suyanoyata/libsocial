import { Anime } from "@/types/anime.type";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "react-native";
import { Image } from "expo-image";
import { siteUrls, useRussianTitle } from "@/constants/app.constants";
import { Skeleton } from "./skeleton";
import Animated, { FadeIn } from "react-native-reanimated";

export const TitleCard = ({
  item,
  width = 130,
}: {
  item?: Anime;
  width?: number;
}) => {
  const dimensions = { width, height: 189 };
  const router: any = useNavigation();
  const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

  if (!item) {
    return (
      <View
        style={{
          width: 140,
          height: 240,
        }}
      >
        <Skeleton width={dimensions.width} height={dimensions.height} />
        <Skeleton
          width={dimensions.width}
          height={16}
          style={{ marginTop: 6 }}
        />
        <Skeleton
          width={dimensions.width}
          height={16}
          style={{ marginTop: 6 }}
        />
      </View>
    );
  }

  const name = useRussianTitle()
    ? item.rus_name != ""
      ? item.rus_name
      : item.name
    : item.name;

  return (
    <AnimatedPressable
      entering={FadeIn}
      style={{
        width: 130,
        height: 235,
      }}
      onPress={() => {
        router.navigate("title-details", {
          type: item.site,
          slug_url: `${siteUrls[item.site as keyof typeof siteUrls].url}/${item.slug_url}`,
        });
      }}
    >
      <Image
        source={{ uri: item.cover.default }}
        style={{
          height: dimensions.height,
          width: dimensions.width,
          borderRadius: 6,
          zIndex: 1,
        }}
        contentFit="cover"
      />
      <Text
        numberOfLines={2}
        style={{
          color: "white",
          marginTop: 4,
          fontWeight: "500",
        }}
      >
        {name}
      </Text>
    </AnimatedPressable>
  );
};
