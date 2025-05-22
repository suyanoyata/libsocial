import { trpc } from "@/lib/trpc"
import { useQuery } from "@tanstack/react-query"

import { useProperties } from "@/store/use-properties"

export const useQuickSearch = (q: string) => {
  const { siteId } = useProperties()

  return useQuery(
    trpc.search.quick.queryOptions(
      { q, _s: siteId },
      {
        trpc: { abortOnUnmount: true },
        enabled: !!q,
      }
    )
  )
}
