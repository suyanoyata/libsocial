import { View } from "react-native";

import { useRoute } from "@react-navigation/native";

import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { TitleChapters } from "@/features/title/ui/title-chapters";
import { Text } from "@/components/ui/text";
import { TitleEpisodes } from "@/features/title/ui/title-episodes";

export default function Chapter() {
  const route = useRoute();
  const { slug_url, site } = route.params as { slug_url: string; site: string };

  return (
    <ModalWrapper>
      <View className="mx-2 mt-2 flex-1">
        {site !== "5" ? (
          <TitleChapters slug_url={slug_url} site={Number(site)} />
        ) : (
          <TitleEpisodes slug_url={slug_url} site={Number(site)} />
        )}
      </View>
    </ModalWrapper>
  );
}
