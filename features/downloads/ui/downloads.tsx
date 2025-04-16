import { useEffect } from "react";
import { Link, router, useRouter } from "expo-router";
import { useProperties } from "@/store/use-properties";

import { Pressable, SafeAreaView, ScrollView, View } from "react-native";

import { Text } from "@/components/ui/text";
import { useDownloads } from "@/features/downloads/store/use-downloads";

import { TransitionedImage } from "@/features/shared/components/transitioned-image";
import { useQueryClient } from "@tanstack/react-query";

export default function Downloads() {
  const client = useQueryClient();

  const { push } = useRouter();

  const { siteId } = useProperties();

  const { items } = useDownloads();

  useEffect(() => {
    if (siteId == "5") {
      push("/(tabs)");
    }
  }, [siteId]);

  if (items.length == 0) {
    return (
      <View className="items-center justify-center flex-1">
        <Text className="text-white">You don't have any downloaded chapter yet</Text>
      </View>
    );
  }

  return (
    <ScrollView className="mt-4 mx-2">
      <SafeAreaView className="gap-4">
        {items.map((item, index) => (
          <Pressable
            onPress={() => {
              router.push({
                pathname: "/downloaded-reader",
                params: {
                  slug_url: item.title.slug_url,
                  volume: item.chapter.volume,
                  chapter: item.chapter.number,
                },
              });
            }}
            key={index}
            className="flex-row gap-2"
          >
            <TransitionedImage width={90} height={130} source={{ uri: item.title.cover.default }} />
            <View>
              <Text className="text-white text-lg font-bold">
                {item.title.eng_name ?? item.title.name}
              </Text>
              <Text className="text-zinc-300 font-medium">
                Volume {item.chapter.volume} Chapter {item.chapter.number}
              </Text>
            </View>
          </Pressable>
        ))}
      </SafeAreaView>
    </ScrollView>
  );
}
