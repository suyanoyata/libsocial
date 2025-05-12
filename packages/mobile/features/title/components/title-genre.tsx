import { Pressable } from "react-native"
import { router } from "expo-router"

import { Text } from "@/components/ui/text"

import { Genre } from "@/features/shared/types/title"
import { cn } from "@/lib/utils"

import { useFilterStore } from "@/features/catalog/store/use-filter-store"

export const TitleGenre = ({ genre }: { genre: Genre }) => {
  const { resetGenresWithId } = useFilterStore()

  const handleGenrePress = () => {
    resetGenresWithId(genre.id)
    router.dismissTo("/catalog")
  }

  return (
    <Pressable
      onPress={handleGenrePress}
      className={cn(
        "bg-inactive active:opacity-80 dark:border-zinc-800 border-zinc-300 border rounded-lg p-1 px-2",
        genre.adult && "bg-red-200/10"
      )}
    >
      <Text
        className={cn(
          "text-secondary font-medium text-sm",
          genre.adult && "text-red-400/90"
        )}
      >
        {genre.name}
      </Text>
    </Pressable>
  )
}
