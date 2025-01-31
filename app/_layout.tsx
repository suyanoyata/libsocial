import "../global.css";
import "react-native-gesture-handler";

import { SplashScreen, Stack, useFocusEffect } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { DevToolsBubble } from "react-native-react-query-devtools";

import { createFont, createTamagui, TamaguiProvider } from "@tamagui/core";
import { defaultConfig } from "@tamagui/config/v4";

import { useProperties } from "@/store/use-properties";
import { useFonts } from "expo-font";
import {
  addUpdatesStateChangeListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates";
import { useCallback, useEffect, useState } from "react";

import { AppState, View } from "react-native";

import { enableFreeze, enableScreens } from "react-native-screens";

import { clientPersister } from "@/lib/persistent-query-storage";
import { initLoggers } from "@/lib/axios";
import { iconFix } from "@/lib/icons-fix";

import { GestureHandlerRootView } from "react-native-gesture-handler";

enableFreeze();
enableScreens();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5,
      retry: 1,
      gcTime: 1000 * 60 * 5,
    },
  },
});

const systemFont = createFont({
  family: "SF-Regular",
  size: {},
  face: {
    300: { normal: "SF-Light" },
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
initLoggers();

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    "SF-Light": require("../assets/fonts/SFUIText-Light.ttf"),
    "SF-Regular": require("../assets/fonts/SFUIText-Regular.ttf"),
    "SF-Medium": require("../assets/fonts/SFUIText-Medium.ttf"),
    "SF-SemiBold": require("../assets/fonts/SFUIText-Semibold.ttf"),
    "SF-Bold": require("../assets/fonts/SFUIText-Bold.ttf"),
    "SF-Heavy": require("../assets/fonts/SFUIText-Heavy.ttf"),
  });

  const [updating, setUpdating] = useState(false);

  const { showQueryDevTools } = useProperties();

  useEffect(() => {
    addUpdatesStateChangeListener(async (listener) => {
      if (listener.context.isUpdatePending && !updating) {
        setUpdating(true);
        queryClient.clear();
        await reloadAsync();
      }
    });

    return () => {
      setUpdating(false);
    };
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const focusCallback = useCallback(async (event: string) => {
    if (event == "background" || (event == "active" && !updating)) {
      const update = await checkForUpdateAsync();

      if (!update.isAvailable) return;

      setUpdating(true);
      await fetchUpdateAsync();
      await reloadAsync();
      setUpdating(false);
    }
  }, []);

  useEffect(() => {
    AppState.addEventListener("change", focusCallback);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
              {__DEV__ && showQueryDevTools && <DevToolsBubble />}
            </ThemeProvider>
          </TamaguiProvider>
        </View>
      </PersistQueryClientProvider>
    </GestureHandlerRootView>
  );
}
