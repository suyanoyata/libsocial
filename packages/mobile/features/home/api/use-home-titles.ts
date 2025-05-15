import { useQuery } from "@tanstack/react-query"

import { trpc } from "@/lib/trpc"

export const useHomeTitles = () => {
  return useQuery(trpc.titles.popular.queryOptions())
}
