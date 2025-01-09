import { useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable } from "react-native";

export const ChapterBackButton = () => {
  const navigation: any = useNavigation();
  return (
    <Pressable
      style={{ marginRight: 12 }}
      onPress={() => {
        navigation.goBack();
      }}
    >
      <ChevronLeft size={28} color="rgba(255,255,255,0.5)" strokeWidth={2.7} />
    </Pressable>
  );
};
