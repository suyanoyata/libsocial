import * as Updates from "expo-updates";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/lib/intl";
import { MenuUserCard } from "@/features/users/widgets/menu-user-card";
import { LogOut } from "@/features/users/components/logout";
import { MenuLoginButton } from "@/features/users/components/menu-login-button";

export default function Menu() {
  return (
    <SafeAreaView style={{ gap: 8 }}>
      {/* <SettingsWrapper>
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
      </SettingsWrapper> */}
      <MenuUserCard />
      <MenuLoginButton />
      <LogOut />
      <View
        style={{
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <Text
          style={{
            color: "rgba(255,255,255,0.4)",
          }}
        >
          {__DEV__ &&
            i18n.t("updates.app", { version: process.env.EXPO_PUBLIC_VERSION })}
          {!__DEV__ &&
            i18n.t("updates.app", { version: process.env.EXPO_PUBLIC_VERSION })}
        </Text>
      </View>
    </SafeAreaView>
  );
}
