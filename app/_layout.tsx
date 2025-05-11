import "../global.css"
import "react-native-gesture-handler"

import { SplashScreen, Stack } from "expo-router"
import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"

import { createFont, createTamagui, TamaguiProvider } from "@tamagui/core"
import { defaultConfig } from "@tamagui/config/v4"

import { useFonts } from "expo-font"
import {
  setUpdateURLAndRequestHeadersOverride,
  addUpdatesStateChangeListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  isEnabled,
} from "expo-updates"

import { useCallback, useEffect, useState } from "react"

import {
  Alert,
  Appearance,
  AppState,
  LogBox,
  Platform,
  useColorScheme,
  View,
} from "react-native"

import { enableFreeze, enableScreens } from "react-native-screens"

import { clientPersister } from "@/lib/persistent-query-storage"
import { iconFix } from "@/lib/icons-fix"

import { GestureHandlerRootView } from "react-native-gesture-handler"

import { useSyncQueries } from "tanstack-query-dev-tools-expo-plugin"

import { Toaster } from "sonner-native"
import { BackButton } from "@/components/ui/back-button"

import { StatusBar } from "expo-status-bar"
import { ApiAuthenticationProvider } from "@/features/auth/provider/api-authentication-provider"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

import { systemColorScheme } from "react-native-css-interop/dist/runtime/native/appearance-observables"
import { BookmarkEventsProvider } from "@/features/bookmark/provider/bookmark-events-provider"
import { Header } from "@/components/ui/header"

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated"
import { Icon } from "@/components/icon"
import { useDownloads } from "@/features/downloads/store/use-downloads"

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
})

if (isEnabled) {
  setUpdateURLAndRequestHeadersOverride({
    updateUrl: "https://u.expo.dev/531f523a-eb44-4472-9cf4-fa2e3db53424",
    requestHeaders: {
      "expo-channel-name": "production",
      "expo-platform": "ios",
    },
  })
}

// globalThis.__DEV__ = false

LogBox.ignoreAllLogs()

Appearance.addChangeListener(({ colorScheme }) =>
  systemColorScheme.set(colorScheme ?? "light")
)

enableFreeze()
enableScreens()

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
})

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
})

const config = createTamagui({
  ...defaultConfig,
  fonts: {
    heading: systemFont,
    body: systemFont,
  },
})

iconFix()

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [loaded] = useFonts({
    "SF-Light": require("../assets/fonts/SFUIText-Light.ttf"),
    "SF-Regular": require("../assets/fonts/SFUIText-Regular.ttf"),
    "SF-Medium": require("../assets/fonts/SFUIText-Medium.ttf"),
    "SF-SemiBold": require("../assets/fonts/SFUIText-Semibold.ttf"),
    "SF-Bold": require("../assets/fonts/SFUIText-Bold.ttf"),
    "SF-Heavy": require("../assets/fonts/SFUIText-Heavy.ttf"),
  })

  const items = useDownloads((state) => state.items)

  const [updating, setUpdating] = useState(false)

  useSyncQueries({ queryClient })

  useEffect(() => {
    addUpdatesStateChangeListener(async (listener) => {
      if (listener.context.isUpdatePending && !updating) {
        setUpdating(true)
        queryClient.clear()
        await reloadAsync()
      }
    })

    return () => {
      setUpdating(false)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  const focusCallback = useCallback(async (event: string) => {
    if (event == "background" || (event == "active" && !updating)) {
      const update = await checkForUpdateAsync()

      if (!update.isAvailable) return

      setUpdating(true)
      await fetchUpdateAsync()
      await reloadAsync()
      setUpdating(false)
    }
  }, [])

  useEffect(() => {
    AppState.addEventListener("change", focusCallback)
  }, [])

  const isDark = useColorScheme() === "dark"

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PersistQueryClientProvider
        persistOptions={{ persister: clientPersister }}
        client={queryClient}
      >
        <View className="bg-primary flex-1">
          <TamaguiProvider config={config}>
            <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
              <ApiAuthenticationProvider>
                <BookmarkEventsProvider>
                  <BottomSheetModalProvider>
                    <Stack
                      screenOptions={{
                        headerShown: true,
                        header: () => <BackButton />,
                      }}
                    >
                      <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                      />
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
                      <Stack.Screen
                        name="manga-reader"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="downloaded-reader"
                        options={{ headerShown: false }}
                      />
                      <Stack.Screen
                        name="downloads"
                        options={{
                          title: "Downloads",
                          headerShown: true,
                          header: (props) => (
                            <View className="mt-safe">
                              <Header
                                showBackButton
                                {...props}
                                headerRight={
                                  <Icon
                                    disabled={items.length == 0}
                                    onPress={() => {
                                      Alert.alert(
                                        "Are you sure?",
                                        "You're about to delete all downloads",
                                        [
                                          {
                                            text: "Cancel",
                                          },
                                          {
                                            text: "Delete",
                                            style: "destructive",
                                            onPress: () =>
                                              useDownloads.getState().clear(),
                                          },
                                        ]
                                      )
                                    }}
                                    hitSlop={10}
                                    name="Trash2"
                                    size={20}
                                    className="text-red-400 disabled:hidden"
                                  />
                                }
                              />
                            </View>
                          ),
                        }}
                      />
                    </Stack>
                  </BottomSheetModalProvider>
                </BookmarkEventsProvider>
              </ApiAuthenticationProvider>
            </ThemeProvider>
          </TamaguiProvider>
        </View>
      </PersistQueryClientProvider>
      <Toaster
        offset={Platform.select({ ios: 30, android: 20 })}
        theme="system"
        position="bottom-center"
        visibleToasts={1}
        duration={1500}
      />
      <StatusBar />
    </GestureHandlerRootView>
  )
}
