import { Button } from "@/components/ui/button"
import { View } from "react-native"

import { bookmarkOptions } from "@/features/bookmark/const/bookmark-options"

import { Bookmark } from "@/features/bookmark/types/bookmark"

interface BookmarkSelectProps {
  data?: Bookmark | null
  onSelect: (value: string) => void
  onDelete?: () => void
  shouldShowDelete?: boolean
}

export const BookmarkSelectBase = ({
  data,
  onSelect,
  onDelete,
  shouldShowDelete = true,
}: BookmarkSelectProps) => {
  return (
    <View className="mb-safe mt-auto gap-3">
      {bookmarkOptions.map((option) => (
        <Button
          onPress={() => onSelect(option.value)}
          variant="tonal"
          key={option.value}
          iconLeft={option.icon}
        >
          {option.label}
        </Button>
      ))}
      {shouldShowDelete && data?.id && (
        <Button onPress={onDelete} variant="destructive" iconLeft="Trash2">
          Delete
        </Button>
      )}
    </View>
  )
}
