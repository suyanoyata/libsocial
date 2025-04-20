import { cn } from "@/lib/utils";

import { Platform, View, ViewStyle } from "react-native";
import { ChevronLeft } from "lucide-react-native";
import { Link } from "expo-router";

import { Text } from "@/components/ui/text";

import { useSafeAreaInsets } from "react-native-safe-area-context";

type BackButtonProps = ViewStyle & {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  position?: "absolute" | "static";
};

export const BackButton = ({ position = "absolute", ...props }: BackButtonProps) => {
  const { top } = useSafeAreaInsets();

  const marginTop = () => {
    if (position == "static") return 0;

    if (Platform.OS == "ios") return top - 2;

    return 10;
  };

  return (
    <Link
      href="../"
      className={cn(position == "absolute" && "absolute top-2 left-2", props.className)}
      style={{ marginTop: marginTop(), zIndex: 999 }}
      {...props}
    >
      <View className="flex-row gap-1 items-center z-20">
        <ChevronLeft className={cn("text-primary", props.iconClassName)} strokeWidth={2.25} />
        <Text className={cn("text-primary text-lg font-medium", props.textClassName)}>Back</Text>
      </View>
    </Link>
  );
};
