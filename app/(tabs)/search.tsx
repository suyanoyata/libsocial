import {
  useWindowDimensions,
  ActivityIndicator,
  View,
  Text,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { FlashList } from "@shopify/flash-list";
import Animated from "react-native-reanimated";

import { siteUrls } from "@/constants/app.constants";

import { api, site_id } from "@/lib/axios";

import { TitleCard } from "@/components/title-card";

import { usePulseValue } from "@/hooks/usePulseValue";
import { SearchLayout } from "../layouts/search-layout";
import { useCatalogSearchStore } from "@/hooks/useCatalogSearchStore";
import { useFiltersStore } from "@/hooks/useFiltersStore";
import i18n from "@/lib/intl";

export default function Search() {
  const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);
  const opacity = usePulseValue();

  const { width } = useWindowDimensions();
  const { search } = useCatalogSearchStore();
  const { filters } = useFiltersStore();

  // #region catalog infinite fetching
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["search-titles", search, filters],
    queryFn: async ({ pageParam }) => {
      let call = `/${siteUrls[site_id].url}?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&site_id[]=${site_id}&page=${pageParam}`;

      Object.keys(filters).forEach((filter) => {
        if (filters[filter].length > 0) {
          filters[filter].forEach((value) => {
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
      if (lastPage.meta.has_next_page == false) return undefined;
      return lastPage.meta.page + 1;
    },
    initialPageParam: 1,
  });
  // #endregion

  // #region filters fetch
  useQuery({
    queryKey: ["filters-constants"],
    queryFn: async () => {
      return await api
        .get(
          "/constants?fields[]=genres&fields[]=tags&fields[]=types&fields[]=scanlateStatus&fields[]=status&fields[]=format&fields[]=ageRestriction"
        )
        .then((res) => res.data.data);
    },
  });
  // #endregion

  return (
    <SearchLayout>
      {!data && (
        <AnimatedFlashList
          style={{ opacity }}
          estimatedItemSize={150}
          numColumns={Math.floor(width / 140)}
          data={Array.from({ length: width / 36 })}
          renderItem={() => <TitleCard />}
        />
      )}
      {data?.pages.length == 0 &&
        (search != "" || filters.genres.length > 0) && (
          <View style={{ justifyContent: "center", flex: 1 }}>
            <Text style={{ color: "white", textAlign: "center" }}>
              {i18n.t("search.not_found")}
            </Text>
          </View>
        )}
      {data && (
        <FlashList
          estimatedItemSize={1500}
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
    </SearchLayout>
  );
}
