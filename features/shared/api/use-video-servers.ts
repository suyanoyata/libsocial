import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { VideoServer } from "@/features/shared/types/video-server";

export const useVideoServers = () => {
  return useQuery<VideoServer[]>({
    queryKey: ["video-servers"],
    queryFn: async () =>
      (await api.get("/constants?fields[]=videoServers")).data.data.videoServers,
    staleTime: Infinity,
  });
};
