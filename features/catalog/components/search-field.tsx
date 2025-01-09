import i18n from "@/lib/intl";
import { SearchIcon } from "lucide-react-native";
import { TextInput, View } from "react-native";

export const CatalogSearch = ({
  setSearch,
}: {
  setSearch: (s: string) => void;
}) => {
  return (
    <View
      style={{
        position: "relative",
        justifyContent: "center",
        marginBottom: 8,
      }}
    >
      <SearchIcon
        style={{ position: "absolute", left: 8 }}
        size={20}
        strokeWidth={3}
        color="rgb(70,70,70)"
      />
      <TextInput
        onChangeText={(text) => setSearch(text)}
        placeholder={i18n.t("search.placeholder")}
        placeholderTextColor="rgb(70,70,70)"
        style={{
          backgroundColor: "rgba(255,255,255,0.06)",
          paddingVertical: 8,
          paddingLeft: 36,
          fontWeight: "500",
          color: "rgb(70,70,70)",
          paddingHorizontal: 12,
          borderRadius: 6,
          width: "100%",
        }}
      />
    </View>
  );
};
