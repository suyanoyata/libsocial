import { SettingsWrapper } from "@/components/settings-component";
import { ImageServer, store } from "@/hooks/useStore";
import { site_id } from "@/lib/axios";
import { storage } from "@/lib/storage";
import { Check } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ImageServerSelect() {
  const { imageServers, imageServerIndex, setImageServerIndex } = store();

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
    if (!server.site_ids.includes(site_id)) return;

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
            {server.label}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View>
      <Text
        style={{
          fontSize: 32,
          fontWeight: "700",
          color: "white",
          margin: 12,
          marginBottom: 0,
        }}
      >
        Выбор сервера
      </Text>
      <SettingsWrapper>
        {imageServers.map((server, index) => (
          <ImageServerSelect server={server} index={index} />
        ))}
      </SettingsWrapper>
      <Text style={{ color: "rgba(255,255,255,0.6)", marginHorizontal: 12 }}>
        Выбранный сервер: {imageServers[imageServerIndex].label}
      </Text>
    </View>
  );
}
