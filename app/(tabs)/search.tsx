import {
  useWindowDimensions,
  ActivityIndicator,
  View,
  Text,
  FlatList,
} from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Animated from "react-native-reanimated";

import { siteUrls } from "@/constants/app.constants";

import { api, site_id } from "@/lib/axios";

import { TitleCard } from "@/components/title/title-card";

import SearchLayout from "../layouts/search-layout";
import { useCatalogSearchStore } from "@/hooks/useCatalogSearchStore";
import { useFiltersStore } from "@/hooks/useFiltersStore";
import i18n from "@/lib/intl";
import { Conditional } from "@/components/misc/conditional";
import { PlaceholderFlashingComponent } from "@/components/misc/placeholder-flashing-component";

export default function Search() {
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

  const { width } = useWindowDimensions();
  const { search } = useCatalogSearchStore();
  const { filters } = useFiltersStore();

  // #region catalog infinite fetching
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["search-titles", search, filters],
    queryFn: async ({ pageParam }) => {
      let call = `/${siteUrls[site_id].url}?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&site_id[]=${site_id}&page=${pageParam}`;

      // hold on, this typing is https://media.tenor.com/SeLBRCUiQaoAAAAe/absolute-cinema-cinema.png
      Object.keys(filters).forEach((filter: string) => {
        if ((filters as Record<string, any[]>)[filter].length > 0) {
          (filters as Record<string, any[]>)[filter].forEach((value: any) => {
            call += `&${filter}[]=${value}`;
          });
        }
      });

      if (search !== "") {
        call += `&q=${search}`;
      }
      return await api.get(call).then((res) => res.data);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.links.next == null) return undefined;
      return lastPage.meta.current_page + 1;
    },
    initialPageParam: 1,
  });
  // #endregion

  return (
    <SearchLayout>
      <Conditional conditions={[!data]}>
        <PlaceholderFlashingComponent>
          <AnimatedFlashList
            estimatedItemSize={150}
            numColumns={Math.floor(width / 140)}
            data={Array.from({ length: width / 36 })}
            renderItem={() => <TitleCard />}
          />
        </PlaceholderFlashingComponent>
      </Conditional>
      <Conditional
        conditions={[
          data?.pages.length == 0,
          search != "",
          filters.genres.length > 0,
        ]}
      >
        <View style={{ justifyContent: "center", flex: 1 }}>
          <Text style={{ color: "white", textAlign: "center" }}>
            {i18n.t("search.not_found")}
          </Text>
        </View>
      </Conditional>
      {data && (
        <FlatList
          removeClippedSubviews
          keyExtractor={(item) => item.meta.current_page.toString()}
          onEndReachedThreshold={0.8}
          onEndReached={() => fetchNextPage()}
          data={data.pages}
          ListFooterComponent={() => {
            if (isFetchingNextPage) {
              return (
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator color="white" />
                </View>
              );
            }
          }}
          renderItem={({ item }: { item: any }) => (
            <FlashList
              removeClippedSubviews
              estimatedItemSize={235}
              numColumns={Math.floor(width / 140)}
              data={item.data}
              renderItem={({ item }: { item: any }) => (
                <TitleCard item={item} />
              )}
            />
          )}
        />
      )}
    </SearchLayout>
  );
}
