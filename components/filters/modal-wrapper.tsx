import { useNavigation } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import {
  Text,
  Pressable,
  SafeAreaView,
  View,
  ScrollView,
  ViewStyle,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const ModalWrapper = ({
  title,
  setOpen,
  children,
  style,
  animated = false,
  scrollable = false,
  horizontal = true,
}: {
  title: string;
  setOpen?: (b: boolean) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  animated?: boolean;
  scrollable?: boolean;
  horizontal?: boolean;
}) => {
  const router: any = useNavigation();

  const Component = animated ? Animated.View : View;

  return (
    <Component entering={FadeIn} style={{ backgroundColor: "black", flex: 1 }}>
      <SafeAreaView
        style={{
          margin: 8,
          marginHorizontal: horizontal ? 8 : 0,
        }}
      >
        <Pressable
          onPress={() => (setOpen ? setOpen(false) : router.goBack())}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 8,
            marginHorizontal: !horizontal ? 8 : 0,
          }}
        >
          <ChevronLeft color="gray" />
          <Text
            numberOfLines={1}
            style={{ color: "gray", fontWeight: "600", paddingRight: 36 }}
          >
            {title}
          </Text>
        </Pressable>
        <View style={{ ...style }}>
          {scrollable ? <ScrollView>{children}</ScrollView> : children}
        </View>
      </SafeAreaView>
    </Component>
  );
};
