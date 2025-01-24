import { TextInput, useWindowDimensions, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Search } from "lucide-react-native";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useState } from "react";

import useDebounce from "@/hooks/use-debounce";
import { useProperties } from "@/store/use-properties";

import { api } from "@/lib/axios";

import { CatalogTitleCard } from "@/features/catalog/components/catalog-title-card";

import { BaseTitle } from "@/features/shared/types/title";
import { TitleCardPlaceholder } from "@/features/home/components/title-card-placeholder";
import { PulseView } from "@/components/ui/pulse-view";

export const Catalog = () => {
  const { top } = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [initialRender, setInitialRender] = useState(true);

  const [query] = useDebounce(search, 500);

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<{
    data: BaseTitle[];
  }>({
    queryKey: ["catalog-search", query.trim()],
    initialPageParam: 1,
    queryFn: async ({ pageParam }) =>
      (
        await api.get(
          `/manga?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&q=${query.trim()}&site_id[]=1&page=${pageParam}`
        )
      ).data,
    staleTime: 1000 * 60 * 1,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.data?.length != 0 && allPages?.length < 10) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const { width, height } = useWindowDimensions();
  const { catalogColumns, setCatalogColumns } = useProperties();

  const containerWidth = 125;

  const getItemStyle = (index: number, numColumns: number) => {
    const alignItems = (() => {
      if (numColumns < 2 || index % numColumns === 0) return "flex-start";
      if ((index + 1) % numColumns === 0) return "flex-end";

      return "center";
    })();

    return {
      alignItems,
      width: "100%",
    } as const;
  };

  useEffect(() => {
    if (Math.floor(width / containerWidth) != catalogColumns) {
      setCatalogColumns(Math.floor(width / containerWidth));
    }
    setInitialRender(false);
  }, []);

  const catalogItems = useMemo(
    () => data?.pages.reduce<BaseTitle[]>((acc, page) => acc.concat(page.data), []),
    [data]
  );

  if (Math.floor(width / containerWidth) != catalogColumns && initialRender) return null;

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ paddingTop: top + 8, paddingBottom: 10 }}
        className="bg-zinc-950 px-2"
      >
        <View className="bg-zinc-900 px-4 py-2 h-10 items-center flex-row font-medium rounded-md">
          <TextInput
            onChangeText={setSearch}
            placeholder="Search..."
            placeholderTextColor="#52525b"
            className="text-zinc-400 font-medium flex-1 pl-5"
          />
          <Search className="text-zinc-400 absolute left-1.5" size={20} />
        </View>
      </View>
      {data && (
        <View className="flex-1 mx-2">
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
            ListFooterComponent={() =>
              isFetchingNextPage && (
                <PulseView className="flex-1 -mt-8">
                  <FlashList
                    removeClippedSubviews
                    data={Array.from({ length: 60 })}
                    onEndReachedThreshold={0.8}
                    estimatedListSize={{
                      width,
                      height,
                    }}
                    drawDistance={height * 2}
                    numColumns={catalogColumns}
                    estimatedItemSize={190}
                    renderItem={({ index }: { index: number }) => (
                      <View
                        className="mb-2"
                        style={{
                          ...getItemStyle(index, catalogColumns),
                        }}
                      >
                        <TitleCardPlaceholder />
                      </View>
                    )}
                  />
                </PulseView>
              )
            }
          />
        </View>
      )}
    </View>
  );
};
