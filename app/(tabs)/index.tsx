import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { useQuery } from "@tanstack/react-query";
import {
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { siteUrls } from "@/constants/app.constants";
import { Button } from "@/components/button";
import { LucideRefreshCcw } from "lucide-react-native";

const ranobeobj = {
  metadata: {
    last_item: {
      number: 12,
    },
  },
  id: 62340,
  name: "Otonari no tenshi-sama ni itsunomanika dame ningen ni sa rete ita kudan (Web-Novel) (Novel)",
  rus_name: "Ангел по соседству (Веб-Новелла) (Новелла)",
  eng_name: "The Angel Next Door Spoils Me Rotten (Web-Novel)",
  slug: "the-angel-next-door-spoils-me-rotten",
  slug_url: "62340--the-angel-next-door-spoils-me-rotten",
  cover: {
    filename: "5iZl7GQ19AUw",
    thumbnail:
      "https://cover.imgslib.link/uploads/cover/the-angel-next-door-spoils-me-rotten/cover/5iZl7GQ19AUw_thumb.jpg",
    default:
      "https://cover.imgslib.link/uploads/cover/the-angel-next-door-spoils-me-rotten/cover/5iZl7GQ19AUw_250x350.jpg",
    md: "https://cover.imgslib.link/uploads/cover/the-angel-next-door-spoils-me-rotten/cover/5iZl7GQ19AUw_250x350.jpg",
  },
  ageRestriction: {
    id: 3,
    label: "16+",
  },
  site: 3,
  type: {
    id: 10,
    label: "Япония",
  },
  releaseDate: "2018",
  rating: {
    average: "9.72",
    averageFormated: "9.7",
    votes: 1407,
    votesFormated: "1.4 K",
    user: 0,
  },
  model: "manga",
  status: {
    id: 4,
    label: "Приостановлен",
  },
  releaseDateString: "2018 г.",
};

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

  const router: any = useNavigation();

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
          Ошибка при попытке загрузки.
        </Text>
        <Button
          onPress={() => {
            refetch();
          }}
          icon={<LucideRefreshCcw color="white" size={18} strokeWidth={2.4} />}
          style={{ marginTop: 12 }}
        >
          Попробовать ещё раз
        </Button>
      </Animated.View>
    );
  }

  const MainPageTitleCard = ({ title }: { title: Anime }) => {
    return (
      <Pressable
        onPress={() => {
          router.navigate("title-details", {
            type: title.site,
            slug_url: `${siteUrls[title.site as keyof typeof siteUrls].url}/${title.slug_url}`,
          });
        }}
        style={{ width: 140 }}
        key={title.id}
      >
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: title.cover.default }}
            style={{
              height: 189,
              width: 140,
              borderRadius: 6,
              zIndex: 1,
            }}
            contentFit="cover"
          />
          <View
            style={{
              zIndex: 2,
              position: "absolute",
              bottom: 4,
              left: 4,
              backgroundColor: "rgba(0,0,0,0.7)",
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 6,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "500",
              }}
            >
              {title.site != 5 ? "Глава" : "Эпизод"}{" "}
              {title.metadata.last_item.number}
            </Text>
          </View>
        </View>
        <Text
          numberOfLines={2}
          style={{ color: "white", marginTop: 4, fontWeight: "500" }}
        >
          {title.rus_name != "" ? title.rus_name : title.name}
        </Text>
      </Pressable>
    );
  };

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
          {/* <MainPageTitleCard title={ranobeobj as any} /> */}
          {data!.popular.map((title) => (
            <MainPageTitleCard key={title.id} title={title} />
          ))}
        </ScrollView>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
