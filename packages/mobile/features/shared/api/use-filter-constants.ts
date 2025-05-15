import { useQuery } from "@tanstack/react-query"
import { trpc } from "@/lib/trpc"

export const useGenresConstants = () => {
  return useQuery(trpc.constants.get.queryOptions("genres"))
}

export const useAgeRestrictions = () => {
  return useQuery(trpc.constants.get.queryOptions("ageRestrictions"))
}
