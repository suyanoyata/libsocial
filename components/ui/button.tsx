import * as React from "react"
import { Pressable, PressableProps } from "react-native"
import { Text } from "@/components/ui/text"

import { cva, type VariantProps } from "class-variance-authority"
import { cn, withImpact } from "@/lib/utils"
import { Icon } from "@/components/icon"

const buttonVariants = cva(
  "p-2.5 px-4 rounded-lg items-center dark:shadow-none justify-center flex-row gap-1 rounded-full",
  {
    variants: {
      variant: {
        link: "",
        outline:
          "dark:border-violet-100 border-violet-700 border-2 bg-transparent",
        accent: "dark:bg-violet-300 bg-violet-600 active:opacity-90",
        destructive: "bg-red-400 active:opacity-90",
        default: "bg-white dark:shadow active:bg-white/80",
        ghost:
          "bg-transparent active:bg-violet-100 dark:active:bg-violet-400/20",
        tonal:
          "bg-violet-200 dark:bg-violet-950 active:bg-violet-100 dark:active:bg-violet-900",
      },
      size: {
        default: "py-3",
        sm: "py-2 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export const textVariants = cva("text-black", {
  variants: {
    variant: {
      link: "text-violet-700 dark:text-violet-300 font-semibold",
      accent: "dark:text-violet-900 text-white font-semibold",
      outline: "dark:text-violet-300 text-violet-700 font-semibold",
      destructive: "text-red-900 font-semibold",
      default: "text-black",
      ghost: "text-violet-700 dark:text-violet-300 font-medium",
      tonal: "font-medium text-violet-800 dark:text-violet-200",
    },
    size: {
      default: "",
      sm: "text-sm font-medium",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  iconLeft?: React.ReactNode | string
  iconRight?: React.ReactNode | string
  children?: React.ReactNode
  textClassName?: string
  onPress?: () => void
  asChild?: boolean
}

// @ts-ignore
const Button = React.forwardRef<Pressable, ButtonProps>(
  (
    {
      asChild,
      className,
      size,
      variant,
      children,
      iconLeft,
      iconRight,
      ...props
    },
    ref
  ) => {
    return (
      <Pressable
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
        onPress={() => {
          withImpact(() => props.onPress && props.onPress())
        }}
      >
        {typeof iconLeft === "string" ? (
          <Icon
            name={iconLeft}
            strokeWidth={2.4}
            className={cn(textVariants({ variant }))}
          />
        ) : (
          iconLeft
        )}
        {asChild ? (
          children
        ) : (
          <Text
            className={cn(textVariants({ variant, size }), props.textClassName)}
          >
            {children}
          </Text>
        )}
        {typeof iconRight === "string" ? (
          <Icon
            name={iconRight}
            strokeWidth={2.4}
            className={cn(textVariants({ variant }))}
          />
        ) : (
          iconRight
        )}
      </Pressable>
    )
  }
)

Button.displayName = "Button"

export { Button }
