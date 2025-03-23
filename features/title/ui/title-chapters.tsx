import { Chapter } from "@/features/title/components/chapter-item";

import { TitleContext } from "@/features/title/context/title-context";
import { useContext, useEffect, useMemo, useState, useTransition } from "react";

import { useChapters } from "@/features/title/api/use-chapters";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

import { FlashList } from "@shopify/flash-list";
import { Button } from "@/components/ui/button";

import { SortAsc, SortDesc } from "lucide-react-native";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export const TitleChapters = ({ slug_url, site }: { slug_url: string; site: number }) => {
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url, site);

  const [isReversing, startReversing] = useTransition();
  const [descending, setDescending] = useState(true);

  const chapters = useMemo(() => {
    return descending ? data?.toReversed() : data;
  }, [descending, data]);

  if (String(site) == "5") return null;

  return (
    <View className={cn("flex-1", tab == "chapters" ? "flex" : "hidden")}>
      <Button
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Soft);
          startReversing(() => {
            setDescending((prev) => !prev);
          });
        }}
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
          "gap-2 mt-4 flex-1 opacity-100 duration-75 overflow-hidden",
          isReversing && "opacity-50"
        )}
        contentContainerStyle={{
          paddingBottom: bottom + 14,
        }}
        estimatedListSize={{
          height,
          width,
        }}
        keyExtractor={(item) => String(item.id)}
        removeClippedSubviews
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
