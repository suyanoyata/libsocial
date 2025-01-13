import { Button } from "@/components/ui/button";
import { Loader } from "@/components/fullscreen-loader";
import { EpisodePlayer } from "@/features/anime-player/components/player";

import { colors, getTitle } from "@/constants/app.constants";
import i18n from "@/lib/intl";

import { Queries } from "@/hooks/queries";
import { useRoute } from "@react-navigation/native";
import { useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

import { useAnimeEpisodes } from "@/features/anime-player/api/useAnimeEpisodes";
import { Comments } from "@/features/shared/components/comments";

export default function AnimePlayer() {
  const route = useRoute();
  const { slug_url } = route.params as { slug_url: string };
  const { data: episodes } = useAnimeEpisodes(slug_url);

  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);

  const { data: anime } = Queries.titleData(slug_url, "anime");

  if (!anime || !episodes) return <Loader />;

  return (
    <SafeAreaView
      style={{
        padding: 12,
      }}
    >
      <ScrollView>
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
            style={{ flex: 1, backgroundColor: colors[4].primary }}
            disabled={episodes[currentEpisodeIndex - 1] == undefined}
            onPress={() => setCurrentEpisodeIndex(currentEpisodeIndex - 1)}
          >
            <ChevronLeft color="white" size={18} strokeWidth={3} />
          </Button>
          <Button style={{ flex: 9, backgroundColor: colors[4].primary }}>
            {i18n.t("content.episode", {
              episode: episodes[currentEpisodeIndex].number,
            })}
          </Button>
          <Button
            style={{ flex: 1, backgroundColor: colors[4].primary }}
            disabled={episodes[currentEpisodeIndex + 1] == undefined}
            onPress={() => setCurrentEpisodeIndex(currentEpisodeIndex + 1)}
          >
            <ChevronRight color="white" size={18} strokeWidth={3} />
          </Button>
        </View>
        <Comments
          scrollable={false}
          slug_url={slug_url}
          selected="comments"
          model="episodes"
          post_id={episodes[currentEpisodeIndex].id}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
