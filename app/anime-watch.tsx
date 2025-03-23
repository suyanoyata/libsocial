import { AnimeStoreProvider } from "@/features/anime-player/context/anime-context";

import { AnimeWatchView } from "@/features/anime-player/ui/anime-watch-view";

export default function AnimeWatch() {
  return (
    <AnimeStoreProvider>
      <AnimeWatchView />
    </AnimeStoreProvider>
  );
}
