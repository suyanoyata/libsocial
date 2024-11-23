import { RefreshControl, SafeAreaView, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { TitleCard } from "@/components/title/title-card";
import { Queries } from "@/hooks/queries";
import { QuickSearchNavigationComponent } from "@/components/quick-search-navigation-component";
import { PlaceholderFlashingComponent } from "@/components/misc/placeholder-flashing-component";
import { Conditional } from "@/components/misc/conditional";

export default function HomeScreen() {
  const { isPending, data, refetch } = Queries.firstLoadData();
  Queries.filterConstants();

  return (
    <SafeAreaView>
      <QuickSearchNavigationComponent />
      <Animated.ScrollView
        style={{ minHeight: "100%", paddingTop: 12 }}
        refreshControl={
          <RefreshControl refreshing={isPending} onRefresh={refetch} />
        }
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
            {data?.popular.map((title) => (
              <TitleCard key={title.id} item={title} width={140} />
            ))}
          </Conditional>

          <Conditional conditions={[!data]}>
            <PlaceholderFlashingComponent
              style={{ flexDirection: "row", gap: 16 }}
            >
              {Array.from({ length: 10 }).map(() => (
                <TitleCard width={140} />
              ))}
            </PlaceholderFlashingComponent>
          </Conditional>
        </ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
