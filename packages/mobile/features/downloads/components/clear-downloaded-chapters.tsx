import { Icon } from "@/components/icon"

import { router } from "expo-router"

import { Alert, Pressable as _Pressable } from "react-native"

import { useDownloads } from "@/features/downloads/store/use-downloads"
import Animated, { FadeIn } from "react-native-reanimated"

export const ClearDownloadedChapters = () => {
  const clear = useDownloads((state) => state.clear)
  const count = useDownloads((state) => state.items.length)

  const deleteEverything = () => {
    Alert.alert(
      "Delete all chapters",
      `You're about to delete all ${count} chapters that you've downloaded.\n\nAre you sure?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            router.back()
            clear()
          },
          style: "destructive",
        },
      ]
    )
  }

  if (count == 0) return

  const Pressable = Animated.createAnimatedComponent(_Pressable)

  return (
    <Pressable entering={FadeIn} onPress={deleteEverything}>
      <Icon name="Trash2" className="text-red-500" />
    </Pressable>
  )
}
