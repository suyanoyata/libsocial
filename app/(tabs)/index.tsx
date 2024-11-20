import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { useQuery } from "@tanstack/react-query";
import { RefreshControl, SafeAreaView, ScrollView, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Button } from "@/components/button";
import { LucideRefreshCcw } from "lucide-react-native";
import i18n from "@/lib/intl";
import { TitleCard } from "@/components/title/title-card";

export default function HomeScreen() {
  const { isPending, error, data, refetch } = useQuery<{
    popular: Anime[];
  }>({
    queryKey: ["app-initial-main-page-data"],
    retry: false,
    queryFn: async () => {
      return api
        .get("/")
        .then((response) => {
          return response.data.data;
        })
        .catch((error) => console.error(error));
    },
  });

  if (isPending) {
    return <Loader />;
  }

  if (error) {
    return (
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={{
          height: "100%",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          {i18n.t("error.loading.text")}
        </Text>
        <Button
          onPress={() => {
            refetch();
          }}
          icon={<LucideRefreshCcw color="white" size={18} strokeWidth={2.4} />}
          style={{ marginTop: 12 }}
        >
          {i18n.t("error.loading.retry")}
        </Button>
      </Animated.View>
    );
  }

  return (
    <SafeAreaView>
      <Animated.ScrollView
        style={{ minHeight: "100%" }}
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
          {data!.popular.map((title) => (
            <TitleCard key={title.id} item={title} width={140} />
          ))}
        </ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
