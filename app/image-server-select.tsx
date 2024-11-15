import { SettingsWrapper } from "@/components/settings-component";
import { ImageServer, store } from "@/hooks/useStore";
import { site_id } from "@/lib/axios";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function ImageServerSelect() {
  const { imageServers, imageServerIndex, setImageServerIndex } = store();

  const storage = useAsyncStorage("image-server");

  useEffect(() => {
    storage.getItem().then((res) => {
      if (!res) {
        storage.setItem("0");

        return;
      }

      setImageServerIndex(parseInt(res));
    });
  }, []);

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
          borderBottomWidth: 1,
          borderBottomColor: "rgba(255,255,255,0.2)",
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setImageServerIndex(index);

            storage.setItem(index.toString());
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
