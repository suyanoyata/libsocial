import { FlatList } from "react-native";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import { useAnimeStore } from "@/features/anime-player/context/anime-context";
import { useEpisodesAPI } from "@/features/title/api/use-episodes-api";

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";

export const AnimeEpisodeSwitcher = () => {
  const { slug_url, selectedEpisodeIndex, setEpisodeIndex } = useAnimeStore();

  const { data } = useEpisodesAPI(slug_url);

  const renderItem = ({ item }: { item: TitleEpisodeBase }) => (
    <Button
      onPress={() => setEpisodeIndex(item.item_number)}
      variant="ghost"
      className={cn(
        "bg-inactive",
        item.item_number === selectedEpisodeIndex &&
          "bg-orange-500 active:bg-orange-500 dark:bg-orange-500 dark:active:bg-orange-500"
      )}
      textClassName={cn(item.item_number === selectedEpisodeIndex && "text-white")}
    >
      Episode {item.number}
    </Button>
  );

  const keyExtractor = (item: TitleEpisodeBase) => item.id.toString();

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      className="mx-2 mt-3"
      keyExtractor={keyExtractor}
      contentContainerClassName="gap-2"
      horizontal
      data={data}
      renderItem={renderItem}
    />
  );
};
