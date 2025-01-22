import { Text } from "@/components/ui/text";
import { useProperties } from "@/store/use-properties";
import { SafeAreaView, Switch, View } from "react-native";

const SwitchMenuOption = ({
  children: text,
  value,
  setValue,
  note,
  debugOnly = false,
}: {
  children: string;
  value: boolean;
  setValue: (value: boolean) => void;
  note?: string;
  debugOnly?: boolean;
}) => {
  if (debugOnly && !__DEV__) return null;

  return (
    <View>
      <View className="flex-row items-center">
        <Text className="text-zinc-200 font-medium flex-1">{text}</Text>
        <Switch value={value} onValueChange={(value) => setValue(value)} />
      </View>
      {note && value == true && <Text className="text-zinc-600 text-sm">{note}</Text>}
    </View>
  );
};

export default function Menu() {
  const {
    readerDisplayCurrentPage,
    setReaderDisplayCurrentPage,
    showQueryDevTools,
    setShowQueryDevTools,
  } = useProperties();

  return (
    <SafeAreaView className="mx-4 gap-2">
      <SwitchMenuOption
        value={readerDisplayCurrentPage}
        setValue={setReaderDisplayCurrentPage}
      >
        Display current page in reader (experimental)
      </SwitchMenuOption>
      <SwitchMenuOption
        debugOnly
        value={showQueryDevTools}
        setValue={setShowQueryDevTools}
      >
        Show query dev-tools bubble
      </SwitchMenuOption>
      <Text className="text-zinc-700 text-center">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
