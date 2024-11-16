import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Anime } from "@/types/anime.type";
import Tab from "@/components/tab.component";
import { TitleBackgroundData } from "@/components/title-info/title-background-data";
import { useEffect, useState } from "react";
import { colors, siteUrls } from "@/constants/app.constants";
import { MangaChapters } from "@/components/manga-chapters";
import { AboutTitle } from "@/components/title-info/title-about";
import { store, TitleColors } from "@/hooks/useStore";
import { Comments } from "@/components/comments";
import { Button } from "@/components/button";
import { RefreshCcw } from "lucide-react-native";

const tabs = {
  1: ["О тайтле", "Главы", "Комментарии", "Отзывы"],
  3: ["О тайтле", "Главы", "Комментарии", "Отзывы"],
  4: ["О тайтле", "Главы", "Комментарии", "Отзывы"],
  5: ["О тайтле", "Комментарии", "Отзывы"],
};

export default function index() {
  const router = useRoute();
  const { slug_url, type } = router.params as any;

  const [selectedTab, setSelectedTab] = useState<string>("О тайтле");

  const [count, setCount] = useState<number>(0);

  const { setCurrentTitleSlug } = store();

  useEffect(() => {
    setCurrentTitleSlug(slug_url);
  }, [slug_url]);

  const { data, isLoading, error, refetch } = useQuery<Anime>({
    queryKey: ["title-data", slug_url],

    queryFn: async () => {
      const response = await api.get(
        `/${slug_url}?${siteUrls[type as keyof typeof siteUrls].fields}`
      );
      return response.data.data;
    },
    enabled: !!slug_url,
  });

  const [accent, setAccent] = useState<TitleColors>(colors[0]);

  useEffect(() => {
    setAccent(colors[type - 1]);
  }, [data]);

  if (isLoading || !data) {
    return <Loader />;
  }

  if (error) {
    return (
      <View
        style={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
          }}
        >
          Произошла ошибка при подключении.
        </Text>
        <Button
          style={{
            marginTop: 12,
          }}
          icon={<RefreshCcw color="white" size={16} />}
          onPress={refetch}
        >
          Попробовать ещё раз
        </Button>
      </View>
    );
  }

  return (
    <Animated.View entering={FadeIn}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          minHeight: "100%",
        }}
      >
        <TitleBackgroundData
          setCount={setCount}
          count={count}
          setSelectedTab={setSelectedTab}
          data={data}
          accent={accent}
        />
        <View
          style={{
            backgroundColor: "black",
            minHeight: "100%",
            borderTopLeftRadius: 6,
            borderTopRightRadius: 6,
            marginTop: -8,
            zIndex: 5,
            overflow: "hidden",
          }}
        >
          <View style={{ flexDirection: "row" }}>
            {tabs[type as keyof typeof tabs].map((tab) => (
              <Tab
                accent={accent}
                key={tab}
                inactive={tab == "Отзывы"}
                selected={selectedTab}
                setSelected={() => {
                  setSelectedTab(tab);
                }}
              >
                {tab}
              </Tab>
            ))}
          </View>
          <View
            style={{ minHeight: "100%", backgroundColor: "black", flex: 1 }}
          >
            <AboutTitle accent={accent} selected={selectedTab} data={data} />
            <MangaChapters
              setCount={setCount}
              type={data?.site}
              selected={selectedTab}
              count={count}
              slug_url={slug_url}
            />
            <Comments
              post_id={data.id}
              model={data.model}
              selected={selectedTab}
              slug_url={slug_url}
            />
          </View>
        </View>
      </ScrollView>
    </Animated.View>
  );
}
