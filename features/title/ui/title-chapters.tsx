import { Chapter } from "@/features/title/components/chapter-item";

import { TitleContext } from "@/features/title/context/title-context";
import { useContext } from "react";

import { useChapters } from "@/features/title/api/use-chapters";
import { useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

import { FlashList } from "@shopify/flash-list";

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const { width, height } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url);

  return (
    <View className={cn("flex-1", tab == "chapters" ? "flex" : "hidden")}>
      <FlashList
        className="gap-2 mt-4 flex-1"
        contentContainerStyle={{
          paddingBottom: bottom + 14,
        }}
        estimatedListSize={{
          height,
          width,
        }}
        scrollEnabled={false}
        data={data}
        estimatedItemSize={48}
        renderItem={({ item, index }) => (
          <Chapter index={index} slug_url={slug_url} chapter={item} />
        )}
      />
    </View>
  );
};
