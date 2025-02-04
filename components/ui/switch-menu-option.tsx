import { Switch, View } from "react-native";
import { Text } from "@/components/ui/text";

export const SwitchMenuOption = ({
  children: text,
  value,
  setValue,
  note,
  debugOnly = false,
}: {
  children: string;
  value: boolean;
  setValue: (value: boolean) => void;
  note?: string;
  debugOnly?: boolean;
}) => {
  if (debugOnly && !__DEV__) return null;

  return (
    <View>
      <View className="flex-row items-center">
        <Text className="text-zinc-200 font-medium flex-1">{text}</Text>
        <Switch value={value} onValueChange={(value) => setValue(value)} />
      </View>
      {note && value == true && (
        <Text className="text-zinc-600 text-sm font-medium">{note}</Text>
      )}
    </View>
  );
};
