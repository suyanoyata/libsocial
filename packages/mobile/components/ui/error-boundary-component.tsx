import { reloadAppAsync } from "expo"

import { View } from "react-native"
import { Text } from "@/components/ui/text"

import { Lottie } from "@/components/ui/lottie"

import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

import { trpc } from "@/lib/trpc"

export const ErrorBoundaryComponent = ({ error }: { error: Error }) => {
  const { mutate } = useMutation(
    trpc.error.report.mutationOptions({
      onSettled: () => {
        setTimeout(() => reloadAppAsync(), 3000)
      },
    })
  )

  useEffect(() => {
    mutate({
      name: error.name,
      message: error.message,
      stack: error.stack ? `${error.stack.slice(0, 175)} < . . .>` : undefined,
      cause: error.cause ? String(error.cause) : undefined,
    })
  }, [])

  return (
    <View className="flex-1 items-center justify-center px-8 gap-2">
      <Lottie source={require("@/assets/emojis/sick-emoji.json")} />
      <Text className="text-secondary text-center font-bold text-xl">
        The app just crashed
      </Text>
      <Text className="text-muted font-medium">
        It will be restarted in a few seconds
      </Text>
    </View>
  )
}
