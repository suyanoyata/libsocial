import { useDownloads } from "@/features/downloads/store/use-downloads";
import { Trash2 } from "lucide-react-native";
import { Alert, Pressable } from "react-native";

export const ClearDownloadedChapters = () => {
  const clear = useDownloads((state) => state.clear);
  const count = useDownloads((state) => state.items.length);

  const deleteEverything = () => {
    Alert.alert(
      "Delete all chapters",
      `You're about to delete all ${count} chapters that you've downloaded.\n\nAre you sure?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => {
            clear();
          },
          style: "destructive",
        },
      ]
    );
  };

  if (count == 0) return;

  return (
    <Pressable onPress={deleteEverything}>
      <Trash2 className="text-secondary" />
    </Pressable>
  );
};
