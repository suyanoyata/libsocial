import { ScrollView } from "react-native";

import { PulseView } from "@/components/ui/pulse-view";

import { useHomeTitles } from "@/features/home/api/use-home-titles";

import { TitleCard } from "@/features/home/components/title-card";
import { TitleCardPlaceholder } from "@/features/home/components/title-card-placeholder";
import { FadeView } from "@/components/ui/fade-view";

export const PopularTitles = () => {
  const { data } = useHomeTitles();

  const shouldRenderItems = !!data;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 8,
        gap: 8,
      }}
    >
      {shouldRenderItems && (
        <FadeView withEnter className="flex-row gap-2">
          {data.popular.map((title) => (
            <TitleCard key={title.id} title={title} />
          ))}
        </FadeView>
      )}
      {!shouldRenderItems && (
        <PulseView className="flex-row gap-2">
          {Array.from({ length: 20 }).map((_, index) => (
            <TitleCardPlaceholder key={index} />
          ))}
        </PulseView>
      )}
    </ScrollView>
  );
};
