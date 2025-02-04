import { Chapter } from "@/features/title/components/chapter-item";

import { TitleContext } from "@/features/title/context/title-context";
import { useCallback, useContext, useMemo, useState, useTransition } from "react";

import { useChapters } from "@/features/title/api/use-chapters";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

import { FlashList } from "@shopify/flash-list";
import { Button } from "@/components/ui/button";

import { SortAsc, SortDesc } from "lucide-react-native";

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url);

  const [isReversing, startReversing] = useTransition();
  const [descending, setDescending] = useState(true);

  const chapters = useMemo(() => {
    if (!data) return null;

    if (descending) return data;

    return data.toReversed();
  }, [data, descending]);

  const handleSortPress = useCallback(() => {
    startReversing(() => {
      setDescending((prev) => !prev);
    });
  }, [startReversing]);

  return (
    <View className={cn("flex-1", tab == "chapters" ? "flex" : "hidden")}>
      <Button
        onPress={handleSortPress}
        variant="ghost"
        className="rounded-full w-28"
        iconLeft={
          !descending ? (
            <SortDesc className="text-zinc-200" size={18} />
          ) : (
            <SortAsc className="text-zinc-200" size={18} />
          )
        }
      >
        Order
      </Button>
      <FlashList
        className={cn(
          "gap-2 mt-4 flex-1 opacity-100 duration-75",
          isReversing && "opacity-50"
        )}
        contentContainerStyle={{
          paddingBottom: bottom + 14,
        }}
        estimatedListSize={{
          height,
          width,
        }}
        scrollEnabled={false}
        data={chapters}
        estimatedItemSize={48}
        renderItem={({ item }) => (
          <Chapter index={item.item_number - 1} slug_url={slug_url} chapter={item} />
        )}
      />
    </View>
  );
};
