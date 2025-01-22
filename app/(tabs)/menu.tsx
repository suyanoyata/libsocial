import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native";

export default function Menu() {
  return (
    <SafeAreaView>
      <Text className="text-zinc-700 text-center">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
