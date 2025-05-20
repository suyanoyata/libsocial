import "../global.css"
import "react-native-gesture-handler"

import { SplashScreen, Stack } from "expo-router"
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native"

import ErrorBoundary from "react-native-error-boundary"

import { createFont, createTamagui, TamaguiProvider } from "@tamagui/core"
import { defaultConfig } from "@tamagui/config/v4"

import { useFonts } from "expo-font"
import {
  addUpdatesStateChangeListener,
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
} from "expo-updates"

import { useCallback, useEffect, useState } from "react"

import {
  Appearance,
  AppState,
  LogBox,
  Platform,
  useColorScheme,
} from "react-native"

import { enableFreeze, enableScreens } from "react-native-screens"

import { GestureHandlerRootView } from "react-native-gesture-handler"

import { Toaster as _Toaster } from "sonner-native"
import { BackButton } from "@/components/ui/back-button"

import { StatusBar } from "expo-status-bar"
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"

import { systemColorScheme } from "react-native-css-interop/dist/runtime/native/appearance-observables"
import { BookmarkEventsProvider } from "@/features/bookmark/provider/bookmark-events-provider"

import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated"
import { DownloadsIcon } from "@/components/navigation/downloads-icon"

import { TRPCQueryProvider } from "@/providers/trpc-provider"

import { useSession } from "@/lib/auth"

import { cssInterop } from "react-native-css-interop"
import { queryClient } from "@/lib/trpc"
import { ErrorBoundaryComponent } from "@/components/ui/error-boundary-component"

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false,
})

// globalThis.__DEV__ = false

LogBox.ignoreAllLogs()

Appearance.addChangeListener(({ colorScheme }) =>
  systemColorScheme.set(colorScheme ?? "light")
)

enableFreeze()
enableScreens()

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

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff",
  },
}

const Toaster = cssInterop(_Toaster, { className: { target: "style" } })

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

  const [updating, setUpdating] = useState(false)

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

  const { isPending } = useSession()

  useEffect(() => {
    if (loaded && !isPending) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isPending])

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
      <TRPCQueryProvider>
        <TamaguiProvider config={config}>
          <ThemeProvider value={isDark ? DarkTheme : LightTheme}>
            <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
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
                      options={{
                        presentation: "modal",
                        headerShown: false,
                      }}
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
                        header: (props) => <DownloadsIcon {...props} />,
                      }}
                    />
                  </Stack>
                </BottomSheetModalProvider>
              </BookmarkEventsProvider>
            </ErrorBoundary>
          </ThemeProvider>
        </TamaguiProvider>
      </TRPCQueryProvider>
      <Toaster
        className="dark:bg-zinc-950 bg-zinc-100"
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
