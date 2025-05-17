import i18n from "@/i18n"
import { router } from "expo-router"
import { toast } from "sonner-native"

import { withErrorImpact, withSuccessImpact } from "@/lib/utils"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { BaseTitle } from "@/features/shared/types/title"

export const useCreateSimilar = ({
  slug_url,
  data,
}: {
  slug_url: string
  data: BaseTitle
}) => {
  const client = useQueryClient()

  return useMutation(
    trpc.titles.similar.add.mutationOptions({
      onError(e) {
        const error = e as unknown as {
          error: string
        }
        withErrorImpact(() =>
          toast.error("Failed while adding relation", {
            description: error.error,
            duration: 2500,
          })
        )
      },
      onSuccess() {
        withSuccessImpact(() =>
          toast.success("Success", {
            description: `Added ${data.eng_name ?? data.name} as ${i18n.t(
              // @ts-ignore
              `similar.${reason}`
            )}`,
          })
        )
        client.invalidateQueries({
          queryKey: trpc.titles.similar.list.queryKey({ slug_url }),
        })
        router.back()
      },
    })
  )
}
