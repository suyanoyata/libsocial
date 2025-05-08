import { useRoute } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { View } from "react-native"
import { router } from "expo-router"

import { Button } from "@/components/ui/button"

import { Chapter } from "@/features/shared/types/chapter"
import { Icon } from "@/components/icon"
import { useQueryClient } from "@tanstack/react-query"

export const ReaderChapterNavigation = ({
  chapters,
  chapterIndex,
}: {
  chapters: Chapter[]
  chapterIndex: number
}) => {
  const { bottom } = useSafeAreaInsets()

  const client = useQueryClient()

  const route = useRoute()

  const { slug_url } = route.params as { slug_url: string }

  const previousChapter = chapters[chapterIndex - 1] != undefined
  const nextChapter = chapters[chapterIndex + 1] != undefined

  return (
    <View className="flex-row m-2 gap-2" style={{ paddingBottom: bottom }}>
      {previousChapter && (
        <Button
          iconLeft={
            <Icon name="ChevronLeft" strokeWidth={3} className="text-white" />
          }
          variant="accent"
          onPress={() =>
            router.replace({
              pathname: "/manga-reader",
              params: {
                slug_url,
                index: chapterIndex - 1,
              },
            })
          }
          className="flex-1"
        >
          Previous Chapter
        </Button>
      )}
      {nextChapter && (
        <Button
          iconRight={
            <Icon name="ChevronRight" strokeWidth={3} className="text-white" />
          }
          variant="accent"
          onPress={() => {
            client.invalidateQueries({
              queryKey: ["bookmarks"],
            })

            router.replace({
              pathname: "/manga-reader",
              params: {
                slug_url,
                index: chapterIndex + 1,
              },
            })
          }}
          className="flex-1"
        >
          Next Chapter
        </Button>
      )}
    </View>
  )
}
