import { View } from "react-native";
import Summary from "./title-summary";
import { Anime } from "@/types/anime.type";
import { TitleSimilar } from "./title-similar";
import { TitleRelations } from "./title-relations";
import { TitleColors } from "@/hooks/useStore";

export const AboutTitle = ({
  selected,
  data,
  accent,
}: {
  selected: string;
  data: Anime;
  accent: TitleColors;
}) => {
  if (selected != "О тайтле") return;

  const slug_url =
    data.site == 5 ? `anime/${data.slug_url}` : `manga/${data.slug_url}`;

  return (
    <View>
      <Summary accent={accent}>{data.summary}</Summary>
      <TitleRelations slug_url={slug_url} />
      <TitleSimilar slug_url={slug_url} />
    </View>
  );
};
