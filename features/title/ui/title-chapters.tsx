import { ContentCollectionView } from "@/components/ui/content-collection-view";
import { Chapter } from "@/features/title/components/chapter-item";

import { useChapters } from "@/features/title/api/use-chapters";
import { useMemo, useState } from "react";

import { Chapter as ChapterType } from "@/features/shared/types/chapter";

export const TitleChapters = ({ slug_url, site }: { slug_url: string; site: number }) => {
  const { data } = useChapters(slug_url, site);

  const [descending, setDescending] = useState(false);

  const chapters = useMemo(() => {
    return descending ? data?.toReversed() : data;
  }, [descending, data]);

  const renderItem = ({ item }: { item: ChapterType }) => (
    <Chapter index={item.item_number - 1} slug_url={slug_url} chapter={item} />
  );

  const keyExtractor = (item: ChapterType) => item.id.toString();

  if (String(site) == "5" || !data) return null;

  return (
    <ContentCollectionView
      estimatedItemSize={45}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      descending={descending}
      title={`${data?.length} Chapters`}
      data={chapters}
      reverseCallback={() => setDescending((prev) => !prev)}
    />
  );
};
