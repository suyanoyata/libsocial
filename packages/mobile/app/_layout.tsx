import "../global.css"
import "react-native-gesture-handler"

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native"
import { TamaguiProvider } from "@tamagui/core"
import { useFonts } from "expo-font"
import { addNetworkStateListener, NetworkStateType } from "expo-network"
import { SplashScreen, Stack } from "expo-router"

import { StatusBar } from "expo-status-bar"
import { useEffect } from "react"
import { Appearance, LogBox, Platform, useColorScheme } from "react-native"
import { cssInterop } from "react-native-css-interop"
import { systemColorScheme } from "react-native-css-interop/dist/runtime/native/appearance-observables"
import ErrorBoundary from "react-native-error-boundary"

import { GestureHandlerRootView } from "react-native-gesture-handler"
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated"
import { enableFreeze, enableScreens } from "react-native-screens"

import { Toaster as _Toaster } from "sonner-native"
import { BookmarkEventsProvider } from "@/features/bookmark/provider/bookmark-events-provider"
import { DownloadsIcon } from "@/components/navigation/downloads-icon"
import { BackButton } from "@/components/ui/back-button"

import { ErrorBoundaryComponent } from "@/components/ui/error-boundary-component"
import { useSession } from "@/lib/auth"
import { config } from "@/lib/ui/tamagui-config"
import { TRPCQueryProvider } from "@/providers/trpc-provider"

import { UpdateProvider } from "@/providers/update-provider"
import { useProperties } from "@/store/use-properties"

configureReanimatedLogger({
  level: ReanimatedLogLevel.error,
  strict: false
})

// globalThis.__DEV__ = false

LogBox.ignoreAllLogs()

Appearance.addChangeListener(({ colorScheme }) =>
  systemColorScheme.set(colorScheme ?? "light")
)

enableFreeze()
enableScreens()

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#ffffff"
  }
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
    "SF-Heavy": require("../assets/fonts/SFUIText-Heavy.ttf")
  })

  const { isPending } = useSession()

  const { setCelluar } = useProperties()

  useEffect(() => {
    if (loaded && !isPending) {
      SplashScreen.hideAsync()
    }
  }, [loaded, isPending])

  useEffect(() => {
    const sub = addNetworkStateListener((state) => {
      setCelluar(state.type == NetworkStateType.CELLULAR)
    })

    return () => sub.remove()
  }, [])

  const isDark = useColorScheme() === "dark"

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TRPCQueryProvider>
        <UpdateProvider>
          <TamaguiProvider config={config}>
            <ThemeProvider value={isDark ? DarkTheme : LightTheme}>
              <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
                <BookmarkEventsProvider>
                  <BottomSheetModalProvider>
                    <Stack
                      screenOptions={{
                        headerShown: true,
                        header: () => <BackButton />
                      }}
                    >
                      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                      <Stack.Screen
                        options={{
                          presentation: "modal",
                          headerShown: false
                        }}
                        name="(modals)"
                      />
                      <Stack.Screen
                        name="title-info"
                        options={{
                          headerShown: false
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
                          header: (props) => <DownloadsIcon {...props} />
                        }}
                      />
                    </Stack>
                  </BottomSheetModalProvider>
                </BookmarkEventsProvider>
              </ErrorBoundary>
            </ThemeProvider>
          </TamaguiProvider>
        </UpdateProvider>
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
