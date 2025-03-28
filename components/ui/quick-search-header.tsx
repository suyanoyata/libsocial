import { DeviceEventEmitter, View } from "react-native";

import { Button } from "@/components/ui/button";
import { BackButton } from "@/components/ui/back-button";

import { ChevronRight } from "lucide-react-native";

export const QuickSearchHeader = () => {
  return (
    <View className="flex-row flex items-center justify-between absolute top-2 left-0 mx-2 w-[97vw]">
      <BackButton position="static" />
      <Button
        className="active:bg-white/5"
        onPress={() => {
          DeviceEventEmitter.emit("title-info-navigate");
        }}
        iconRight={<ChevronRight color="white" size={18} />}
        variant="ghost"
      >
        Learn More
      </Button>
    </View>
  );
};
