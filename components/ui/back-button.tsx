import { cn } from "@/lib/utils";
import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BackButtonProps = ViewStyle & {
  className?: string;
};

export const BackButton = ({ ...props }: BackButtonProps) => {
  const { top } = useSafeAreaInsets();

  return (
    <Link
      href="../"
      className={cn("absolute top-2 left-2", props.className)}
      style={{ marginTop: top, zIndex: 999 }}
      {...props}
    >
      <View className="flex-row gap-1 items-center">
        <ChevronLeft color="white" strokeWidth={2.25} />
        <Text className="text-white text-lg font-medium">Back</Text>
      </View>
    </Link>
  );
};
