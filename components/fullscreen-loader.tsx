import { ActivityIndicator, View } from "react-native";

export const Loader = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator color="white" />
    </View>
  );
};
