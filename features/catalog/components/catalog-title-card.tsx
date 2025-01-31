import { Link, router } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";

import { TransitionedImage } from "@/features/shared/components/transitioned-image";
import { Pressable } from "react-native";
import { cn } from "@/lib/utils";

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
      className="w-[120px] my-1 p-2"
    >
      <Text
        className={cn(
          "w-10 text-center text-zinc-200 font-bold top-0 left-0.5 absolute z-10 p-0.5 rounded-md text-sm",
          Number(title.rating.averageFormated) > 6 && "bg-green-500",
          Number(title.rating.averageFormated) < 3 && "bg-red-500",
          Number(title.rating.averageFormated) > 6 &&
            Number(title.rating.averageFormated) < 3 &&
            "bg-zinc-500"
        )}
      >
        {title.rating.averageFormated}
      </Text>
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
