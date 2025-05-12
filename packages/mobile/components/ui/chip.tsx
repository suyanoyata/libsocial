import * as React from "react"
import { Pressable, PressableProps } from "react-native"
import { Text } from "@/components/ui/text"

import { cva, type VariantProps } from "class-variance-authority"
import { cn, withImpact } from "@/lib/utils"
import { Icon } from "@/components/icon"

const chipVariants = cva(
  "p-2.5 px-4 items-center dark:shadow-none justify-center flex-row gap-1 rounded-xl",
  {
    variants: {
      variant: {
        accent: "dark:bg-violet-300 bg-violet-600 active:opacity-90",
        tonal:
          "bg-violet-200 dark:bg-violet-950 active:bg-violet-100 dark:active:bg-violet-900",
      },
      size: {
        sm: "py-2 px-3",
        icon: "w-11 h-8",
      },
    },
    defaultVariants: {
      variant: "accent",
      size: "sm",
    },
  }
)

const textVariants = cva("text-black", {
  variants: {
    variant: {
      accent: "dark:text-violet-900 text-white font-semibold",
      tonal: "font-medium text-violet-800 dark:text-violet-200",
    },
    size: {
      sm: "text-sm font-medium",
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "accent",
    size: "sm",
  },
})

export interface ButtonProps
  extends PressableProps,
    VariantProps<typeof chipVariants> {
  iconLeft?: React.ReactNode | string
  iconRight?: React.ReactNode | string
  children?: React.ReactNode
  textClassName?: string
  onPress?: () => void
  asChild?: boolean
}

// @ts-ignore
const Chip = React.forwardRef<Pressable, ButtonProps>(
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
        className={cn(chipVariants({ variant, size, className }))}
        {...props}
        onPress={() => {
          withImpact(() => props.onPress && props.onPress())
        }}
      >
        {typeof iconLeft === "string" ? (
          <Icon name={iconLeft} strokeWidth={2.4} variant={variant} />
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
          <Icon name={iconRight} strokeWidth={2.4} variant={variant} />
        ) : (
          iconRight
        )}
      </Pressable>
    )
  }
)

Chip.displayName = "Chip"

export { Chip }
