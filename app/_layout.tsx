import "../global.css";
import "react-native-gesture-handler";

import { SplashScreen, Stack } from "expo-router";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";

import { createFont, createTamagui, TamaguiProvider } from "@tamagui/core";
import { defaultConfig } from "@tamagui/config/v4";

import { useFonts } from "expo-font";
import {
  addUpdatesStateChangeListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates";
import { useCallback, useEffect, useState } from "react";

import { AppState, useColorScheme, View } from "react-native";

import { enableFreeze, enableScreens } from "react-native-screens";

import { clientPersister } from "@/lib/persistent-query-storage";
import { iconFix } from "@/lib/icons-fix";

import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { setBackgroundColorAsync } from "expo-system-ui";

import { useSyncQueries } from "tanstack-query-dev-tools-expo-plugin";

import { Toaster } from "sonner-native";
import { BackButton } from "@/components/ui/back-button";

import { StatusBar } from "expo-status-bar";

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

iconFix();

// setBackgroundColorAsync("black");

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

  useSyncQueries({ queryClient });

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

  const isDark = useColorScheme() === "dark";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        persistOptions={{ persister: clientPersister }}
        client={queryClient}
      >
        <View className="bg-primary flex-1">
          <TamaguiProvider config={config}>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
              <Stack
                screenOptions={{
                  headerShown: true,
                  header: () => <BackButton />,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  options={{ presentation: "modal", headerShown: false }}
                  name="(modals)"
                />
                <Stack.Screen
                  name="title-info"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen name="manga-reader" options={{ headerShown: false }} />
                <Stack.Screen name="downloaded-reader" options={{ headerShown: false }} />
              </Stack>
            </ThemeProvider>
          </TamaguiProvider>
        </View>
      </PersistQueryClientProvider>
      <Toaster
        offset={10}
        theme="light"
        position="bottom-center"
        visibleToasts={1}
        duration={1500}
      />
      <StatusBar />
    </GestureHandlerRootView>
  );
}
