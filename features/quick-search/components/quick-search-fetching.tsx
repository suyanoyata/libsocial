import { ActivityIndicator } from "react-native";
import { FadeView } from "@/components/ui/fade-view";

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search";

export const QuickSearchFetching = ({ q, live }: { q: string; live: string }) => {
  const { isFetching } = useQuickSearch(q);

  if (isFetching || (q != live && live)) {
    return (
      <FadeView
        withEnter
        className="absolute items-center justify-center flex-1 top-1/2 w-full"
      >
        <ActivityIndicator size="small" />
      </FadeView>
    );
  }
};
