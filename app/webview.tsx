import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView } from "react-native";

import WebView, { WebViewMessageEvent } from "react-native-webview";

export default function Webview() {
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const INJECTED_JAVASCRIPT = `(function() {
    var open = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener("load", function() {
            var message = {"status" : this.status, "response" : this.response}
            window.ReactNativeWebView.postMessage(JSON.stringify(message));
        });
        open.apply(this, arguments);
    };})();
  `;

  useEffect(() => {
    // const id = setTimeout(() => {
    //   router.replace("/(tabs)");
    // }, 500);
    // return () => {
    //   clearTimeout(id);
    // };
  }, []);

  const onMessage = (event: WebViewMessageEvent) => {
    const raw = event.nativeEvent.data;

    if (raw && typeof raw === "string") {
      const content = JSON.parse(raw);
      if (content.response.token_type) {
        setSuccess(true);
        Alert.alert("Authenticated", content.response.access_token);
        console.log(`Bearer ${content.response.access_token}`);
        // AsyncStorage.setItem(
        //   'token',
        //   `Bearer ${content.response.access_token}`,
        // );
      }
    }
  };

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
            uri: "https://test-front.mangalib.me/ru/front/auth",
          }}
          webviewDebuggingEnabled
          applicationNameForUserAgent="Mozilla"
          incognito
          injectedJavaScript={INJECTED_JAVASCRIPT}
          onMessage={onMessage}
          userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Mobile/15E148 Safari/604.1"
        />
      )}
    </SafeAreaView>
  );
}
