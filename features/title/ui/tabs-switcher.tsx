import { Tab } from "@/components/ui/tab";
import { View } from "react-native";

export const TabsSwitcher = () => {
  return (
    <View className="flex-row mt-2">
      <Tab
        value="about"
        selected="about"
        setSelected={(selected) => console.log(selected)}
      >
        About
      </Tab>
      <Tab
        value="chapters"
        selected="about"
        setSelected={(selected) => console.log(selected)}
      >
        Chapters
      </Tab>
    </View>
  );
};
