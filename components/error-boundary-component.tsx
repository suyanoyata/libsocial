import { LOG, LOG_LEVEL } from "@/lib/logger";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import RNRestart from "react-native-restart";
import { Button } from "./button";
import { Construction } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export const ErrorBoundaryComponent = ({ error }: { error: Error }) => {
  const storage = useAsyncStorage("show-production-error");

  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    storage.getItem().then((res) => {
      setShowError(res == "true" ? true : false);
      if (res !== "true" && !__DEV__) {
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
    });
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "black",
        height: "100%",
        width: "100%",
        zIndex: 999,
      }}
    >
      {showError && (
        <Text style={{ color: "white" }}>
          Ошибка приложения: {JSON.stringify(error, null, 2)}
        </Text>
      )}
      <Button
        icon={<Construction size={16} color="white" strokeWidth={3} />}
        onPress={() => {
          RNRestart.restart();
        }}
      >
        Перезапустить
      </Button>
    </SafeAreaView>
  );
};
