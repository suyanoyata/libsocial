import { Text } from "@/components/ui/text";
import { useEpisodesAPI } from "@/features/title/api/use-episodes-api";
import { TitleContext } from "@/features/title/context/title-context";
import { AllowedSiteIds } from "@/store/use-properties";
import { router } from "expo-router";
import { useContext } from "react";
import { FlatList, Pressable } from "react-native";

export const TitleEpisodes = ({
  slug_url,
  site,
}: {
  slug_url: string;
  site: AllowedSiteIds;
}) => {
  const { data } = useEpisodesAPI(slug_url, site);

  const tab = useContext(TitleContext);

  if (tab != "episodes") return null;

  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/anime-watch",
              params: {
                slug_url,
              },
            })
          }
        >
          <Text className="text-zinc-200">{item.number}</Text>
        </Pressable>
      )}
    />
  );
};
