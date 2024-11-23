import { Button } from "@/components/button";
import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { Conditional } from "@/components/misc/conditional";
import { Queries } from "@/hooks/queries";
import { api } from "@/lib/axios";
import { logger } from "@/lib/logger";
import { useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert, Text, View } from "react-native";

const bookmarks = [
  {
    label: "Читаю",
    status: 1,
  },
  {
    label: "В планах",
    status: 2,
  },
  {
    label: "Брошено",
    status: 3,
  },
  {
    label: "Прочитано",
    status: 4,
  },
  {
    label: "Любимые",
    status: 5,
  },
];

export default function PickBookmarkOption() {
  const router = useRoute();
  const { type, media_slug, title } = router.params as any;

  const { data: bookmark } = Queries.getBookmark(type, media_slug);

  const queryClient = useQueryClient();

  const { mutate: pushBookmark } = useMutation({
    mutationKey: ["bookmark", media_slug],
    mutationFn: async (index: number) => {
      const response = await api.post(`/bookmarks`, {
        media_type: type,
        media_slug,
        bookmark: {
          status: bookmarks[index].status,
        },
      });
      return response.data.data.id;
    },
    onSuccess: (id: number) => {
      queryClient.setQueryData(["bookmark", media_slug], id);
      Alert.alert("Успешно", `Тайтл добавлен в закладки`);
    },
  });

  const { mutate: removeBookmark } = useMutation({
    mutationKey: ["bookmark", media_slug],
    mutationFn: async () => {
      const response = await api.delete(`/bookmarks/${bookmark}`, {
        media_type: type,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.setQueryData(["bookmark", media_slug], 0);
      Alert.alert("Успешно", `Тайтл удален из закладок`);
    },
    onError: (err) => {
      logger.error(JSON.stringify(err.message));
    },
  });

  return (
    <ModalWrapper style={{ gap: 8 }} title={title}>
      {bookmarks.map((bookmark, index) => (
        <Button
          key={index}
          asChild
          onPress={() => {
            pushBookmark(index);
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "rgb(171,171,171)", fontWeight: "500" }}>
              {bookmark.label}
            </Text>
          </View>
        </Button>
      ))}
      <Conditional conditions={[bookmark != null]}>
        <Button
          asChild
          onPress={() => {
            removeBookmark();
          }}
        >
          <View
            style={{
              backgroundColor: "rgba(255,40,40,0.3)",
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 6,
            }}
          >
            <Text style={{ color: "rgb(171,171,171)", fontWeight: "500" }}>
              Удалить из списка
            </Text>
          </View>
        </Button>
      </Conditional>
    </ModalWrapper>
  );
}
