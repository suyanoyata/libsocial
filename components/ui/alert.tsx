import { Icon } from "@/components/icon";
import { Text } from "@/components/ui/text";
import { View } from "react-native";

const Alert = ({ children }: { children?: React.ReactNode }) => {
  return (
    <View className="bg-red-400/20 rounded-2xl p-2 px-4 flex-row items-center gap-2">
      <Icon name="CircleAlert" className="-mt-4 text-red-400" />
      <View className="flex-1">{children}</View>
    </View>
  );
};

const AlertTitle = ({ children }: { children?: React.ReactNode }) => {
  return <Text className="text-red-400 font-semibold text-xl">{children}</Text>;
};

const AlertDescription = ({ children }: { children?: React.ReactNode }) => {
  return <Text className="text-red-400 font-medium">{children}</Text>;
};

export { Alert, AlertTitle, AlertDescription };
