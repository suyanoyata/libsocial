import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

import { api } from "@/lib/axios"

export const useGenresConstants = () => {
  return useQuery(trpc.constants.get.queryOptions("genres"))
}

export const useAgeRestrictions = () => {
  return useQuery<{ id: number; label: string; site_ids: number[] }[]>({
    queryKey: ["age-restriction-constants"],
    queryFn: async () =>
      (await api.get("/constants?fields[]=ageRestriction")).data.data
        .ageRestriction,
    staleTime: Infinity,
  })
}
