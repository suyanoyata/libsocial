import { useSafeAreaInsets } from "react-native-safe-area-context";

import { View } from "react-native";
import { Text } from "@/components/ui/text";

import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs/src/types";

interface Options extends BottomTabHeaderProps {
  headerRight?: React.ReactNode;
}

export const Header = (props: Options) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: top - 8 }}
      className="relative items-center justify-center flex-row mx-3"
    >
      <Text className="font-bold text-secondary text-center text-lg">
        {props.options.title ?? props.route.name}
      </Text>
      {props.headerRight && (
        <View style={{ paddingTop: top - 8 }} className="absolute right-3">
          {props.headerRight}
        </View>
      )}
    </View>
  );
};
