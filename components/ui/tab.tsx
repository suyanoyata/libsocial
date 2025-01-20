import { cn } from "@/lib/utils";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { Pressable, PressableProps, Text, View } from "react-native";

type TabProps = PressableProps & {
  value: string;
  className?: string;
  children?: string;
  selected: string;
  setSelected: (selected: string) => void;
};

export const Tab = ({
  className,
  selected,
  setSelected,
  children,
  value,
  ...props
}: TabProps) => {
  return (
    <Pressable
      onPress={() => {
        impactAsync(ImpactFeedbackStyle.Soft);
        setSelected(value);
      }}
      className="flex-1"
      style={{ borderTopEndRadius: 4, borderTopStartRadius: 4 }}
      {...props}
    >
      <Text className="text-white text-center font-medium mb-2">{children}</Text>
      {value == selected && <View className="h-1.5 rounded-t-md bg-purple-200"></View>}
    </Pressable>
  );
};
