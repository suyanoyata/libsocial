import { CatalogSearch } from "@/components/catalog-search-field";
import { Loader } from "@/components/fullscreen-loader";
import SearchTitleCard from "@/components/search-title-card";
import useDebounce from "@/hooks/useDebounce";
import { Anime } from "@/types/anime.type";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export default function SearchView() {
  const [value, setValue] = useState<string>("");
  const search = useDebounce(value.trim(), 500);

  const { isLoading: loadingAnime, data: animeData } = useQuery<Anime[]>({
    queryKey: ["search-anime-data", search],
  });

  const { isLoading: loadingManga, data: mangaData } = useQuery<Anime[]>({
    queryKey: ["search-manga-data", search],
  });

  const results = [
    {
      label: "Аниме",
      value: animeData,
    },
    {
      label: "Манга",
      value: mangaData,
    },
  ];

  const EmptyQueryComponent = () => {
    if (search || loadingAnime || loadingManga) return;
    return (
      <Animated.View
        exiting={FadeOut}
        style={{
          width: "100%",
          minHeight: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>
          Начните искать через поисковое поле
        </Text>
      </Animated.View>
    );
  };

  const ResultsRender = () => {
    return (
      <View>
        {results.map(
          (result) =>
            result.value && (
              <View
                style={{
                  marginTop: 12,
                  gap: 12,
                  flexDirection: "column",
                  display: "flex",
                }}
              >
                <Text
                  style={{ color: "white", fontSize: 28, fontWeight: "700" }}
                >
                  {result.label}
                </Text>
                {result.value?.map((title) => (
                  <SearchTitleCard title={title} />
                ))}
              </View>
            ),
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <CatalogSearch search={value} setSearch={setValue} />
      <ScrollView
        removeClippedSubviews
        automaticallyAdjustKeyboardInsets
        style={{
          marginHorizontal: 12,
          marginTop: 8, 
          borderRadius: 8, 
          flex: 1,
          minHeight: "100%",
        }}
      >
        <EmptyQueryComponent />
        {loadingAnime ||
          (loadingManga && (
            <View
              style={{
                minHeight: "100%",
              }}
            >
              <Loader />
            </View>
          ))}
        {!loadingAnime && !loadingManga && (
          <>
            <Animated.View
            entering={FadeIn} exiting={FadeOut}>
              <ResultsRender />
            </Animated.View>
            <View style={{ height: 60 }} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
