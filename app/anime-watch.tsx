import { EpisodePlayer } from "@/components/episode-player";
import { Loader } from "@/components/fullscreen-loader";
import { Queries } from "@/hooks/queries";
import { useRoute } from "@react-navigation/native";
import { SafeAreaView, Text } from "react-native";

export type Episode = {
  id: number;
  number: string;
  season: string;
};

export default function Watch() {
  const route = useRoute();
  const { slug_url } = route.params as any;
  const { data: episodes, isLoading } = Queries.animeEpisodes(slug_url);

  const { data: anime } = Queries.titleData(slug_url, "anime");

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
