import { View, Text } from "react-native";
import { RefreshCcw } from "lucide-react-native";

import { Button } from "@/components/ui/button";

import i18n from "@/lib/intl";

import { useChapters } from "@/features/chapters/api/useChapters";

export const ChaptersLoadError = ({ slug_url }: { slug_url: string }) => {
  const { refetch } = useChapters(slug_url);
  return (
    <View style={{ width: "100%" }}>
      <Text style={{ color: "rgba(255,255,255,0.8)" }}>
        {i18n.t("content.chapter-load-error.title")}
      </Text>
      <Button
        onPress={refetch}
        icon={<RefreshCcw color="white" size={18} strokeWidth={3} />}
      >
        {i18n.t("content.chapter-load-error.retry")}
      </Button>
    </View>
  );
};
