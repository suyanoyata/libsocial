import { View, Text } from "react-native";

export const SettingsItem = ({
  title,
  children,
  last = false,
}: {
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) => {
  return (
    <View
      style={{
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: !last ? "rgba(255,255,255,0.2)" : "#00000000",
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
  note,
}: {
  children: React.ReactNode;
  note?: string;
}) => {
  return (
    <View
      style={{
        marginVertical: 12,
      }}
    >
      <View
        style={{
          backgroundColor: "rgba(255,255,255,0.08)",
          marginHorizontal: 8,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {children}
      </View>
      {note && (
        <Text
          style={{
            color: "rgb(171,171,171)",
            marginHorizontal: 8,
            marginTop: 4,
          }}
        >
          {note}
        </Text>
      )}
    </View>
  );
};
