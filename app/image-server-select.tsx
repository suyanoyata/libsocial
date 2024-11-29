import { ModalWrapper } from "@/components/filters/modal-wrapper";
import { SettingsWrapper } from "@/components/settings-component";
import { ImageServer, store } from "@/hooks/useStore";
import i18n from "@/lib/intl";
import { storage } from "@/lib/storage";
import { Anime } from "@/types/anime.type";
import { useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
    const server = storage.getNumber("image-server");

    if (!server) {
      return storage.set("image-server", 0);
    }

    setImageServerIndex(server);
  }, []);

  useEffect(() => {
    storage.set("image-server", imageServerIndex);
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
      <View
        style={{
          paddingHorizontal: 12,
          paddingLeft: 38,
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.2)",
          justifyContent: "space-between",
          flexDirection: "row",
          position: "relative",
          alignItems: "center",
        }}
      >
        {imageServers[imageServerIndex].label == server.label && (
          <Check
            color="white"
            style={{ position: "absolute", left: 8 }}
            size={22}
            strokeWidth={2.8}
          />
        )}
        <TouchableOpacity
          onPress={() => {
            setImageServerIndex(index);
          }}
          style={{
            height: 42,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 16,
              flex: 1,
              lineHeight: 42,
            }}
          >
            {i18n.t(`imageServerLabel.${server.id}`)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ModalWrapper title={i18n.t("imageServer.title")}>
      <SettingsWrapper>
        {imageServers.map((server, index) => (
          <ImageServerSelect server={server} index={index} />
        ))}
      </SettingsWrapper>
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
