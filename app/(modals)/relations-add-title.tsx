import { View } from "react-native";
import { Text } from "@/components/ui/text";
import { ActivityIndicator } from "@/components/ui/activity-indicator";

import { useRoute } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTitleInfo } from "@/features/title/api/use-title-info";

export default function TitleRelationsAdd() {
  const route = useRoute();

  const { slug_url, site } = route.params as { slug_url: string; site: string };

  const { data } = useTitleInfo(slug_url, site);

  const { bottom } = useSafeAreaInsets();

  if (!data) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="mx-4 mt-2 flex-1" style={{ paddingBottom: bottom }}>
      <Text className="text-primary text-3xl font-bold mb-auto">
        Add title related to <Text className="text-accent">{data?.eng_name ?? data.name}</Text>
      </Text>
    </View>
  );
}
