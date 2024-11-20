import { useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

export const BackButton = () => {
  const router: any = useNavigation();

  return (
    <View style={{ position: "absolute", top: 0, left: 0, zIndex: 99 }}>
      <Pressable
        style={{
          margin: 12,
          marginTop: 16,
        }}
        onPress={() => router.goBack()}
      >
        <ChevronLeft size={28} color="white" strokeWidth={2.7} />
      </Pressable>
    </View>
  );
};
