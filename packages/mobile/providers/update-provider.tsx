import {
  addUpdatesStateChangeListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates"

import { AppState } from "react-native"

import { useCallback, useEffect, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export const UpdateProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient()

  const focusCallback = useCallback(async (event: string) => {
    if (event == "background" || (event == "active" && !updating)) {
      const update = await checkForUpdateAsync()

      if (!update.isAvailable) return

      setUpdating(true)
      await fetchUpdateAsync()
      await reloadAsync()
      setUpdating(false)
    }
  }, [])

  useEffect(() => {
    AppState.addEventListener("change", focusCallback)
  }, [])

  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    addUpdatesStateChangeListener(async (listener) => {
      if (listener.context.isUpdatePending && !updating) {
        setUpdating(true)
        queryClient.clear()
        await reloadAsync()
      }
    })

    return () => {
      setUpdating(false)
    }
  }, [])

  return children
}
