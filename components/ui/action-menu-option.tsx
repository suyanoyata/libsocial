import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { View } from "react-native";

export const ActionMenuOption = ({
  disabled,
  children: text,
  note,
  actionText,
  action,
  buttonVariant,
  debugOnly = false,
}: {
  disabled?: boolean;
  children: string;
  note?: string;
  actionText: string;
  action: () => void;
  buttonVariant?: "destructive";
  debugOnly?: boolean;
}) => {
  if (!__DEV__ && debugOnly) return null;
  return (
    <View>
      <View className="flex-row items-center mt-2">
        <Text className="text-zinc-200 font-medium flex-1">{text}</Text>
        <Button
          disabled={disabled}
          variant={buttonVariant}
          className="disabled:opacity-50"
          size="sm"
          onPress={action}
        >
          {actionText}
        </Button>
      </View>
      {note && <Text className="text-zinc-600 text-sm font-medium mt-1">{note}</Text>}
    </View>
  );
};
