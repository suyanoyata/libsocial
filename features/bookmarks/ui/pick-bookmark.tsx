import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { Conditional } from "@/components/misc/conditional";

import { Queries } from "@/hooks/queries";

import i18n from "@/lib/intl";

import { useRoute } from "@react-navigation/native";

import { useCreateBookmark } from "@/features/bookmarks/hooks/useCreateBookmark";
import { useDeleteBookmark } from "@/features/bookmarks/hooks/useDeleteBookmark";

import { bookmarksConstants } from "@/features/bookmarks/constants/bookmarks-constants";

export default function PickBookmarkUI() {
  const router = useRoute();
  const { type, media_slug, title, siteId } = router.params as any;

  const bookmarks = bookmarksConstants.filter((bookmark) =>
    bookmark.site_ids.includes(Number(siteId))
  );

  const { data: bookmark } = Queries.getBookmark(type, media_slug);

  const { mutate: pushBookmark } = useCreateBookmark(media_slug, siteId, type);
  const { mutate: removeBookmark } = useDeleteBookmark(
    media_slug,
    type,
    bookmark
  );

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
