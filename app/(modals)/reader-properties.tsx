import { SwitchMenuOption } from "@/components/ui/switch-menu-option";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { useImageServers } from "@/features/shared/api/use-image-servers";
import { useProperties } from "@/store/use-properties";
import { useEffect, useState } from "react";

import { MenuView } from "@react-native-menu/menu";
import { Slider } from "@tamagui/slider";
import { View } from "react-native";
import useDebounce from "@/hooks/use-debounce";

export default function ReaderProperties() {
  const { data } = useImageServers();

  const {
    currentImageServerIndex,
    setCurrentImageServerIndex,
    readerImagePadding,
    setReaderImagePadding,
    showReaderScrollbar,
    setShowReaderScrollbar,
  } = useProperties();

  const [padding, setPadding] = useState(readerImagePadding);
  const [throttlePadding] = useDebounce(padding, 200);

  const [server, setServer] = useState(
    data ? data[currentImageServerIndex] : { id: 1, label: "Первый" }
  );

  useEffect(() => {
    setReaderImagePadding(throttlePadding);
  }, [throttlePadding]);

  if (!data) return null;

  return (
    <ModalWrapper>
      <View className="mx-4 flex-1 gap-2">
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
        <Text className="text-zinc-200">Distance between images: {padding}px</Text>
        <Slider
          value={[padding]}
          onValueChange={(value) => setPadding(value[0])}
          style={{ marginVertical: 1 * 8 }}
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
        <SwitchMenuOption value={showReaderScrollbar} setValue={setShowReaderScrollbar}>
          Display scrollbar in reader
        </SwitchMenuOption>
      </View>
    </ModalWrapper>
  );
}
