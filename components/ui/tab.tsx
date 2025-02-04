import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { Pressable, PressableProps, View } from "react-native";
import { Text } from "@/components/ui/text";

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
      hitSlop={4}
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
