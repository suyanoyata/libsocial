import { ScrollView, View } from "react-native"

import { QuickSearchCard } from "@/features/quick-search/components/quick-search-card"

import { useQuickSearch } from "@/features/quick-search/api/use-quick-search"
import { FlashList } from "@shopify/flash-list"
import { FadeView } from "@/components/ui/fade-view"

export const QuickSearchContent = ({
  q,
  live,
}: {
  q: string
  live: string
}) => {
  const { data } = useQuickSearch(q)

  if (data && q == live) {
    return (
      <FadeView withEnter className="flex-1">
        <FlashList
          estimatedItemSize={160}
          data={data}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View className="h-8"></View>}
          renderItem={({ item }) => <QuickSearchCard item={item} />}
        />
      </FadeView>
    )
  }
}
