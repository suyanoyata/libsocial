import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View, Text } from "react-native";

export const ModalWrapper = ({ children }: { children?: React.ReactNode }) => {
  return (
    <View className="flex-1 mt-3 mx-2">
      <Link href="../">
        <View className="flex-row gap-1 items-center">
          <ChevronLeft color="#d4d4d8" strokeWidth={2.25} />
          <Text className="text-zinc-300 text-lg font-medium">Back</Text>
        </View>
      </Link>
      {children}
    </View>
  );
};
