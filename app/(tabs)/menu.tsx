import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { SettingsItem, SettingsWrapper } from "@/components/settings-component";

const UpdatesSection = () => {
  if (!Updates.isEnabled){
    return (
      <View style={{
        alignItems: 'center'
      }}>
        <Text style={{
          color: "white"
        }}>Обновления недоступны</Text>
      </View>
    )
  }

  return (
    <SettingsWrapper>
      <SettingsItem title={"Канал обновлений"}>
        {Updates.channel ? Updates.channel : "Нет"}
      </SettingsItem>
      <SettingsItem title={"Обновления включены"}>
        {Updates.isEnabled ? "Да" : "Нет"}
      </SettingsItem>
      <SettingsItem title={"Версия expo"}>
        {Updates.runtimeVersion ? Updates.runtimeVersion : "-"}
      </SettingsItem>
      <SettingsItem title="Версия в манифесте">
        {Updates.manifest.extra?.expoClient?.version
          ? Updates.manifest.extra.expoClient.version
          : "Нет"}
      </SettingsItem>
      <SettingsItem title={"Номер обновления"}>
        {Updates.updateId ? Updates.updateId : "-"}
      </SettingsItem>
      <SettingsItem title="Проверка обновлений">
        {Updates.checkAutomatically}
      </SettingsItem>
    </SettingsWrapper>
  )
}

export default function Menu() {
  const [checked, setChecked] = useState<boolean>(false);

  const storage = useAsyncStorage("show-production-error");

  useEffect(() => {
    storage.getItem().then((res) => {
      if (!res) {
        storage.setItem("false");
      }

      setChecked(res == "true" ? true : false);
    });
  }, [storage]);

  return (
    <SafeAreaView>
      <UpdatesSection />
      <SettingsWrapper>
        <SettingsItem title="Показывать текст ошибки">
          <Switch
            value={checked}
            onValueChange={(value) => {
              setChecked(value);
              storage.setItem(value == true ? "true" : "false");
            }}
          />
        </SettingsItem>
        <SettingsItem title="Вызвать ошибку">
          <Pressable
            onPress={() => {
              throw "Error was initiated by user";
            }}
          >
            <Text style={{ color: "rgb(255,70,70)", fontSize: 16 }}>
              Сделать
            </Text>
          </Pressable>
        </SettingsItem>
      </SettingsWrapper>
    </SafeAreaView>
  );
}
