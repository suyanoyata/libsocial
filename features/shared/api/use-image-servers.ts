import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useImageServers = () => {
  return useQuery<{ id: number; label: string; url: string }[]>({
    queryKey: ["image-servers"],
    queryFn: async () =>
      (await api.get("/constants?fields[]=imageServers")).data.data.imageServers,
    staleTime: Infinity,
  });
};
