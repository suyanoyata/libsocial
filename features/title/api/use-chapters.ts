import { Chapter } from "@/features/shared/types/chapter";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useChapters = (slug_url: string) => {
  return useQuery<Chapter[]>({
    queryKey: ["chapters", slug_url],
    queryFn: async () => (await api.get(`/manga/${slug_url}/chapters`)).data.data,
  });
};
