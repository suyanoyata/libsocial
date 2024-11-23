import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Anime } from "@/types/anime.type";
import Tab from "@/components/title/tab.component";
import { TitleBackgroundData } from "@/components/title/title-info/title-background-data";
import { useEffect, useState } from "react";
import { colors, presentation_mode, siteUrls } from "@/constants/app.constants";
import { MangaChapters } from "@/components/manga-chapters";
import { AboutTitle } from "@/components/title/title-info/title-about";
import { store, TitleColors } from "@/hooks/useStore";
import { Comments } from "@/components/title/comments";
import { Button } from "@/components/button";
import { RefreshCcw } from "lucide-react-native";
import i18n from "@/lib/intl";

const chapter = [
  {
    title: i18n.t("content.tabs.about"),
    key: "about",
  },
  {
    title: i18n.t("content.tabs.chapters"),
    key: "chapters",
  },
  {
    title: i18n.t("content.tabs.comments"),
    key: "comments",
  },
  {
    title: i18n.t("content.tabs.reviews"),
    key: "reviews",
  },
];

const tabs = {
  1: chapter,
  2: chapter,
  3: chapter,
  4: chapter,
  5: [
    {
      title: i18n.t("content.tabs.about"),
      key: "about",
    },
    {
      title: i18n.t("content.tabs.comments"),
      key: "comments",
    },
    {
      title: i18n.t("content.tabs.reviews"),
      key: "reviews",
    },
  ],
};

export default function index() {
  const router = useRoute();
  const { slug_url, type } = router.params as any;

  const [selectedTab, setSelectedTab] = useState<string>("about");
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
    <Animated.View
      style={{
        position: "relative",
      }}
      entering={FadeIn}
    >
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
                key={tab.key}
                value={tab.key}
                inactive={
                  tab.key == "reviews" ||
                  (tab.key == "comments" && presentation_mode)
                }
                selected={selectedTab}
                setSelected={() => {
                  setSelectedTab(tab.key);
                }}
              >
                {tab.title}
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
