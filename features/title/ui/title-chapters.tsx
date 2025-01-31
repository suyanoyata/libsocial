import { Chapter } from "@/features/title/components/chapter-item";

import { TitleContext } from "@/features/title/context/title-context";
import { useContext, useEffect, useState, useTransition } from "react";

import { useChapters } from "@/features/title/api/use-chapters";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

import { FlashList } from "@shopify/flash-list";
import { Button } from "@/components/ui/button";

import { SortAsc, SortDesc } from "lucide-react-native";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url);

  const [isReversing, startReversing] = useTransition();
  const [descending, setDescending] = useState(true);
  const [chapters, setChapters] = useState(data);

  useEffect(() => {
    setChapters(data);
  }, [data]);

  return (
    <View className={cn("flex-1", tab == "chapters" ? "flex" : "hidden")}>
      <Button
        onPress={() => {
          impactAsync(ImpactFeedbackStyle.Soft);
          startReversing(() => {
            setDescending((prev) => !prev);

            setChapters((prev) => prev?.toReversed());
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
