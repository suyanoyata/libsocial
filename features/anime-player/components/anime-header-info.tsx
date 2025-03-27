// FIXME: star icon position

import { useAnimeStore } from "@/features/anime-player/context/anime-context";

import { useTitleInfo } from "@/features/title/api/use-title-info";

import FastImage from "@d11/react-native-fast-image";
import { Text } from "@/components/ui/text";

import { Star } from "lucide-react-native";
import { View } from "react-native";

const AnimeRating = ({ rate }: { rate: number }) => (
  <Text>
    <Star color="#a1a1aa" fill="#a1a1aa" size={11} /> {rate}
  </Text>
);

export const AnimeHeaderInfo = () => {
  const { slug_url } = useAnimeStore();

  const { data } = useTitleInfo(slug_url, "5");

  if (!data) return;

  return (
    <View className="mx-2 flex-row gap-2 mt-12">
      <FastImage
        style={{
          width: 60,
          height: 90,
          borderRadius: 8,
        }}
        source={{
          uri: data.cover.default,
        }}
      />
      <View className="flex-1">
        <Text numberOfLines={2} className="text-zinc-300 font-bold text-2xl">
          {data.eng_name}
        </Text>
        <Text className="text-xs text-zinc-500" numberOfLines={4}>
          {data.summary}
        </Text>
      </View>
    </View>
  );
};
