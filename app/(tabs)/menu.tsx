import { ActionMenuOption } from "@/components/ui/action-menu-option";

import { Text } from "@/components/ui/text";

import { useQueryClient } from "@tanstack/react-query";

import { SafeAreaView, NativeModules } from "react-native";

export default function Menu() {
  const queryClient = useQueryClient();

  const { RNFlipboardFlex } = NativeModules;

  return (
    <SafeAreaView className="mx-4 gap-2">
      <ActionMenuOption
        buttonVariant="destructive"
        note="This will clear all previous network requests, such as catalog, search results data and so on... Your downloaded chapters, search and reading history will remain."
        actionText="Clear"
        action={() => queryClient.clear()}
      >
        Clear network caches
      </ActionMenuOption>
      <ActionMenuOption
        platform="ios"
        note={!RNFlipboardFlex ? "FLEXTool is unavailable." : undefined}
        disabled={!RNFlipboardFlex}
        actionText="Open"
        debugOnly
        action={() => RNFlipboardFlex?.showExplorer()}
      >
        Open FLEXTool
      </ActionMenuOption>
      <Text className="text-muted text-center mt-4">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
