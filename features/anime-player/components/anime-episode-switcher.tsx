import { FlatList } from "react-native"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"

import { useAnimeStore } from "@/features/anime-player/context/anime-context"
import { useEpisodesAPI } from "@/features/title/api/use-episodes-api"

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response"

export const AnimeEpisodeSwitcher = () => {
  const { slug_url, selectedEpisodeIndex, setEpisodeIndex } = useAnimeStore()

  const { data } = useEpisodesAPI(slug_url)

  const renderItem = ({ item }: { item: TitleEpisodeBase }) => {
    const isSelected = item.item_number === selectedEpisodeIndex

    return (
      <Button
        onPress={() => setEpisodeIndex(item.item_number)}
        variant={isSelected ? "accent" : "tonal"}
      >
        Episode {item.number}
      </Button>
    )
  }

  const keyExtractor = (item: TitleEpisodeBase) => item.id.toString()

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
  )
}
