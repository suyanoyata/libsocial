import { ActivityIndicator, Pressable, Text, ViewStyle } from "react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { Conditional } from "@/components/misc/conditional";
import { app } from "@/hooks/useSettings";
import * as Haptics from "expo-haptics";

import React, { forwardRef } from "react";

export const Button = forwardRef(
  (
    {
      children,
      style,
      onPress,
      icon,
      isPending,
      disabled = false,
      asChild = false,
      animationDisabled = false,
      iconPosition = "left",
    }: {
      children: React.ReactNode;
      style?: ViewStyle;
      onPress?: () => void;
      icon?: React.ReactNode;
      isPending?: boolean;
      disabled?: boolean;
      asChild?: boolean;
      animationDisabled?: boolean;
      iconPosition?: "left" | "right";
    },
    ref
  ) => {
    const Component = Animated.createAnimatedComponent(Pressable);
    const { settings } = app();

    const scale = useSharedValue(1);

    if (animationDisabled) {
      return (
        <Pressable
          // @ts-ignore
          ref={ref}
          onPress={() => {
            onPress && onPress();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
          style={{
            ...style,
          }}
        >
          {children}
        </Pressable>
      );
    }

    if (asChild) {
      return (
        <Component
          // @ts-ignore
          ref={ref}
          onPressIn={() => {
            if (disabled) return;
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
            scale.value = withTiming(0.95, {
              duration: 150,
            });
          }}
          onPress={() => {
            if (onPress && !disabled) {
              onPress();
              scale.value = withTiming(1, {
                duration: 150,
              });
            }
          }}
          onPressOut={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            scale.value = withTiming(1, {
              duration: 150,
            });
          }}
          style={{
            transform: [{ scale: scale }],
            opacity: disabled ? 0.5 : 1,
            ...style,
          }}
        >
          {children}
        </Component>
      );
    }

    return (
      <Component
        // @ts-ignore
        ref={ref}
        onPressIn={() => {
          if (disabled) return;
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          scale.value = withTiming(0.95, {
            duration: 150,
          });
        }}
        onPress={() => {
          if (onPress && !disabled) {
            onPress();
            scale.value = withTiming(1, {
              duration: 150,
            });
          }
        }}
        onPressOut={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          scale.value = withTiming(1, {
            duration: 150,
          });
        }}
        style={{
          transform: [{ scale: scale }],
          backgroundColor: settings.appTheme.primary,
          paddingHorizontal: 12,
          paddingVertical: !!isPending ? 5 : 9,
          borderRadius: 6,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          opacity: disabled ? 0.5 : 1,
          ...style,
        }}
      >
        <Conditional conditions={[!isPending]}>
          {iconPosition == "left" && icon}
          <Text
            numberOfLines={1}
            style={{
              color: "white",
              fontWeight: "500",
            }}
          >
            {children}
          </Text>
          {iconPosition == "right" && icon}
        </Conditional>
        <Conditional conditions={[!!isPending]}>
          <ActivityIndicator size="small" color="white" />
        </Conditional>
      </Component>
    );
  }
);
