import { View } from "react-native";

import Summary from "@/components/title/title-info/title-summary";
import { TitleSimilar } from "@/features/title/ui/title-similar";
import { TitleRelations } from "@/components/title/title-info/title-relations";

import { TitleColors } from "@/hooks/useStore";

import { Genres } from "@/features/shared/ui/genres";

import { Anime } from "@/types/anime.type";

export const AboutTitle = ({
  selected,
  data,
  accent,
}: {
  selected: string;
  data: Anime;
  accent: TitleColors;
}) => {
  if (selected != "about") return;

  const slug_url =
    data.site == 5 ? `anime/${data.slug_url}` : `manga/${data.slug_url}`;

  return (
    <View>
      <Summary accent={accent}>{data.summary}</Summary>
      <Genres genres={data.genres} />
      <TitleRelations slug_url={slug_url} />
      <TitleSimilar slug_url={slug_url} />
    </View>
  );
};
