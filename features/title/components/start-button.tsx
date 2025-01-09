import { Button } from "@/components/ui/button";
import { TitleColors } from "@/hooks/useStore";
import i18n from "@/lib/intl";
import { Anime } from "@/types/anime.type";
import { useNavigation } from "expo-router";
import { BookmarkIcon, Play } from "lucide-react-native";
import { DeviceEventEmitter } from "react-native";

type StartButtonProps = {
  data: Anime;
  count: number;
  accent: TitleColors;
};

export const StartButton = ({ data, count, accent }: StartButtonProps) => {
  const navigation: any = useNavigation();

  const isWatchable = data.site == "5";

  const type = !isWatchable ? "reading" : "watching";
  const Icon = !isWatchable ? BookmarkIcon : Play;

  return (
    <Button
      icon={
        <Icon
          color="white"
          strokeWidth={3}
          fill={isWatchable ? "white" : "#00000000"}
          size={18}
        />
      }
      onPress={() => {
        if (isWatchable) {
          navigation.navigate("anime-watch", {
            slug_url: data.slug_url,
          });
        } else {
          DeviceEventEmitter.emit("tab-value-change", "chapters");
        }
      }}
      style={{
        flex: 1,
        backgroundColor: accent.primary,
      }}
    >
      {i18n.t(`content.start.${type}`, {
        count,
        total: data.items_count.uploaded,
      })}
    </Button>
  );
};
