import { Title } from "@/features/shared/types/title";
import { Genres } from "@/features/title/components/genres";
import { TitleSummary } from "@/features/title/components/title-summary";
import { TitleContext } from "@/features/title/context/title-context";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { Text, View } from "react-native";

export const TitleAbout = ({ data }: { data: Title }) => {
  const tab = useContext(TitleContext);

  return (
    <View className={cn("mt-2", tab !== "about" && "hidden")}>
      <TitleSummary>{data.summary}</TitleSummary>
      <Genres ageRestriction={data.ageRestriction} genres={data.genres} />
    </View>
  );
};
