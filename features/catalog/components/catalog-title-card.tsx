import { Link, router } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";

import { TransitionedImage } from "@/features/shared/components/transitioned-image";
import { Pressable } from "react-native";

export const CatalogTitleCard = ({ title }: { title: BaseTitle }) => {
  return (
    <Pressable
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Soft);
        router.navigate({
          pathname: "/title-info",
          params: {
            slug_url: title.slug_url,
            site: title.site,
          },
        });
      }}
      className="w-[120px] my-1"
    >
      <TransitionedImage
        source={{ uri: title.cover.default }}
        height={190}
        width={120}
        recycleId={title.id}
      />
      <Text className="text-sm font-medium text-zinc-200 mt-0.5" numberOfLines={2}>
        {title.eng_name != "" ? title.eng_name : title.name}
      </Text>
    </Pressable>
  );
};
