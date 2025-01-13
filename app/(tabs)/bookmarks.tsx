import { Loader } from "@/components/fullscreen-loader";
import { TitleCard } from "@/features/shared/components/title-card";
import { useCurrentUser } from "@/features/users/api/useCurrentUser";
import { api } from "@/lib/axios";
import i18n from "@/lib/intl";
import { MasonryFlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { FlatList, SafeAreaView, ScrollView, Text, View } from "react-native";

export default function Bookmarks() {
  const { isPending, data } = useCurrentUser();
  const { data: bookmarks, isPending: isBookmarksLoading } = useQuery<any[]>({
    queryKey: ["bookmarks", data?.id],
    queryFn: async () => {
      if (isPending || !data?.id) return [];
      return (
        await api.get(
          `/bookmarks?page=1&sort_by=name&sort_type=desc&status=0&user_id=${data.id}`
        )
      ).data.data;
    },
  });

  if (isBookmarksLoading || !bookmarks) return <Loader />;

  return (
    <SafeAreaView>
      <FlatList
        contentContainerStyle={{
          justifyContent: "center",
          flexDirection: "row",
          flexWrap: "wrap",
          overflow: "hidden",
          gap: 14,
        }}
        data={bookmarks}
        renderItem={({ item }) => (
          <View
            style={{
              position: "relative",
              padding: 8,
              width: 150,
            }}
          >
            <View
              style={{
                zIndex: 4,
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "gray",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Text style={{ color: "white" }}>
                {i18n.t(`bookmarks.${item.status}`)}
              </Text>
            </View>
            <TitleCard item={item.media} />
          </View>
        )}
      />
    </SafeAreaView>
  );
}
