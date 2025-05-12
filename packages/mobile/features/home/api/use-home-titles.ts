import { useQuery } from "@tanstack/react-query"

import { BaseTitle } from "@/features/shared/types/title"
import { api } from "@/lib/axios"
import { useProperties } from "@/store/use-properties"

export const useHomeTitles = () => {
  const { siteId } = useProperties()
  return useQuery<{
    popular: BaseTitle[]
  }>({
    queryKey: ["home-titles", siteId],
    queryFn: async () => {
      const {
        data: { data },
      } = await api.get("/")

      return data
    },
  })
}
