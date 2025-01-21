import { BaseTitle } from "@/features/shared/types/title";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useHomeTitles = () => {
  return useQuery<{
    popular: BaseTitle[];
  }>({
    queryKey: ["home-titles"],
    queryFn: async () => (await api.get("/")).data.data,
  });
};
