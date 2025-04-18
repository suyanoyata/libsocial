import { Link } from "expo-router";
import FastImage from "@d11/react-native-fast-image";

import { View } from "react-native";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { TransitionedImage } from "@/features/shared/components/transitioned-image";

export const TitleCard = ({ title }: { title: BaseTitle }) => {
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
      className="w-[120px]"
    >
      <View>
        <TransitionedImage source={{ uri: title.cover.default }} width={120} height={180} />
        <Text className="text-sm mt-1 font-medium text-secondary" numberOfLines={2}>
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </View>
    </Link>
  );
};
