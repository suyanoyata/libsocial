import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

export const useCurrentUser = () => {
  return useQuery<{
    id: number;
    username: string;
    avatar: {
      url: string;
    };
  }>({
    queryKey: ["me"],
    queryFn: async () => await api.get("/auth/me").then((res) => res.data.data),
  });
};
