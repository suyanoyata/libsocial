import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { useState } from "react";
import { Text, View } from "react-native";
import { MenuView } from "@react-native-menu/menu";
import { Button } from "@/components/ui/button";
import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useProperties } from "@/store/use-properties";

export default function ReaderProperties() {
  const { data } = useImageServers();

  const { currentImageServerIndex, setCurrentImageServerIndex } = useProperties();

  const [server, setServer] = useState(
    data ? data[currentImageServerIndex] : { id: 1, label: "Первый" }
  );

  if (!data) return null;

  return (
    <ModalWrapper>
      <View className="mx-2 flex-1">
        <View className="flex-row items-center">
          <Text className="text-zinc-200 flex-1">Select image server</Text>
          <MenuView
            onPressAction={({ nativeEvent }) => {
              setCurrentImageServerIndex(Number(nativeEvent.event));
              setServer(data[Number(nativeEvent.event)]);
            }}
            actions={data.map((item, index: number) => ({
              id: index.toString(),
              title: item.label,
            }))}
          >
            <Button>{server.label}</Button>
          </MenuView>
        </View>
      </View>
    </ModalWrapper>
  );
}
