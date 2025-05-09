import { Genre } from "@/features/shared/types/title"
import { TitleGenre } from "@/features/title/components/title-genre"
import { cn } from "@/lib/utils"
import { View } from "react-native"

export const Genres = ({
  genres,
  className,
}: {
  genres: Genre[]
  className?: string
}) => {
  return (
    <View className={cn("flex-row flex-wrap gap-2 mt-1", className)}>
      {genres.map((genre) => (
        <TitleGenre
          genre={{
            ...genre,
            adult: false,
          }}
          key={genre.id}
        />
      ))}
    </View>
  )
}
