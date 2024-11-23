import { Text, View } from "react-native";

import { Button } from "@/components/button";
import i18n from "@/lib/intl";
import { Filter } from "lucide-react-native";
import { Link } from "expo-router";

export default function SearchFilters() {
  return (
    <>
      <Link href="/catalog-filtering" asChild>
        <Button
          asChild
          style={{
            width: "auto",
            marginBottom: 8,
          }}
        >
          <View
            style={{
              alignItems: "center",
              paddingVertical: 10,
              paddingHorizontal: 16,
              flexDirection: "row",
              gap: 4,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          >
            <Filter color="rgb(70,70,70)" size={14} fill="rgb(70,70,70)" />
            <Text
              style={{
                textAlign: "center",
                color: "rgb(70,70,70)",
                fontWeight: "500",
              }}
            >
              {i18n.t("search.filters")}
            </Text>
          </View>
        </Button>
      </Link>
    </>
  );
}
