import { useChapters } from "@/features/title/api/use-chapters";
import { Chapter } from "@/features/title/components/chapter-item";
import { TitleContext } from "@/features/title/context/title-context";
import { cn } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import { useContext } from "react";

export const TitleChapters = ({ slug_url }: { slug_url: string }) => {
  const tab = useContext(TitleContext);

  const { data } = useChapters(slug_url);

  return (
    <FlashList
      style={{
        minHeight: 200,
      }}
      className={cn("mb-8 gap-2 mt-4", tab == "chapters" ? "flex" : "hidden")}
      scrollEnabled={false}
      data={data}
      estimatedItemSize={48}
      renderItem={({ item, index }) => (
        <Chapter index={index} slug_url={slug_url} chapter={item} />
      )}
    />
  );
};
