import { View } from "react-native";
import { router } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Bookmark, Play } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Genres } from "@/features/title/components/genres";
import { TitleSummary } from "@/features/title/components/title-summary";

import { Title } from "@/features/shared/types/title";
import { TitleRelations } from "@/features/title/ui/title-relations";

export const TitleAbout = ({ data }: { data: Title }) => {
  const { bottom } = useSafeAreaInsets();

  const Icon = data.site == "5" ? Play : Bookmark;
  const text = data.site == "5" ? "Start Watching" : "Start Reading";

  return (
    <View
      style={{
        paddingBottom: bottom + 8,
      }}
      className="mt-2"
    >
      <Button
        disabled={data?.isLicensed}
        onPress={() => {
          router.push({
            pathname: "/(modals)/title-contents",
            params: {
              slug_url: data.slug_url,
              site: data.site,
            },
          });
        }}
        iconLeft={<Icon size={18} color="white" fill="white" />}
        className="bg-orange-500 active:bg-orange-400 mb-3 disabled:opacity-60 disabled:bg-red-500"
        textClassName="text-white font-medium"
      >
        {data?.isLicensed ? "Sorry, this content is licensed" : text}
      </Button>
      <TitleSummary>{data.summary}</TitleSummary>
      <Genres genres={data.genres} />
      <TitleRelations label="Related" slug_url={data.slug_url} endpoint="relations" />
      {/* <TitleRelations label="Похожие" slug_url={data.slug_url} endpoint="similar" /> */}
    </View>
  );
};
