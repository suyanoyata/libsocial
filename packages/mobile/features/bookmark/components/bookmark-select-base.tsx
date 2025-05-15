import { Button } from "@/components/ui/button"
import { View } from "react-native"

import { bookmarkOptions } from "@/features/bookmark/const/bookmark-options"

import type { BookmarkItem, BookmarkListItem } from "api/router/bookmarkRouter"

interface BookmarkSelectProps {
  data?: BookmarkItem | BookmarkListItem | null
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
          className="w-full"
          onPress={() => onSelect(option.value)}
          variant={data?.mark == option.value ? "accent" : "tonal"}
          key={option.value}
          iconLeft={option.icon}
        >
          {option.label}
        </Button>
      ))}
      {shouldShowDelete && data?.id && (
        <Button
          className="w-full"
          onPress={onDelete}
          variant="destructive"
          iconLeft="Trash2"
        >
          Delete
        </Button>
      )}
    </View>
  )
}
