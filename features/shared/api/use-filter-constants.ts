import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/axios"

export const useGenresConstants = () => {
  return useQuery<{ id: number; name: string; site_ids: number[] }[]>({
    queryKey: ["genres-constants"],
    queryFn: async () =>
      (await api.get("/constants?fields[]=genres")).data.data.genres,
    staleTime: Infinity,
  })
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
