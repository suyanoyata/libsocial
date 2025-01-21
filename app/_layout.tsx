import "../global.css";

import { Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { clientPersister } from "@/lib/persistent-query-storage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  return (
    <PersistQueryClientProvider
      persistOptions={{ persister: clientPersister }}
      client={queryClient}
    >
      <ThemeProvider value={DarkTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen options={{ presentation: "modal" }} name="(modals)" />
        </Stack>
        <DevToolsBubble />
      </ThemeProvider>
    </PersistQueryClientProvider>
  );
}
