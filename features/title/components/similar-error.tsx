import { useWindowDimensions, View, Text } from "react-native";

import { RefreshCcw } from "lucide-react-native";

import { Button } from "@/components/ui/button";

import i18n from "@/lib/intl";

import { useSimilarTitle } from "@/features/title/api/useSimilarTitle";

export const SimilarError = ({ slug_url }: { slug_url: string }) => {
  const { isError, refetch } = useSimilarTitle(slug_url);

  const { width } = useWindowDimensions();

  if (isError) {
    return (
      <View
        style={{
          height: 139,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: -12,
          width: width,
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {i18n.t("content.similar.error")}
        </Text>
        <Button
          onPress={refetch}
          style={{
            marginTop: 12,
          }}
          icon={<RefreshCcw color="white" size={18} strokeWidth={3} />}
        >
          {i18n.t("content.similar.try_again")}
        </Button>
      </View>
    );
  }
};
