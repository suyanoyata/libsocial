import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "expo-router";
import { SimilarPlaceholder } from "../similar-placeholder";
import { Button } from "../../button";
import { RefreshCcw } from "lucide-react-native";
import { getTitle } from "@/constants/app.constants";
import { SimilarTitle } from "@/types/similar.type";
import i18n from "@/lib/intl";

export const TitleSimilar = ({ slug_url }: { slug_url: string }) => {
  const { data, isLoading, error, refetch } = useQuery<SimilarTitle[]>({
    queryKey: ["title-similar", slug_url],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/similar`);

      return response.data.data;
    },
    enabled: !!slug_url,
  });

  const navigation: any = useNavigation();

  const { width } = useWindowDimensions();

  const PendingSimilars = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, i) => (
        <SimilarPlaceholder key={i} />
      ));
    }
  };

  const SimilarsLoadFailed = () => {
    if (error) {
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

  return (
    <View
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
        <PendingSimilars />
        <SimilarsLoadFailed />
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
    </View>
  );
};
