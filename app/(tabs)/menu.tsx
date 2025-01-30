import { ActionMenuOption } from "@/components/ui/action-menu-option";
import { SwitchMenuOption } from "@/components/ui/switch-menu-option";

import { Text } from "@/components/ui/text";

import { useProperties } from "@/store/use-properties";
import { useQueryClient } from "@tanstack/react-query";

import { SafeAreaView, NativeModules } from "react-native";

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
        Display current page in reader (unstable)
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
