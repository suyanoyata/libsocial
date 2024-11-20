import { api } from "@/lib/axios";
import { Button } from "@/components/button";
import { ActivityIndicator, Alert } from "react-native";
import { Bookmark } from "lucide-react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import i18n from "@/lib/intl";

export const AddToBookmarksButton = ({
  color,
  status,
  type,
  slug_url,
}: {
  color?: string;
  status: number;
  type: string;
  slug_url: string;
}) => {
  const queryClient = useQueryClient();

  const { data: bookmark, isFetching } = useQuery({
    queryKey: ["bookmark", slug_url],
    queryFn: async () => {
      const response = await api.get(`/${type}/${slug_url}/bookmark`);
      return !!response.data.data;
    },
  });

  const { mutate: pushBookmark } = useMutation({
    mutationKey: ["bookmark", slug_url],
    mutationFn: async () => {
      const response = await api.post(`/bookmarks`, {
        media_type: type,
        media_slug: slug_url,
        bookmark: {
          status,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["bookmark", slug_url], true);
      Alert.alert("Успешно", `Тайтл добавлен в закладки`);
    },
  });

  return (
    <Button
      style={{
        backgroundColor: color ?? "gray",
        flex: 1,
      }}
      icon={
        !isFetching && (
          <Bookmark
            strokeWidth={3}
            size={18}
            color="white"
            fill={bookmark ? "white" : "transparent"}
          />
        )
      }
      onPress={pushBookmark}
    >
      {!isFetching ? (
        i18n.t("content.bookmark.add")
      ) : (
        <ActivityIndicator color="white" />
      )}
    </Button>
  );
};
