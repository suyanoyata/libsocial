import "../global.css";

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { DevToolsBubble } from "react-native-react-query-devtools";

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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}
