import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const BackButton = () => {
  const { top } = useSafeAreaInsets();

  return (
    <Link
      href="../"
      className="absolute top-2 left-2"
      style={{ marginTop: top, zIndex: 999 }}
    >
      <View className="flex-row gap-1 items-center">
        <ChevronLeft color="white" strokeWidth={2.25} />
        <Text className="text-white text-lg font-medium">Back</Text>
      </View>
    </Link>
  );
};
