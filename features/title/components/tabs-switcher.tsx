import { View } from "react-native";

import { Tab } from "@/components/ui/tab";

export const TabsSwitcher = ({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (value: string) => void;
}) => {
  return (
    <View className="flex-row mt-2">
      <Tab value="about" selected={tab} setSelected={setTab}>
        About
      </Tab>
      <Tab value="chapters" selected={tab} setSelected={setTab}>
        Chapters
      </Tab>
    </View>
  );
};
