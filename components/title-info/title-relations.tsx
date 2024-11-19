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
import { Button } from "../button";
import { RefreshCcw } from "lucide-react-native";
import { useRussianTitle } from "@/constants/app.constants";

type SimilarTitle = {
  media: {
    id: number;
    name: string;
    rus_name: string;
    slug_url: string;
    site: number;
    cover: {
      default: string;
    };
    status: {
      label: string;
    };
    type: {
      label: string;
    };
    model: string;
  };
  related_type: {
    label: string;
  };
  id: number;
};

export const TitleRelations = ({ slug_url }: { slug_url: string }) => {
  const { data, isLoading, error, refetch } = useQuery<SimilarTitle[]>({
    queryKey: ["title-relations", slug_url],

    queryFn: async () => {
      const response = await api.get(`/${slug_url}/relations`);

      return response.data.data;
    },
    enabled: !!slug_url,
  });

  const { width } = useWindowDimensions();

  const navigation: any = useNavigation();

  const PendingRelations = () => {
    if (isLoading) {
      return Array.from({ length: 10 }).map((_, i) => (
        <SimilarPlaceholder key={i} />
      ));
    }
  };

  const RelationsLoadFailed = () => {
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
            Не удалось загрузить связанные тайтлы
          </Text>
          <Button
            onPress={refetch}
            style={{
              marginTop: 12,
            }}
            icon={<RefreshCcw color="white" size={18} strokeWidth={3} />}
          >
            Попробовать ещё раз
          </Button>
        </View>
      );
    }
  };

  if (data?.length == 0) return null;

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
        Связанное
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          gap: 16,
        }}
      >
        <PendingRelations />
        <RelationsLoadFailed />
        {data &&
          data.map((title, index) => (
            <Pressable
              onPress={() => {
                navigation.push("title-details", {
                  slug_url: title.media.model + "/" + title.media.slug_url,
                  type: title.media.site,
                });
              }}
              key={index}
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
                  {title.related_type.label}
                </Text>
                <Text
                  numberOfLines={2}
                  style={{
                    fontWeight: "500",
                    flex: 1,
                    color: "white",
                  }}
                >
                  {useRussianTitle()
                    ? title.media.rus_name != ""
                      ? title.media.rus_name
                      : title.media.name
                    : title.media.name}
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
