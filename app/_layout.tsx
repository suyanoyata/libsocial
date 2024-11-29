import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";

import { useEffect, useState } from "react";
import { useNotificationsCountStore } from "@/hooks/useNotificationsCountStore";

import { api, initLoggers, site_id } from "@/lib/axios";
import { store } from "@/hooks/useStore";

import {
  onlineManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import RNRestart from "react-native-restart";

import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import * as Network from "@react-native-community/netinfo";

import { logger } from "@/lib/logger";

import ErrorBoundary from "react-native-error-boundary";
import Preloader from "@/components/preloader";
import { ErrorBoundaryComponent } from "@/components/error-boundary-component";
import { colors } from "@/constants/app.constants";
import { storage } from "@/lib/storage";
import { app } from "@/hooks/useSettings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

export default function RootLayout() {
  const { setNotificationsCount } = useNotificationsCountStore();
  const [updating, setUpdating] = useState<boolean>(false);
  const {
    videoServers,
    setVideoServers,
    imageServers,
    setImageServers,
    setImageServerIndex,
  } = store();

  const { settings, setSettings } = app();

  LogBox.ignoreAllLogs();

  // #region set app theme & set network state
  useEffect(() => {
    setApiLoggers();
    Network.addEventListener((state) => {
      setSettings({
        ...settings,
        connectionType: state.type,
      });

      onlineManager.setOnline(!!state.isInternetReachable);
    });

    setSettings({
      ...settings,
      appTheme: colors[site_id - 1],
    });
  }, []);

  // #endregion

  // #region videoServers
  useEffect(() => {
    if (videoServers.length !== 0) return;

    api.get("/constants?fields[]=videoServers").then((response) => {
      logger.info(
        `Got ${response.data.data.videoServers.length} video servers.`
      );
      setVideoServers(response.data.data.videoServers);
    });
  }, []);
  // #endregion

  // #region imageServers
  useEffect(() => {
    if (imageServers.length !== 0) return;

    api.get("/constants?fields[]=imageServers").then((response) => {
      logger.info(
        `Got ${response.data.data.imageServers.length} image servers.`
      );
      setImageServers(response.data.data.imageServers);
    });
  }, []);
  // #endregion

  // #region Notifications Badge Handler
  useEffect(() => {
    api.get("/notifications/count").then((response) => {
      const count = response.data.data.unread.all;

      setNotificationsCount(count);
      Notifications.setBadgeCountAsync(count);
    });
  }, []);
  // #endregion

  // #region local image server value handling
  useEffect(() => {
    const server = storage.getNumber("image-server");

    if (!server) {
      return storage.set("image-server", 0);
    }

    setImageServerIndex(server);
  }, []);
  // #endregion

  // #region Updates Handling
  useEffect(() => {
    Updates.addUpdatesStateChangeListener((listener) => {
      if (listener.context.isUpdatePending && !updating) {
        setUpdating(true);
        queryClient.clear();
        RNRestart.restart();
      }
    });

    return () => {
      setUpdating(false);
    };
  }, []);
  // #endregion

  // #region Request Logging
  function setApiLoggers() {
    api.interceptors.request.clear();
    api.interceptors.response.clear();

    if (__DEV__) {
      initLoggers();
    }
  }
  // #endregion

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={DarkTheme}>
        <ErrorBoundary FallbackComponent={ErrorBoundaryComponent}>
          <Preloader />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{ title: "Главная", headerShown: false }}
            />
            <Stack.Screen
              name="(modals)"
              options={{ headerShown: false, presentation: "modal" }}
            />
            <Stack.Screen
              name="image-server-select"
              options={{
                headerShown: false,
                title: "Выбор сервера",
                presentation: "modal",
              }}
            />
            {/* <Stack.Screen
              name="/(modals)/filter-picker-modal"
              options={{
                presentation: "modal",
              }}
            /> */}
            <Stack.Screen
              name="title-details"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="manga-reader"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ranobe-reader"
              options={{ headerShown: false }}
            />
          </Stack>
          {__DEV__ && <DevToolsBubble />}
        </ErrorBoundary>
        <StatusBar backgroundColor="#000000" style="light" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
