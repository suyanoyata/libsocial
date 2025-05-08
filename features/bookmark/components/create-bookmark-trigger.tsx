import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/axios"
import { View } from "react-native"

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Icon } from "@/components/icon"

export const CreateBookmarkTrigger = ({
  slug_url,
  site,
}: {
  slug_url: string
  site: string
}) => {
  const client = useQueryClient()

  const { mutate } = useMutation({
    mutationKey: ["create-bookmark"],
    mutationFn: async () => {
      return await api.post("/bookmarks", {
        slug_url,
        type: site == "5" ? "anime" : "manga",
        name: "ongoing",
      })
    },
    onSuccess() {
      client.invalidateQueries({
        queryKey: ["bookmarks"],
      })
    },
  })

  return (
    <Sheet>
      <SheetTrigger variant="accent">
        <Icon name="Bookmark" size={18} strokeWidth={2.7} variant="accent" />
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Add bookmark</SheetTitle>
        <View className="mb-safe mt-auto gap-3">
          <Button onPress={mutate} variant="tonal" iconLeft="Plus">
            Create
          </Button>
          <Button
            onPress={async () => {
              await api.delete(
                `/bookmarks?slug_url=${slug_url}&type=${
                  site == "5" ? "anime" : "manga"
                }`
              )

              client.invalidateQueries({
                queryKey: ["bookmarks", site],
              })
            }}
            variant="destructive"
            iconLeft="Trash2"
          >
            Delete
          </Button>
        </View>
      </SheetContent>
    </Sheet>
  )
}
