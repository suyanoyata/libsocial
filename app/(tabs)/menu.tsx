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
        note="This will clear all previous network requests, such as catalog, search results data, image servers, etc... Your search and reading history will remain."
        actionText="Clear"
        action={() => queryClient.clear()}
      >
        Clear network caches
      </ActionMenuOption>
      <ActionMenuOption actionText="Open" debugOnly action={() => RNFlipboardFlex.showExplorer()}>
        Open FLEXTool
      </ActionMenuOption>
      <Text className="text-zinc-700 text-center">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
