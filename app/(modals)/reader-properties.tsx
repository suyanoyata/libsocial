import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useProperties } from "@/store/use-properties";
import { useState } from "react";

import { MenuView } from "@react-native-menu/menu";
import { Slider } from "@tamagui/slider";
import { View } from "react-native";

export default function ReaderProperties() {
  const { data } = useImageServers();

  const {
    currentImageServerIndex,
    setCurrentImageServerIndex,
    readerImagePadding,
    setReaderImagePadding,
  } = useProperties();

  const [server, setServer] = useState(
    data ? data[currentImageServerIndex] : { id: 1, label: "Первый" }
  );

  if (!data) return null;

  return (
    <ModalWrapper>
      <View className="mx-4 flex-1">
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
        <Text className="text-zinc-200 mb-2">
          Distance between images: {readerImagePadding}px
        </Text>
        <Slider
          value={[readerImagePadding]}
          onValueChange={(value) => setReaderImagePadding(value[0])}
          style={{ marginTop: 1 * 8 }}
          defaultValue={[0]}
          max={15}
          min={0}
        >
          <Slider.Track
            style={{
              backgroundColor: "#a1a1aa",
            }}
          >
            <Slider.TrackActive style={{ backgroundColor: "#a1a1aa" }} />
          </Slider.Track>
          <Slider.Thumb
            style={{
              backgroundColor: "white",
            }}
            size="$1"
            circular
            borderWidth={0}
            index={0}
          />
        </Slider>
      </View>
    </ModalWrapper>
  );
}
