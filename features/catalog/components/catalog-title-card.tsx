import { Link } from "expo-router";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";

import { TransitionedImage } from "@/features/shared/components/transitioned-image";

export const CatalogTitleCard = ({ title }: { title: BaseTitle }) => {
  return (
    <Link
      href={{
        pathname: "/title-info",
        params: {
          slug_url: title.slug_url,
          site: title.site,
        },
      }}
      onPress={() => impactAsync(ImpactFeedbackStyle.Soft)}
      className="w-[120px] my-1"
    >
      <TransitionedImage
        source={{ uri: title.cover.default }}
        height={190}
        width={120}
        recycleId={title.id}
      />
      <Text className="text-sm mt-1 font-medium text-zinc-200" numberOfLines={2}>
        {title.eng_name != "" ? title.eng_name : title.name}
      </Text>
    </Link>
  );
};
