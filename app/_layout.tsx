import "../global.css";

import { Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { clientPersister } from "@/lib/persistent-query-storage";

import { createFont, createTamagui, TamaguiProvider } from "@tamagui/core";
import { defaultConfig } from "@tamagui/config/v4";
import { useFonts } from "expo-font";
import { Platform, View } from "react-native";

import { iconFix } from "@/lib/icons-fix";
import { useProperties } from "@/store/use-properties";

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

const systemFont = createFont({
  family: "SF-Regular",
  size: {},
  face: {
    300: { normal: "SF-Light", italic: "InterItalic" },
    500: { normal: "SF-Medium" },
    600: { normal: "SF-SemiBold" },
    700: { normal: "SF-Bold" },
    800: { normal: "SF-Heavy" },
  },
});

const config = createTamagui({
  ...defaultConfig,
  fonts: {
    heading: systemFont,
    body: systemFont,
  },
});

type Conf = typeof config;

declare module "@tamagui/core" {
  interface TamaguiCustomConfig extends Conf {}
}

iconFix();

export default function RootLayout() {
  const [loaded] = useFonts({
    "SF-Light": require("../assets/fonts/SFUIText-Light.ttf"),
    "SF-Regular": require("../assets/fonts/SFUIText-Regular.ttf"),
    "SF-Medium": require("../assets/fonts/SFUIText-Medium.ttf"),
    "SF-SemiBold": require("../assets/fonts/SFUIText-Semibold.ttf"),
    "SF-Bold": require("../assets/fonts/SFUIText-Bold.ttf"),
    "SF-Heavy": require("../assets/fonts/SFUIText-Heavy.ttf"),
  });

  const { showQueryDevTools } = useProperties();

  if (!loaded) return;

  // android needs extra view so it wont be flashing white color on navigation
  if (Platform.OS == "android") {
    return (
      <PersistQueryClientProvider
        persistOptions={{ persister: clientPersister }}
        client={queryClient}
      >
        <View className="bg-black flex-1">
          <TamaguiProvider config={config}>
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
          </TamaguiProvider>
        </View>
      </PersistQueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      persistOptions={{ persister: clientPersister }}
      client={queryClient}
    >
      <TamaguiProvider config={config}>
        <ThemeProvider value={DarkTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen options={{ presentation: "modal" }} name="(modals)" />
          </Stack>
          {__DEV__ && showQueryDevTools && <DevToolsBubble />}
        </ThemeProvider>
      </TamaguiProvider>
    </PersistQueryClientProvider>
  );
}
