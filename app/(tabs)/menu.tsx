import * as Updates from "expo-updates";
import { useEffect, useState } from "react";
import { Pressable, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SettingsItem, SettingsWrapper } from "@/components/settings-component";
import i18n from "@/lib/intl";
import { Storage, storage } from "@/features/shared/lib/storage";

const UpdatesSection = () => {
  return (
    <View
      style={{
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: "rgba(255,255,255,0.4)",
        }}
      >
        {__DEV__ && i18n.t("updates.app", { version: "development" })}
        {!__DEV__ &&
          i18n.t("updates.app", { version: String(Updates.runtimeVersion) })}
      </Text>
    </View>
  );

  return (
    <SettingsWrapper>
      <SettingsItem title={i18n.t("updates.channel")}>
        {Updates.channel ? Updates.channel : "Нет"}
      </SettingsItem>
      <SettingsItem title={i18n.t("updates.enabled")}>
        {Updates.isEnabled ? i18n.t("updates.yes") : i18n.t("updates.no")}
      </SettingsItem>
      <SettingsItem title={i18n.t("updates.version")}>
        {Updates.runtimeVersion ? Updates.runtimeVersion : "-"}
      </SettingsItem>
      <SettingsItem title={i18n.t("updates.manifest")}>
        {Updates.manifest.extra?.expoClient?.version
          ? Updates.manifest.extra.expoClient.version
          : i18n.t("updates.no")}
      </SettingsItem>
      <SettingsItem title={i18n.t("updates.number")}>
        {Updates.updateId ? Updates.updateId : "-"}
      </SettingsItem>
      <SettingsItem title={i18n.t("updates.check")}>
        {Updates.checkAutomatically}
      </SettingsItem>
    </SettingsWrapper>
  );
};

export default function Menu() {
  const [checked, setChecked] = useState<boolean>(false);

  storage.set(Storage.productionError, false);

  useEffect(() => {
    const isChecked = storage.getBoolean(Storage.productionError);

    if (isChecked != undefined) {
      setChecked(isChecked);
    }
  }, [storage]);

  return (
    <SafeAreaView>
      <SettingsWrapper>
        <SettingsItem title={i18n.t("settings.show_text_error.text")}>
          <Switch
            value={checked}
            onValueChange={(value) => {
              setChecked(value);
              storage.set(Storage.productionError, value);
            }}
          />
        </SettingsItem>
        <SettingsItem title={i18n.t("settings.show_text_error.button")}>
          <Pressable
            onPress={() => {
              throw "Error was initiated by user";
            }}
          >
            <Text style={{ color: "rgb(255,70,70)", fontSize: 16 }}>
              {i18n.t("settings.show_text_error.perform")}
            </Text>
          </Pressable>
        </SettingsItem>
      </SettingsWrapper>
      <UpdatesSection />
    </SafeAreaView>
  );
}
