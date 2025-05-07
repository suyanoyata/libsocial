import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Platform, View } from "react-native";
import { Text } from "@/components/ui/text";

type Layout = { width: number; height: number };

type Options = {
  layout: Layout;
  route: {
    name: string;
  };
  options: {
    title?: string;
  };
  headerRight?: React.ReactNode;
};

export const Header = (props: Options) => {
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={{ paddingTop: Platform.select({ ios: 8, android: top - 8 }) }}
      className="relative items-center justify-center flex-row mx-3"
    >
      <Text className="font-bold text-secondary text-center text-lg">
        {props.options.title ?? props.route.name}
      </Text>
      {props.headerRight && (
        <View
          style={{ paddingTop: Platform.select({ ios: 8, android: top - 8 }) }}
          className="absolute right-3"
        >
          {props.headerRight}
        </View>
      )}
    </View>
  );
};
