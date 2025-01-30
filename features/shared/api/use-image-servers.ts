import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ImageServer } from "@/features/shared/types/image-server";

export const useImageServers = () => {
  return useQuery<ImageServer[]>({
    queryKey: ["image-servers"],
    queryFn: async () =>
      (await api.get("/constants?fields[]=imageServers")).data.data.imageServers,
    staleTime: Infinity,
  });
};
