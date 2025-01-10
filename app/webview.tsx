import { EpisodePlayer } from "@/features/anime-player/components/player";
import { Storage, storage } from "@/features/shared/lib/storage";
import { logger } from "@/lib/logger";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";

import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function Webview() {
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const INJECTED_JAVASCRIPT = `(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            window.ReactNativeWebView.postMessage(JSON.stringify(this));
            var message = {"status" : this.status, "response" : this.response}
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        });
        open.apply(this, arguments);
    };})();
  `;

  const onMessage = (event: WebViewMessageEvent) => {
    const raw = event.nativeEvent.data;

    if (raw && typeof raw === "string") {
      const content = JSON.parse(raw);
      if (content.response?.token_type) {
        setSuccess(true);
        storage.set(Storage.token, `Bearer ${content.response.access_token}`);
        router.replace("/(tabs)");
      }
    }
  };

  if (success || storage.getString(Storage.token) == undefined)
    return (
      <SafeAreaView
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          width: "100%",
        }}
      >
        {!success && (
          <WebView
            style={{
              flex: 1,
            }}
            source={{
              uri: "https://mangalib.me/ru/front/auth",
            }}
            userAgent="(Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
            applicationNameForUserAgent="Mozilla/5.0"
            incognito
            thirdPartyCookiesEnabled
            injectedJavaScript={INJECTED_JAVASCRIPT}
            onMessage={onMessage}
          />
        )}
      </SafeAreaView>
    );
}
