import { Title } from "@/features/shared/types/title";
import { Genres } from "@/features/title/components/genres";
import { TitleSummary } from "@/features/title/components/title-summary";
import { TitleContext } from "@/features/title/context/title-context";
import { TitleRelations } from "@/features/title/ui/title-relations";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TitleAbout = ({ data }: { data: Title }) => {
  const tab = useContext(TitleContext);

  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingBottom: bottom + 8,
      }}
      className={cn("mt-2", tab !== "about" && "hidden")}
    >
      <TitleSummary>{data.summary}</TitleSummary>
      <Genres ageRestriction={data.ageRestriction} genres={data.genres} />
      <TitleRelations label="Связанное" slug_url={data.slug_url} endpoint="relations" />
      <TitleRelations label="Похожие" slug_url={data.slug_url} endpoint="similar" />
    </View>
  );
};
