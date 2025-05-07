import { ActionMenuOption } from "@/components/ui/action-menu-option";

import { Text } from "@/components/ui/text";
import { AuthFlow } from "@/features/auth/ui/auth-flow";
import { useDownloads } from "@/features/downloads/store/use-downloads";

import { useQueryClient } from "@tanstack/react-query";

import { SafeAreaView, NativeModules } from "react-native";

export default function Menu() {
  const queryClient = useQueryClient();

  const clear = useDownloads((state) => state.clear);

  const { RNFlipboardFlex } = NativeModules;

  return (
    <SafeAreaView className="mx-4 gap-2">
      <AuthFlow />
      <Text className="text-3xl text-primary font-extrabold -mb-2 mt-2">Settings</Text>
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
      <ActionMenuOption
        buttonVariant="destructive"
        note="This will clear all previous network requests, such as catalog, search results data and so on... Your downloaded chapters, search and reading history will remain."
        actionText="Clear"
        action={() => queryClient.clear()}
      >
        Clear network caches
      </ActionMenuOption>
      <ActionMenuOption
        actionText="Delete"
        note="This will delete all downloaded chapter images"
        buttonVariant="destructive"
        debugOnly
        action={clear}
      >
        Delete all downloads
      </ActionMenuOption>
      <Text className="text-muted text-center mt-4">
        client version: {process.env.EXPO_PUBLIC_VERSION}
      </Text>
    </SafeAreaView>
  );
}
