import { FlashList } from "@shopify/flash-list";

import { useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { useFilterStore } from "@/features/catalog/store/use-filter-store";
import useDebounce from "@/hooks/use-debounce";

import { useProperties } from "@/store/use-properties";

import { BaseTitle } from "@/features/shared/types/title";

import { useCatalogAPI } from "@/features/catalog/api/use-catalog-api";

import { getItemStyle } from "@/features/catalog/lib/item-position-align";

import { FetchingNextPageCards } from "@/features/catalog/components/catalog-fetching-cards";
import { CatalogHeader } from "@/features/catalog/components/catalog-header";
import { CatalogTitleCard } from "@/features/catalog/components/catalog-title-card";

export const Catalog = () => {
  const [initialRender, setInitialRender] = useState(true);

  const { search } = useFilterStore();
  const [query] = useDebounce(search, 500);

  const { data, isFetchingNextPage, fetchNextPage } = useCatalogAPI(query);

  const { width, height } = useWindowDimensions();
  const { catalogColumns, setCatalogColumns } = useProperties();

  const containerWidth = 125;

  useEffect(() => {
    if (Math.floor(width / containerWidth) != catalogColumns) {
      setCatalogColumns(Math.floor(width / containerWidth));
    }
    setInitialRender(false);
  }, [width]);

  const catalogItems = useMemo(
    () => data?.pages.reduce<BaseTitle[]>((acc, page) => acc.concat(page.data), []),
    [data]
  );

  if (Math.floor(width / containerWidth) != catalogColumns || initialRender) return null;

  return (
    <View style={{ flex: 1 }}>
      <CatalogHeader />
      {data && (
        <View className="flex-1 mx-2 overflow-hidden rounded-sm">
          <FlashList
            removeClippedSubviews
            data={catalogItems}
            onEndReachedThreshold={0.8}
            onEndReached={() => fetchNextPage()}
            estimatedListSize={{
              width,
              height,
            }}
            drawDistance={height * 3}
            numColumns={catalogColumns}
            estimatedItemSize={190}
            renderItem={({ item, index }: { item: BaseTitle; index: number }) => (
              <View
                style={{
                  ...getItemStyle(index, catalogColumns),
                }}
              >
                <CatalogTitleCard title={item} />
              </View>
            )}
            ListFooterComponent={
              <FetchingNextPageCards
                isFetching={isFetchingNextPage && data.pages.length >= 10}
              />
            }
          />
        </View>
      )}
    </View>
  );
};
