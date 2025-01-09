import { Button } from "@/components/ui/button";
import { EpisodePlayer } from "@/features/anime-player/components/player";
import { Loader } from "@/components/fullscreen-loader";
import { Conditional } from "@/components/misc/conditional";
import { getTitle } from "@/constants/app.constants";
import { Queries } from "@/hooks/queries";
import i18n from "@/lib/intl";
import { useRoute } from "@react-navigation/native";
import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function AnimePlayer() {
  const route = useRoute();
  const { slug_url } = route.params as any;
  const { data: episodes } = Queries.animeEpisodes(slug_url);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const { data: anime } = Queries.titleData(slug_url, "anime");

  if (!anime || !episodes) {
    return <Loader />;
  }

  return (
    <SafeAreaView
      style={{
        padding: 12,
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
        {getTitle(anime)}
      </Text>
      <EpisodePlayer episodeId={episodes[currentEpisodeIndex].id} />
      <View style={{ flexDirection: "row", marginTop: 12, gap: 4 }}>
        <Button
          style={{ flex: 1 }}
          disabled={episodes[currentEpisodeIndex - 1] == undefined}
          onPress={() => setCurrentEpisodeIndex(currentEpisodeIndex - 1)}
        >
          <ChevronLeft color="white" size={18} strokeWidth={3} />
        </Button>
        <Button style={{ flex: 4 }}>
          {i18n.t("content.episode", {
            episode: episodes[currentEpisodeIndex].number,
          })}
        </Button>
        <Button
          style={{ flex: 1 }}
          disabled={episodes[currentEpisodeIndex + 1] == undefined}
          onPress={() => setCurrentEpisodeIndex(currentEpisodeIndex + 1)}
        >
          <ChevronRight color="white" size={18} strokeWidth={3} />
        </Button>
      </View>
    </SafeAreaView>
  );
}
