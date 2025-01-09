import { useNavigation } from "expo-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { bookmarksConstants } from "@/features/bookmarks/constants/bookmarks-constants";

import { api } from "@/lib/axios";
import { logger } from "@/lib/logger";

export const useCreateBookmark = (
  media_slug: string,
  siteId: string,
  type: string
) => {
  const client = useQueryClient();
  const navigation: any = useNavigation();

  const bookmarks = bookmarksConstants.filter((bookmark) =>
    bookmark.site_ids.includes(Number(siteId))
  );

  return useMutation({
    mutationKey: ["bookmark", media_slug],
    mutationFn: async (index: number) => {
      if (!bookmarks[index]) {
        logger.warn(`pushBookmark: bookmark does not exist for ${index}`);
        return null;
      }
      const response = await api.post(
        `/bookmarks`,
        {
          media_type: type,
          media_slug,
          bookmark: {
            status: bookmarks[index].status,
          },
        },
        {
          headers: {
            "Site-Id": siteId,
          },
        }
      );
      return response.data.data.id;
    },
    onSuccess: (id: number, index: number) => {
      client.setQueryData(["bookmark", media_slug], {
        id,
        status: bookmarks[index].status,
      });
      navigation.goBack();
    },
  });
};
