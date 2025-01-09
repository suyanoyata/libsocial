import { Pressable, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";

import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "expo-router";

import { SimilarError } from "@/features/title/components/similar-error";

import { getTitle } from "@/constants/app.constants";

import i18n from "@/lib/intl";
import { PendingSimilars } from "@/features/title/components/similar-loading";
import { useSimilarTitle } from "@/features/title/api/useSimilarTitle";
import Animated, { FadeIn } from "react-native-reanimated";

export const TitleSimilar = ({ slug_url }: { slug_url: string }) => {
  const { data, isPending } = useSimilarTitle(slug_url);

  const navigation: any = useNavigation();

  if (isPending || data?.length == 0) return;

  return (
    <Animated.View
      entering={FadeIn}
      style={{
        marginHorizontal: 8,
        marginTop: 12,
      }}
    >
      <Text
        style={{
          color: "rgba(255,255,255,0.9)",
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        {i18n.t("content.similar.title")}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
        }}
      >
        <PendingSimilars slug_url={slug_url} />
        <SimilarError slug_url={slug_url} />
        {data &&
          data!.map((title) => (
            <Pressable
              onPress={() => {
                navigation.push("title-details", {
                  slug_url: title.media.model + "/" + title.media.slug_url,
                  type: title.media.site,
                });
              }}
              key={title.id}
              style={{
                flexDirection: "row",
                height: 139,
                width: 360,
                backgroundColor: "rgba(255,255,255,0.07)",
                overflow: "hidden",
                borderRadius: 6,
                gap: 12,
              }}
            >
              <Image
                style={{ height: "100%", width: 100, borderRadius: 6 }}
                source={{ uri: title.media.cover.default }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#79a5d8",
                    lineHeight: 28,
                  }}
                >
                  {i18n.t(`content.similar.default`)}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontWeight: "500",
                    flex: 1,
                    color: "white",
                  }}
                >
                  {getTitle(title.media)}
                </Text>
                <Text
                  style={{
                    marginTop: "auto",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.4)",
                    lineHeight: 28,
                  }}
                >
                  {title.media.type.label} • {title.media.status.label}
                </Text>
              </View>
            </Pressable>
          ))}
      </ScrollView>
    </Animated.View>
  );
};
