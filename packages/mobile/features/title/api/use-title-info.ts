import { useQuery } from "@tanstack/react-query"

import { trpc } from "@/lib/trpc"

export const useTitleInfo = (slug_url: string, site: string) => {
  return useQuery(
    trpc.titles.get.title.queryOptions({ slug_url }, { enabled: !!slug_url })
  )
}
