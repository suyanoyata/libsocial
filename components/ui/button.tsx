import * as React from "react";
import { Pressable, PressableProps, Text } from "react-native";
import * as Haptics from "expo-haptics";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "p-2.5 px-4 rounded-lg items-center justify-center shadow-sm flex-row gap-1",
  {
    variants: {
      variant: {
        default: "bg-white shadow active:bg-white/80",
        ghost: "bg-transparent active:bg-zinc-800/50 hover:bg-zinc-800",
        destructive: "bg-red-500 active:bg-red-400 hover:bg-red-400",
      },
      size: {
        default: "px-4 py-2",
        sm: "py-1.5 rounded-md px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const textVariants = cva("text-black", {
  variants: {
    variant: {
      default: "text-black",
      ghost: "text-white",
      destructive: "text-white",
    },
    size: {
      default: "text-base",
      sm: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export interface ButtonProps extends PressableProps, VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  children?: React.ReactNode;
  onPress?: () => void;
}

// @ts-ignore
const Button = React.forwardRef<Pressable, ButtonProps>(
  ({ className, size, variant, children, iconLeft, iconRight, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          props.onPress && props.onPress();
        }}
        {...props}
      >
        {iconLeft}
        <Text className={cn(textVariants({ variant, size }))}>{children}</Text>
        {iconRight}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button };
