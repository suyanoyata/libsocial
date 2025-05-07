import { View } from "react-native";
import { router } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Bookmark, Play } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Genres } from "@/features/title/components/genres";
import { TitleSummary } from "@/features/title/components/title-summary";

import { Title } from "@/features/shared/types/title";
import { TitleRelations } from "@/features/title/ui/title-relations";
import { Icon } from "@/components/icon";

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
        className="mb-3"
        iconLeft={
          <Icon
            disabled={data.isLicensed}
            size={18}
            className="dark:fill-violet-700 disabled:fill-red-900 text-transparent"
          />
        }
        variant={data?.isLicensed ? "destructive" : "accent"}
      >
        {data?.isLicensed ? "Sorry, this content is licensed" : text}
      </Button>
      <TitleSummary>{data.summary}</TitleSummary>
      <Genres genres={data.genres} />
      <TitleRelations
        label="Related"
        slug_url={data.slug_url}
        endpoint="relations"
        site={data.site}
      />
      {/* <TitleRelations label="Похожие" slug_url={data.slug_url} endpoint="similar" /> */}
    </View>
  );
};
