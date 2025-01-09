import { useNavigation } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/axios";
import { logger } from "@/lib/logger";

export const useDeleteBookmark = (
  media_slug: string,
  type: string,
  bookmark: { id: any } | undefined
) => {
  const navigation: any = useNavigation();
  const client = useQueryClient();

  return useMutation({
    mutationKey: ["bookmark", media_slug],
    mutationFn: async () => {
      const response = await api.delete(`/bookmarks/${bookmark?.id}`, {
        data: {
          media_type: type,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      client.setQueryData(["bookmark", media_slug], {
        id: 0,
        status: "",
      });
      navigation.goBack();
    },
    onError: (err) => {
      logger.error(JSON.stringify(err.message));
    },
  });
};
