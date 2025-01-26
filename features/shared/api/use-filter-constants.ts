import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useGenresConstants = () => {
  return useQuery<{ id: number; name: string; site_ids: number[] }[]>({
    queryKey: ["genres-constants"],
    queryFn: async () => (await api.get("/constants?fields[]=genres")).data.data.genres,
    staleTime: Infinity,
  });
};
