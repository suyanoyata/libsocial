import { LastReadTitle } from "@/features/last-read-tracking/types/last-read-title";
import { View } from "react-native";

export const TitleProgressBar = ({ title }: { title: LastReadTitle }) => {
  const progress = (title.lastReadChapter / title.chapters) * 100;
  return (
    <View
      style={{
        marginTop: "auto",
        height: 8,
        width: "100%",
        overflow: "hidden",
        borderRadius: 6,
        backgroundColor: "rgba(255,255,255,0.1)",
      }}
    >
      <View
        style={{ height: 8, backgroundColor: "white", width: `${progress}%` }}
      />
    </View>
  );
};
