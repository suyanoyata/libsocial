import { Anime } from "@/types/anime.type";
import { useNavigation } from "expo-router";
import { Pressable, Text } from "react-native";
import { Image } from "expo-image";
import { memo } from "react";

const SearchTitleCard = ({ title }: { title: Anime }) => {
  const navigation: any = useNavigation();

  return (
    <Pressable
      onPress={() => {
        navigation.navigate("title-details", {
          slug_url: `${title.site != 5 ? "manga" : "anime"}/${title.slug_url}`,
          type: title.site,
        });
      }}
      style={{ flexDirection: "row", gap: 12, width: "100%" }}
    >
      <Image
        source={{ uri: title.cover.default }}
        style={{
          height: 149,
          width: 100,
          borderRadius: 6,
        }}
      />
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: "500",
          color: "rgba(255,255,255,0.75)",
        }}
      >
        {title.rus_name ?? title.name}
      </Text>
    </Pressable>
  );
};

const areEqual = (prevProps: { title: Anime }, nextProps: { title: Anime }) => {
  const changed = prevProps.title.id === nextProps.title.id;
  return changed;
};

// this is useless
export default memo(SearchTitleCard, areEqual);
