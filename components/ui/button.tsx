import * as React from "react";
import { Pressable, PressableProps } from "react-native";
import { Text } from "@/components/ui/text";

import { cva, type VariantProps } from "class-variance-authority";
import { cn, withImpact } from "@/lib/utils";

const buttonVariants = cva(
  "p-2.5 px-4 rounded-lg items-center justify-center dark:shadow-sm flex-row gap-1",
  {
    variants: {
      variant: {
        accent: "bg-orange-400 active:bg-orange-400/80 dark:bg-orange-500 active:bg-orange-500/80",
        default: "bg-white dark:shadow active:bg-white/80",
        ghost:
          "bg-transparent active:bg-zinc-100/80 dark:active:bg-zinc-800/80 shadow-none dark:shadow-sm active:bg-zinc-200",
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
      accent: "text-white",
      default: "text-black",
      ghost: "text-secondary font-medium",
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
  textClassName?: string;
  onPress?: () => void;
  asChild?: boolean;
}

// @ts-ignore
const Button = React.forwardRef<Pressable, ButtonProps>(
  ({ asChild, className, size, variant, children, iconLeft, iconRight, ...props }, ref) => {
    return (
      <Pressable
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        onPress={() => {
          withImpact(() => props.onPress && props.onPress());
        }}
      >
        {iconLeft}
        {asChild ? (
          children
        ) : (
          <Text className={cn(textVariants({ variant, size }), props.textClassName)}>
            {children}
          </Text>
        )}
        {iconRight}
      </Pressable>
    );
  }
);

Button.displayName = "Button";

export { Button };
