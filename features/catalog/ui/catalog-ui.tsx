import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { Text } from "@/components/ui/text";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { FlashList } from "@shopify/flash-list";
import { BaseTitle } from "@/features/shared/types/title";
import { CatalogTitleCard } from "@/features/catalog/components/catalog-title-card";

export const Catalog = () => {
  const { top } = useSafeAreaInsets();

  const [search, setSearch] = useState("");
  const [query] = useDebounce(search, 500);

  const { data, isLoading } = useQuery<BaseTitle[]>({
    queryKey: ["catalog-search", query.trim()],
    queryFn: async () =>
      (
        await api.get(
          `/manga?fields[]=rate&fields[]=rate_avg&fields[]=userBookmark&q=${query.trim()}&site_id[]=1`
        )
      ).data.data,
    staleTime: 1000 * 60 * 2,
  });

  const listRef = useRef(null);

  const { width, height } = useWindowDimensions();
  const [columns, setColumns] = useState(3);

  const containerWidth = 125;

  useEffect(() => {
    if (!listRef || !listRef?.current) return;

    const width = listRef.current.rlvRef._layout.width;

    setColumns(Math.floor(width / containerWidth));
  }, [listRef]);

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

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ paddingTop: top + 4, paddingBottom: 10 }}
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
      <View className="flex-1 mx-2">
        {/* {isLoading || !data || search != query ? (
          <ActivityIndicator />
        ) : (
          
        )} */}

        {data && (
          <FlashList
            onLayout={() => {
              if (!listRef?.current) return;
              const width = listRef.current.rlvRef._layout.width;

              setColumns(Math.floor(width / containerWidth));
            }}
            ref={listRef}
            estimatedListSize={{
              width,
              height,
            }}
            numColumns={columns}
            estimatedItemSize={190}
            data={data}
            renderItem={({ item, index }) => (
              <View
                style={{
                  ...getItemStyle(index, columns),
                }}
              >
                <CatalogTitleCard title={item} />
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
};
