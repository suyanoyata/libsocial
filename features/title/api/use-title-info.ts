import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

import { siteIds } from "@/const/site-fields"

import { Title } from "@/features/shared/types/title"

export const useTitleInfo = (slug_url: string | undefined, site: string) => {
  const siteProperties = siteIds[site as "1"]

  return useQuery<Title>({
    queryKey: ["title-info", slug_url, site],
    queryFn: async () => {
      return (await api.get(`/${siteProperties.type}/${slug_url}`)).data.data
    },
    enabled: !!slug_url,
  })
}
