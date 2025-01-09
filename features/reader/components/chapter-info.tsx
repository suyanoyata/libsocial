import { getTitle } from "@/constants/app.constants";
import { Queries } from "@/hooks/queries";
import i18n from "@/lib/intl";
import { View, Text } from "react-native";

type ChapterInfoProps = {
  slug_url: string;
  volume: number;
  chapter: number;
};

export const ChapterInfo = ({
  slug_url,
  volume,
  chapter,
}: ChapterInfoProps) => {
  const { data: titleData } = Queries.titleData(slug_url);

  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: "rgba(255,255,255,0.8)",
          fontSize: 16,
          fontWeight: "500",
        }}
        numberOfLines={1}
      >
        {titleData && getTitle(titleData)}
      </Text>
      <Text
        style={{
          color: "rgba(255,255,255,0.5)",
          fontSize: 12,
          lineHeight: 18,
        }}
      >
        {i18n.t("content.reader", { volume, chapter: chapter })}
      </Text>
    </View>
  );
};
