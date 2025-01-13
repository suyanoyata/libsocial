import { useCurrentUser } from "@/features/users/api/useCurrentUser";
import { Storage, storage } from "@/features/shared/lib/storage";
import { colors } from "@/constants/app.constants";

import { Skeleton } from "@/components/skeleton";

import { Image } from "expo-image";
import { Text, View } from "react-native";

import Animated, { FadeIn } from "react-native-reanimated";
import { site_id } from "@/lib/axios";

export const MenuUserCard = () => {
  const token = storage.getString(Storage.token);

  const { isPending, data, isError } = useCurrentUser();

  if (isPending && token) {
    return (
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          padding: 12,
          borderRadius: 8,
          flexDirection: "row",
          gap: 14,
          alignItems: "center",
        }}
      >
        <Skeleton
          style={{
            width: 60,
            height: 60,
            borderRadius: 6,
          }}
        />
        <Skeleton
          style={{
            height: 18,
            width: 240,
          }}
        />
      </View>
    );
  }

  if (!data || isError) return null;

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        gap: 14,
        alignItems: "center",
      }}
    >
      <Image
        style={{
          width: 60,
          height: 60,
          borderRadius: 6,
        }}
        source={{ uri: data.avatar.url }}
      />
      <Text
        style={{
          // color: "rgba(255,255,255,0.4)",
          color: colors[site_id - 1].showMore,
          fontWeight: "600",
          fontSize: 18,
          overflow: "hidden",
          flex: 1,
        }}
        ellipsizeMode="tail"
        numberOfLines={1}
      >
        {data.username}
      </Text>
    </Animated.View>
  );
};
