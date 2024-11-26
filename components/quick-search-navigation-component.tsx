import i18n from "@/lib/intl";
import { Link } from "expo-router";
import { Search } from "lucide-react-native";
import { Pressable, View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const QuickSearchNavigationComponent = () => {
  const insets = useSafeAreaInsets();
  return (
    <Link asChild href="/quick-search" style={{ paddingTop: insets.top + 2 }}>
      <Pressable
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          padding: 10,
          paddingHorizontal: 12,
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(70,70,70,0.1)",
            flexDirection: "row",
            padding: 6,
            paddingHorizontal: 8,
            borderRadius: 6,
            gap: 6,
            alignItems: "center",
          }}
        >
          <Search size={20} color="rgb(71,71,71)" strokeWidth={2.5} />
          <Text
            style={{
              color: "rgb(71,71,71)",
              fontWeight: "500",
            }}
          >
            {i18n.t("search.quick")}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
};
