import { View, Text } from "react-native";

export const SettingsItem = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.2)",
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text numberOfLines={1} style={{ color: "white", fontSize: 16, flex: 1 }}>
        {title}
      </Text>
      {typeof children != "object" && (
        <Text
          selectable
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 16,
          }}
        >
          {children}
        </Text>
      )}
      {typeof children == "object" && children}
    </View>
  );
};

export const SettingsWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        marginHorizontal: 8,
        borderRadius: 6,
        overflow: "hidden",
        marginVertical: 12,
      }}
    >
      {children}
    </View>
  );
};
