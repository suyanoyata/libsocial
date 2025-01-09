import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/axios";

export const useBookmark = (type: string, slug_url: string) => {
  return useQuery({
    queryKey: ["bookmark", slug_url],
    queryFn: async () => {
      const response = await api.get(`/${type}/${slug_url}/bookmark`);

      if (response.data.data == null) {
        return {
          id: 0,
          status: "",
        };
      }
      return {
        id: response.data.data.id,
        status: response.data.data.status,
      };
    },
  });
};
