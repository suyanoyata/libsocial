import { Genre } from "@/features/shared/types/title"
import { TitleGenre } from "@/features/title/components/title-genre"
import { cn } from "@/lib/utils"
import { Text, View } from "react-native"

export const Genres = ({
  genres,
  className,
}: // ageRestriction,
{
  genres: Genre[]
  className?: string
  // ageRestriction: { id: number; label: string };
}) => {
  return (
    <View className={cn("flex-row flex-wrap gap-2 mt-1", className)}>
      {/* {ageRestriction?.id > 2 && (
        <TitleGenre
          genre={{
            adult: true,
            name: ageRestriction.label,
            id: ageRestriction.id,
          }}
        />
      )} */}
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
