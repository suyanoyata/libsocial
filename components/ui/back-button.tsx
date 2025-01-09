import { useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ChevronLeft } from "lucide-react-native";

import { Pressable, View } from "react-native";

export const BackButton = ({ absolute = true }: { absolute?: boolean }) => {
  const router: any = useNavigation();

  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: absolute ? "absolute" : undefined,
        top: absolute ? insets.top - 6 : 0,
        left: 0,
        zIndex: 99,
      }}
    >
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
