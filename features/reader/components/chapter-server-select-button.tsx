import { useNavigation } from "expo-router";
import { Pressable } from "react-native";
import { Settings } from "lucide-react-native";

export const ChapterServerSelectButton = ({
  slug_url,
}: {
  slug_url: string;
}) => {
  const navigation: any = useNavigation();
  return (
    <Pressable
      onPress={() => {
        navigation.navigate("image-server-select", {
          slug_url,
        });
      }}
    >
      <Settings
        size={24}
        color="rgba(255,255,255,0.3)"
        strokeWidth={1.8}
        style={{
          marginLeft: 12,
          transform: [{ rotate: "60deg" }],
        }}
      />
    </Pressable>
  );
};
