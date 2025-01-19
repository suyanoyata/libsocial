import { RefreshControl, ScrollView, View, Text } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { TitleCard } from "@/features/shared/components/title-card";
import { Queries } from "@/hooks/queries";
import { QuickSearchNavigationComponent } from "@/components/quick-search-navigation-component";
import { PlaceholderFlashingComponent } from "@/components/misc/placeholder-flashing-component";
import { Conditional } from "@/components/misc/conditional";

import { LastReadTitles } from "@/features/last-read-tracking/ui/last-read-titles";
// import { Storage, storage } from "@/features/shared/lib/storage";

export default function HomeScreen() {
  const { isPending, data, refetch } = Queries.firstLoadData();

  Queries.filterConstants();

  // storage.delete(Storage.lastReadTitles);

  return (
    <View style={{ flex: 1 }}>
      <QuickSearchNavigationComponent />
      <Animated.ScrollView
        style={{ minHeight: "100%", paddingTop: 12 }}
        refreshControl={<RefreshControl refreshing={isPending} onRefresh={refetch} />}
        entering={FadeIn}
      >
        <ScrollView
          horizontal
          contentContainerStyle={{
            gap: 16,
            paddingHorizontal: 16,
            display: "flex",
            flexDirection: "row",
          }}
          showsHorizontalScrollIndicator={false}
        >
          <Conditional conditions={[!!data]}>
            {data?.map((title) => <TitleCard key={title.id} item={title} width={140} />)}
          </Conditional>
          <Conditional conditions={[!data]}>
            <PlaceholderFlashingComponent style={{ flexDirection: "row", gap: 16 }}>
              {Array.from({ length: 10 }).map(() => (
                <TitleCard width={140} />
              ))}
            </PlaceholderFlashingComponent>
          </Conditional>
        </ScrollView>
        <LastReadTitles />
      </Animated.ScrollView>
    </View>
  );
}
