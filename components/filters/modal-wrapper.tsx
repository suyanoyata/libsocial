import { ChevronLeft } from "lucide-react-native";
import {
  Text,
  Pressable,
  SafeAreaView,
  View,
  ScrollView,
  ViewStyle,
} from "react-native";

export const ModalWrapper = ({
  title,
  setOpen,
  children,
  style,
  scrollable = false,
}: {
  title: string;
  setOpen: (b: boolean) => void;
  children?: React.ReactNode;
  style?: ViewStyle;
  scrollable?: boolean;
}) => {
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <SafeAreaView
        style={{
          margin: 8,
        }}
      >
        <Pressable
          onPress={() => setOpen(false)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingBottom: 8,
          }}
        >
          <ChevronLeft color="gray" />
          <Text style={{ color: "gray", fontWeight: "600" }}>{title}</Text>
        </Pressable>
        <View style={{ ...style }}>
          {scrollable ? <ScrollView>{children}</ScrollView> : children}
        </View>
      </SafeAreaView>
    </View>
  );
};
