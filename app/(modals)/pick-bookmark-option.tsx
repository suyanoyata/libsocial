import { Button } from "@/components/button";
import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { Conditional } from "@/components/misc/conditional";
import { bookmarksConstants } from "@/constants/bookmarks.constants";
import { Queries } from "@/hooks/queries";
import { api } from "@/lib/axios";
import i18n from "@/lib/intl";
import { logger } from "@/lib/logger";
import { useRoute } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { Text, View } from "react-native";

export default function PickBookmarkOption() {
  const router = useRoute();
  const navigation: any = useNavigation();
  const { type, media_slug, title, siteId } = router.params as any;

  // prettier-ignore
  const bookmarks = bookmarksConstants.filter((bookmark) => bookmark.site_ids.includes(Number(siteId)))

  const { data: bookmark } = Queries.getBookmark(type, media_slug);

  const queryClient = useQueryClient();

  const { mutate: pushBookmark } = useMutation({
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
      queryClient.setQueryData(["bookmark", media_slug], {
        id,
        status: bookmarks[index].status,
      });
      navigation.goBack();
    },
  });

  const { mutate: removeBookmark } = useMutation({
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
      queryClient.setQueryData(["bookmark", media_slug], null);
      navigation.goBack();
    },
    onError: (err) => {
      logger.error(JSON.stringify(err.message));
    },
  });

  return (
    <ModalWrapper style={{ gap: 8 }} title={title}>
      <Conditional conditions={[bookmarks.length != 0]}>
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
                {i18n.t(`bookmarks.${bookmark.status}`)}
              </Text>
            </View>
          </Button>
        ))}
      </Conditional>
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
