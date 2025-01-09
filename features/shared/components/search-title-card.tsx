import { memo } from "react";
import { Image } from "expo-image";
import { Pressable, Text } from "react-native";

import { useNavigation } from "expo-router";

import { Anime } from "@/types/anime.type";

const SearchTitleCard = ({ title }: { title: Anime }) => {
  const navigation: any = useNavigation();

  console.log(`render: ${title.name}`);

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
  return prevProps.title.id === nextProps.title.id;
};

// this is useless
export default memo(SearchTitleCard, areEqual);
