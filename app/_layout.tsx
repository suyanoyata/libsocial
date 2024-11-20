import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack } from "expo-router";

import { useEffect, useState } from "react";
import { useNotificationsCountStore } from "@/hooks/useNotificationsCountStore";

import { api } from "@/lib/axios";
import { store } from "@/hooks/useStore";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DevToolsBubble } from "react-native-react-query-devtools";
import { Alert, LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import RNRestart from "react-native-restart";

import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import { logger } from "@/lib/logger";

import ErrorBoundary from "react-native-error-boundary";
import Preloader from "@/components/preloader";
import { ErrorBoundaryComponent } from "@/components/error-boundary-component";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
});

const BACKGROUND_FETCH_TASK = "background-fetch-notifications";

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

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    await api.get("/notifications/count").then((response) => {
      const count = response.data.data.unread.all;

      setNotificationsCount(count);
      Notifications.setBadgeCountAsync(count);
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  LogBox.ignoreAllLogs();

  // videoServers
  useEffect(() => {
    setApiLoggers();
    if (videoServers.length !== 0) return;

    api.get("/constants?fields[]=videoServers").then((response) => {
      logger.info(
        `Got ${response.data.data.videoServers.length} video servers.`
      );
      setVideoServers(response.data.data.videoServers);
    });
  }, []);

  // imageServers
  useEffect(() => {
    if (imageServers.length !== 0) return;

    api.get("/constants?fields[]=imageServers").then((response) => {
      logger.info(
        `Got ${response.data.data.imageServers.length} image servers.`
      );
      setImageServers(response.data.data.imageServers);
    });
  }, []);

  useEffect(() => {
    BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 60 * 15,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    api.get("/notifications/count").then((response) => {
      const count = response.data.data.unread.all;

      setNotificationsCount(count);
      Notifications.setBadgeCountAsync(count);
    });
  }, []);

  // #region Image Server Handling
  useEffect(() => {
    AsyncStorage.getItem("image-server").then((res) => {
      if (!res) return;

      setImageServerIndex(parseInt(res));
    });
  }, []);
  // #endregion

  // #region Updates Handling
  useEffect(() => {
    Updates.addUpdatesStateChangeListener((listener) => {
      if (listener.context.isUpdatePending && !updating) {
        setUpdating(true);
        RNRestart.restart();
        // Alert.alert(
        //   "Установлено обновление",
        //   "Перезапустите приложение, чтобы применить его",
        //   [
        //     {
        //       text: "Перезапустить",
        //       onPress: () => {

        //         // Updates.reloadAsync();
        //       },
        //     },
        //   ]
        // );
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

    if (__DEV__) {
      api.interceptors.request.use(
        (request) => {
          logger.request(
            `${request.method?.toUpperCase()} ${request.baseURL}${request.url}`
          );
          return request;
        },
        (error) => {
          console.log(`Request rejected ${error}`);
        }
      );
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
        <StatusBar />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
