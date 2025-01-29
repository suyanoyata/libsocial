import { Text } from "@/components/ui/text";
import { RelationsData } from "@/features/title/types/title-relations-type";
import FastImage from "@d11/react-native-fast-image";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

export const TitleRelationsCard = ({ item }: { item: RelationsData }) => {
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/title-info",
          params: {
            slug_url: item.slug_url,
            site: item.site,
          },
        })
      }
      className="w-[350px] h-[150px] bg-zinc-800 rounded-lg flex-row overflow-hidden"
    >
      <FastImage
        source={{
          uri: item.cover,
        }}
        style={{
          width: 110,
          height: 150,
        }}
      />
      <View className="flex-1 ml-2 my-2">
        <Text className="text-sm text-blue-300 font-medium">{item.reason}</Text>
        <Text className="text-zinc-300 text-base font-semibold" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-zinc-400 text-sm font-medium mt-auto">
          {item.type} • {item.status}
        </Text>
      </View>
    </Pressable>
  );
};
