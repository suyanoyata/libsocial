import { BaseTitle } from "@/features/shared/types/title"
import { api } from "@/lib/axios"
import { useProperties } from "@/store/use-properties"
import { useQuery } from "@tanstack/react-query"

export const useQuickSearch = (q: string, signal?: AbortSignal) => {
  const { siteId } = useProperties()

  return useQuery<BaseTitle[]>({
    queryKey: ["quick-search", q, siteId],
    queryFn: async () => {
      if (!q) {
        return []
      }
      return (
        await api.get(
          `/${siteId == "5" ? "anime" : "manga"}?q=${q}&site_id[]=1`,
          {
            signal,
          },
        )
      ).data.data
    },
  })
}
