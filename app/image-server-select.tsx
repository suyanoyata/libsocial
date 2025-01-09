import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { SettingsWrapper } from "@/components/settings-component";
import { ImageServer, store } from "@/hooks/useStore";
import i18n from "@/lib/intl";
import { Storage, storage } from "@/features/shared/lib/storage";
import { Anime } from "@/types/anime.type";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Button } from "@/components/ui/button";

export default function ImageServerSelect() {
  const { imageServers, imageServerIndex, setImageServerIndex } = store();
  const router = useRoute();

  const { slug_url } = router.params as {
    slug_url: string;
  };

  const { data: titleData } = useQuery<Anime>({
    queryKey: ["title-data", slug_url],
  });

  useEffect(() => {
    const server = storage.getNumber(Storage.imageServer);

    if (!server) {
      return storage.set(Storage.imageServer, 0);
    }

    setImageServerIndex(server);
  }, []);

  useEffect(() => {
    storage.set(Storage.imageServer, imageServerIndex);
  }, [imageServerIndex]);

  const ImageServerSelect = ({
    server,
    index,
  }: {
    server: ImageServer;
    index: number;
  }) => {
    if (!i18n.exists(`imageServerLabel.${server.id}`)) return;
    if (!titleData) return;
    if (!server.site_ids.includes(Number(titleData.site))) return;

    return (
      <Button
        asChild
        onPress={() => {
          setImageServerIndex(index);
        }}
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 6,
          paddingLeft: 36,
          justifyContent: "center",
          marginBottom: 6,
        }}
      >
        {imageServers[imageServerIndex].label == server.label && (
          <Check
            color="white"
            style={{ position: "absolute", left: 8 }}
            size={20}
            strokeWidth={2.8}
          />
        )}
        <View>
          <Text style={{ color: "rgb(171,171,171)", fontWeight: "500" }}>
            {i18n.t(`imageServerLabel.${server.id}`)}
          </Text>
        </View>
      </Button>
    );
  };

  return (
    <ModalWrapper title={i18n.t("imageServer.title")}>
      {imageServers.map((server, index) => (
        <ImageServerSelect server={server} index={index} />
      ))}
      <Text style={{ color: "rgba(255,255,255,0.6)", marginHorizontal: 8 }}>
        {i18n.t("imageServer.selected", {
          title: i18n.t(
            `imageServerLabel.${imageServers[imageServerIndex].id}`
          ),
        })}
      </Text>
    </ModalWrapper>
  );
}
