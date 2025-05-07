import { SwitchMenuOption } from "@/components/ui/switch-menu-option";
import { Text } from "@/components/ui/text";

import useDebounce from "@/hooks/use-debounce";
import { useProperties } from "@/store/use-properties";
import { useEffect, useState } from "react";

import { Slider } from "@tamagui/slider";
import { useColorScheme, View } from "react-native";

import { selectionAsync } from "expo-haptics";

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

  const isDark = useColorScheme() === "dark";

  const styles = {
    active: isDark ? "#a099e0" : "#8f80d4",
    thumb: isDark ? "#2f2f2f" : "#d4d4d8",
  };

  return (
    <View className="mx-4 flex-1 gap-2">
      <Text className="text-secondary mt-2">Distance between images: {padding}px</Text>
      <Slider
        value={[padding]}
        onValueChange={(value) => {
          selectionAsync();
          setPadding(value[0]);
        }}
        style={{ marginVertical: 1 * 8 }}
        defaultValue={[0]}
        max={15}
        min={0}
      >
        <Slider.Track
          style={{
            backgroundColor: styles.thumb,
          }}
        >
          <Slider.TrackActive style={{ backgroundColor: styles.active }} />
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
