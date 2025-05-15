import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import { icons, LucideProps } from "lucide-react-native"

import { cssInterop } from "nativewind"

import { useEffect, useMemo } from "react"
import { Text } from "@/components/ui/text"

const iconVariants = cva("text-black", {
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
      icon: "text-sm",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

interface IconProps extends LucideProps {
  name: string
  size?: number
  variant?: VariantProps<typeof iconVariants>["variant"]
  className?: string
}

export const Icon = ({
  variant,
  name,
  className,
  size = 18,
  ...props
}: IconProps) => {
  const LucideIcon = useMemo(() => {
    // @ts-ignore
    const Icon = icons[name]

    Icon.displayName = name

    cssInterop(Icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    })

    return Icon
  }, [name])

  return (
    <LucideIcon
      size={size}
      className={cn(variant && iconVariants({ variant }), className)}
      {...props}
    />
  )
}

Icon.displayName = "Icon"
