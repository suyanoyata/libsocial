import { SwitchMenuOption } from "@/components/ui/switch-menu-option";
import { Text } from "@/components/ui/text";

import { useProperties } from "@/store/use-properties";
import { useEffect, useState } from "react";

import { Slider } from "@tamagui/slider";
import { View } from "react-native";
import useDebounce from "@/hooks/use-debounce";

export default function ReaderProperties() {
  const {
    readerImagePadding,
    setReaderImagePadding,
    showReaderScrollbar,
    setShowReaderScrollbar,
    readerDisplayCurrentPage,
    setReaderDisplayCurrentPage,
  } = useProperties();

  const [padding, setPadding] = useState(readerImagePadding);
  const [throttlePadding] = useDebounce(padding, 200);

  useEffect(() => {
    setReaderImagePadding(throttlePadding);
  }, [throttlePadding]);

  return (
    <View className="mx-4 flex-1 gap-2">
      <Text className="text-zinc-200 mt-2">Distance between images: {padding}px</Text>
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
      <SwitchMenuOption value={readerDisplayCurrentPage} setValue={setReaderDisplayCurrentPage}>
        Display current page in reader (unstable)
      </SwitchMenuOption>
    </View>
  );
}
