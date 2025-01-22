import { useChapters } from "@/features/title/api/use-chapters";
import { Chapter } from "@/features/title/components/chapter-item";
import { TitleContext } from "@/features/title/context/title-context";
import { cn } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useContext } from "react";
import { useWindowDimensions, View } from "react-native";

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url);
  const { width } = useWindowDimensions();

  return (
    <View className="flex-1 min-h-screen">
      <FlashList
        className={cn(
          "mb-8 gap-2 mt-4 flex-1",
          tab == "chapters" ? "flex" : "hidden min-h-2"
        )}
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
