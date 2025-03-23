import { useQuery } from "@tanstack/react-query";

import { BaseTitle } from "@/features/shared/types/title";
import { api } from "@/lib/axios";

export const useHomeTitles = () => {
  return useQuery<{
    popular: BaseTitle[];
  }>({
    queryKey: ["home-titles"],
    queryFn: async () => {
      return (await api.get("")).data.data;
    },
  });
};
