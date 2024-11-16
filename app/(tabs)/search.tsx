import { SafeAreaView, useWindowDimensions } from "react-native";
import { siteUrls } from "@/constants/app.constants";
import { api, site_id } from "@/lib/axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Animated from "react-native-reanimated";
import { TitleCard } from "@/components/title-card";
import { usePulseValue } from "@/hooks/usePulseValue";

export default function Search() {
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
  const opacity = usePulseValue();

  const { width } = useWindowDimensions();
  const { data, fetchNextPage } = useInfiniteQuery({
    queryKey: ["search-titles"],
    queryFn: async ({ pageParam }) => {
      return await api
        .get(
          `/${siteUrls[site_id].url}?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&site_id[]=${site_id}&page=${pageParam}`
        )
        .then((res) => res.data);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });

  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 8 }}>
      {!data && (
        <AnimatedFlashList
          style={{ opacity }}
          estimatedItemSize={150}
          numColumns={Math.floor(width / 140)}
          data={Array.from({ length: width / 36 })}
          renderItem={() => <TitleCard />}
        />
      )}
      {data && (
        <FlashList
          estimatedItemSize={1500}
          onEndReachedThreshold={0.8}
          onEndReached={() => fetchNextPage()}
          data={data.pages}
          renderItem={({ item }: { item: any }) => (
            <FlashList
              estimatedItemSize={Math.floor(width / 2.41)}
              numColumns={Math.floor(width / 140)}
              data={item.data}
              renderItem={({ item }: { item: any }) => (
                <TitleCard item={item} />
              )}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}
