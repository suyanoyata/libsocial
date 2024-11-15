import { EpisodePlayer } from "@/components/episode-player";
import { Loader } from "@/components/fullscreen-loader";
import { api } from "@/lib/axios";
import { Anime } from "@/types/anime.type";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { SafeAreaView, Text, View } from "react-native";

type Episode = {
  id: number;
  number: string;
  season: string;
};

export default function Watch() {
  const route = useRoute();
  const { slug_url } = route.params as any;
  const { data: episodes, isLoading } = useQuery<Episode[]>({
    queryKey: ["anime-episodes", slug_url],
    queryFn: async () => {
      console.log(slug_url);
      return await api
        .get(`/episodes?anime_id=${slug_url}`)
        .then((res) => res.data.data);
    },
  });

  const { data: anime } = useQuery<Anime>({
    queryKey: ["title-data", `anime/${slug_url}`],
  });

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <Text
        style={{
          color: "white",
          marginBottom: 12,
          textAlign: "left",
          fontSize: 32,
          fontWeight: "700",
        }}
      >
        {anime?.name}
      </Text>
      <EpisodePlayer episodeId={episodes![0].id} />
    </SafeAreaView>
  );
}
