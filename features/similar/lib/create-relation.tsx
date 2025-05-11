import { BaseTitle } from "@/features/shared/types/title"
import i18n from "@/i18n"
import { api } from "@/lib/axios"
import { withErrorImpact, withSuccessImpact } from "@/lib/utils"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { router } from "expo-router"
import { toast } from "sonner-native"

export const useCreateRelation = ({
  slug_url,
  data,
}: {
  slug_url: string
  data: BaseTitle
}) => {
  const client = useQueryClient()
  return useMutation({
    mutationKey: ["add-relation", slug_url, data.slug_url],
    mutationFn: async ({ reason }: { reason: string }) => {
      return await api.post(
        `/${data.site == "5" ? "anime" : "manga"}/${slug_url}/relations`,
        {
          slug_url: data.slug_url,
          reason,
        }
      )
    },
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
            `related.${reason}`
          )}`,
        })
      )
      client.invalidateQueries({
        queryKey: [`title-relations`, slug_url],
      })
      router.back()
    },
  })
}
