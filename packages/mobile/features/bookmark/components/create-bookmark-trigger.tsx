import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Icon } from "@/components/icon"

import { useBookmarkAPI } from "@/features/bookmark/api/use-bookmark-api"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { BookmarkCreateSelectUI } from "@/features/bookmark/ui/bookmark-create-select"
import { ActivityIndicator } from "@/components/ui/activity-indicator"
import { textVariants } from "@/components/ui/button"
import { useSession } from "@/lib/auth"
import { router } from "expo-router"
import Animated, { BounceIn } from "react-native-reanimated"

export const CreateBookmarkTrigger = ({
  slug_url,
  site,
}: {
  slug_url: string
  site: number
}) => {
  const [open, setOpen] = useState(false)

  const type = site == 5 ? "anime" : "manga"

  const { data, isFetching } = useBookmarkAPI({
    slug_url,
    type,
  })

  const { data: sessionData } = useSession()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="disabled:opacity-80"
        disabled={isFetching}
        onPress={() => {
          if (sessionData) {
            setOpen(true)
          } else {
            router.push("/sign-in-prompt-modal")
          }
        }}
        variant="accent"
      >
        {isFetching ? (
          <ActivityIndicator
            className={textVariants({ variant: "accent" })}
            size={18}
          />
        ) : (
          <Animated.View entering={BounceIn.duration(500)}>
            <Icon
              name="Bookmark"
              size={18}
              strokeWidth={2.7}
              variant="accent"
              className={cn(
                data?.id && "dark:fill-violet-900 fill-white font-semibold"
              )}
            />
          </Animated.View>
        )}
      </SheetTrigger>
      <SheetContent className="h-auto">
        <BookmarkCreateSelectUI
          setOpen={setOpen}
          slug_url={slug_url}
          type={type}
        />
      </SheetContent>
    </Sheet>
  )
}
