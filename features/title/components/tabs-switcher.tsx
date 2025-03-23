import { View } from "react-native";

import { Tab } from "@/components/ui/tab";
import { AllowedSiteIds } from "@/store/use-properties";
import { tabs } from "@/features/title/const/tabs-const";

export const TabsSwitcher = ({
  site,
  tab,
  setTab,
}: {
  site: AllowedSiteIds;
  tab: string;
  setTab: (value: string) => void;
}) => {
  return (
    <View className="flex-row mt-2">
      {tabs[site].map((item, index) => (
        <Tab key={index} value={item.value} selected={tab} setSelected={setTab}>
          {item.label}
        </Tab>
      ))}
    </View>
  );
};
