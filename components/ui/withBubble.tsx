import React from "react";

import { View } from "react-native";

const withBubble = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P) => (
    <View className="size-16 bg-muted items-center justify-center rounded-full">
      <WrappedComponent
        {...props}
        color="white"
        size={28}
        style={{
          opacity: 0.9,
        }}
      />
    </View>
  );
};

export default withBubble;
