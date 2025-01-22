import { FadeView } from "@/components/ui/fade-view";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { useTitleInfo } from "@/features/title/api/use-title-info";
import { useRoute } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { ImageBackground, ScrollView, Text, View } from "react-native";
import { Image } from "expo-image";
import { TitleSummary } from "@/features/title/components/title-summary";
import { Genres } from "@/features/title/components/genres";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";

export default function QuickSearchTitlePreview() {
  const route = useRoute();
  const { slug_url, site } = route.params as { slug_url: string; site: string };

  const { data } = useTitleInfo(slug_url, site);

  return (
    <ModalWrapper>
      <View className="bg-black flex-1">
        {data && (
          <FadeView withEnter className="flex-1 -mt-11">
            <View className="flex-1">
              {/* <BackButton /> */}
              <ImageBackground
                source={{ uri: data.background.url }}
                style={{
                  height: 280,
                  paddingTop: 50,
                  position: "relative",
                }}
              >
                <BlurView
                  intensity={20}
                  style={{
                    width: "100%",
                    height: 280,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    backgroundColor: "rgba(0,0,0,0.7)",
                  }}
                />
                <View className="mx-2 flex-row">
                  <Image
                    source={{ uri: data.cover.default }}
                    style={{
                      borderRadius: 8,
                      height: 220,
                      width: 140,
                    }}
                  />
                  <View className="flex-1 gap-1.5 mx-2">
                    {data.otherNames.map((name) => (
                      <Text key={name} className="text-zinc-200 font-medium">
                        {name}
                      </Text>
                    ))}
                  </View>
                </View>
              </ImageBackground>
              <View className="mx-2 gap-1 mt-2">
                <Text className="text-4xl text-zinc-200 font-bold">
                  {data.rus_name ?? data.name}
                </Text>
                <TitleSummary>{data.summary}</TitleSummary>
                <Genres ageRestriction={data.ageRestriction} genres={data.genres} />
              </View>
            </View>
            <Button
              onPress={() => {
                router.replace({
                  pathname: "/title-info",
                  params: { slug_url, site },
                });
              }}
              className="absolute right-6 bottom-12"
            >
              Перейти
            </Button>
          </FadeView>
        )}
      </View>
    </ModalWrapper>
  );
}
