import { useEffect } from "react";
import { Queries } from "@/hooks/queries";

import { storage, Storage } from "@/features/shared/lib/storage";

import { LastReadTitle } from "@/features/last-read-tracking/types/last-read-title";
import { logger } from "@/lib/logger";

export const useTitleChaptersUpdater = (title: LastReadTitle) => {
  const { data, isPending } = Queries.getRecentViewedTitle(
    title.slug_url,
    title.model
  );

  useEffect(() => {
    if (!data || isPending) return;

    if (data.items_count.uploaded > title.chapters) {
      logger.verbose(
        `${data.name} has new chapters ${title.chapters} -> ${data.items_count.uploaded}`
      );
      const lastReadTitles = storage.getString(Storage.lastReadTitles);
      if (!lastReadTitles) return;

      const filteredTitles = JSON.parse(lastReadTitles).filter(
        (title: LastReadTitle) => title.slug_url !== title.slug_url
      );
      logger.verbose(
        "file: last-read-card.tsx:47 ~ useEffect ~ filteredTitles:",
        filteredTitles
      );
      const newTitlePayload = {
        ...title,
        chapters: data.items_count.uploaded,
      };

      storage.set(
        Storage.lastReadTitles,
        JSON.stringify([filteredTitles, newTitlePayload])
      );
    }
  }, [data, isPending]);
};
