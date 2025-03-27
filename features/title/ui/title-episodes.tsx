import { ContentCollectionView } from "@/components/ui/content-collection-view";
import { Episode } from "@/features/title/components/episode-item";

import { useEpisodesAPI } from "@/features/title/api/use-episodes-api";
import { useMemo, useState } from "react";

import { TitleEpisodeBase } from "@/features/title/types/title-episodes-response";

export const TitleEpisodes = ({ slug_url, site }: { slug_url: string; site: number }) => {
  const { data } = useEpisodesAPI(slug_url, site);

  const [descending, setDescending] = useState(false);

  const episodes = useMemo(() => {
    return descending ? data?.toReversed() : data;
  }, [descending, data]);

  const keyExtractor = (item: TitleEpisodeBase) => item.id.toString();

  const renderItem = ({ item }: { item: TitleEpisodeBase }) => (
    <Episode slug_url={slug_url} episode={item} index={item.item_number} />
  );

  if (!data) return null;

  return (
    <ContentCollectionView
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      title={`${data?.length} Episodes`}
      data={episodes}
      estimatedItemSize={45}
      reverseCallback={() => setDescending((prev) => !prev)}
      descending={descending}
    />
  );
};
