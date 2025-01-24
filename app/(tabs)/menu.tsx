import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useProperties } from "@/store/use-properties";
import { useQueryClient } from "@tanstack/react-query";
import { SafeAreaView, Switch, View, NativeModules } from "react-native";

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
      {note && value == true && (
        <Text className="text-zinc-600 text-sm font-medium">{note}</Text>
      )}
    </View>
  );
};

const ActionMenuOption = ({
  children: text,
  note,
  actionText,
  action,
  buttonVariant,
  debugOnly = false,
}: {
  children: string;
  note?: string;
  actionText: string;
  action: () => void;
  buttonVariant?: "destructive";
  debugOnly?: boolean;
}) => {
  if (!__DEV__ && debugOnly) return null;
  return (
    <View>
      <View className="flex-row items-center mt-2">
        <Text className="text-zinc-200 font-medium flex-1">{text}</Text>
        <Button variant={buttonVariant} size="sm" onPress={action}>
          {actionText}
        </Button>
      </View>
      {note && <Text className="text-zinc-600 text-sm font-medium mt-1">{note}</Text>}
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

  const queryClient = useQueryClient();

  const { RNFlipboardFlex } = NativeModules;

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
      <ActionMenuOption
        buttonVariant="destructive"
        note="This will clear all previous network requests, such as catalog, search results data, image servers, etc... Your search and reading history will remain."
        actionText="Clear"
        action={() => queryClient.clear()}
      >
        Clear network caches
      </ActionMenuOption>
      <ActionMenuOption
        actionText="Open"
        debugOnly
        action={() => RNFlipboardFlex.showExplorer()}
      >
        Open FLEXTool
      </ActionMenuOption>
      <Text className="text-zinc-700 text-center">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
