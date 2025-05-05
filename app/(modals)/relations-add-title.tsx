import { Text } from "@/components/ui/text";
import { View } from "react-native";

export default function TitleRelationsAdd() {
  return (
    <View className="mx-4 mt-2">
      <Text className="text-primary text-3xl font-bold">
        Add title related to <Text className="text-accent">{`<name>`}</Text>
      </Text>
    </View>
  );
}
