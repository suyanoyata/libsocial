import { Link } from "expo-router";

import { View } from "react-native";

import { Text } from "@/components/ui/text";

import { BaseTitle } from "@/features/shared/types/title";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import FastImage from "@d11/react-native-fast-image";

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
      <View>
        <FastImage
          source={{ uri: title.cover.thumbnail }}
          style={{ height: 190, width: 120, borderRadius: 4 }}
        />
        <Text className="text-sm mt-1 font-medium text-zinc-200" numberOfLines={2}>
          {title.eng_name != "" ? title.eng_name : title.name}
        </Text>
      </View>
    </Link>
  );
};
