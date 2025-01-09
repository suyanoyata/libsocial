import { SafeAreaView } from "react-native-safe-area-context";
import { Construction } from "lucide-react-native";
import { Alert, Text } from "react-native";
import { useEffect } from "react";

import RNRestart from "react-native-restart";

import { Button } from "@/components/ui/button";

import { Storage, storage } from "@/features/shared/lib/storage";

import { app } from "@/hooks/useSettings";

export const ErrorBoundaryComponent = ({ error }: { error: Error }) => {
  const showError = storage.getBoolean(Storage.productionError);
  const { settings } = app();

  useEffect(() => {
    if (showError && !__DEV__) {
      Alert.alert(
        "Ошибка приложения",
        "В приложении произошла ошибка и оно должно быть перезапущено.",
        [
          {
            text: "Понятно",
            onPress: () => {
              RNRestart.restart();
            },
          },
        ]
      );
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        zIndex: 999,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {showError && (
        <Text style={{ color: "white" }}>
          Ошибка приложения: {JSON.stringify(error, null, 2)}
        </Text>
      )}
      <Button
        icon={<Construction size={16} color="white" strokeWidth={3} />}
        style={{
          backgroundColor: settings.appTheme.primary,
        }}
        onPress={() => {
          RNRestart.restart();
        }}
      >
        Перезапустить
      </Button>
    </SafeAreaView>
  );
};
