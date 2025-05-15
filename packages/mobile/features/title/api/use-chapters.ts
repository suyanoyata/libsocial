import { useQuery } from "@tanstack/react-query"

import { trpc } from "@/lib/trpc"

export const useChapters = (slug_url: string) => {
  return useQuery(trpc.chapters.list.queryOptions(slug_url))
}
