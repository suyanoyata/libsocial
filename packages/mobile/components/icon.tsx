import { cva, VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

import _FontAwesomeIcon from "react-native-vector-icons/FontAwesome6"
import _FeatherIcon from "react-native-vector-icons/Feather"
import { icons, LucideProps } from "lucide-react-native"

import { cssInterop } from "nativewind"

import { useMemo } from "react"
import { withIconCss } from "@/lib/icons-fix"

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
  fill?: string
  filled?: boolean
  className?: string
}

export const Icon = ({
  variant,
  name,
  className,
  fill,
  filled = false,
  size = 18,
  ...props
}: IconProps) => {
  const LucideIcon = useMemo(() => {
    // @ts-ignore
    const Icon = icons[name]

    Icon.displayName = name

    return withIconCss(Icon)
  }, [name])

  const shouldFill = filled || !!fill

  return (
    <LucideIcon
      size={size}
      className={cn(variant && iconVariants({ variant }), className)}
      fill={cn(shouldFill && (fill ? fill : iconVariants({ variant })))}
      {...props}
    />
  )
}

export const FeatherIcon = ({
  variant,
  name,
  className,
  size = 18,
  ...props
}: IconProps) => {
  const Icon = withIconCss(_FeatherIcon)

  return (
    <Icon
      name={name}
      size={size}
      className={cn(variant && iconVariants({ variant }), className)}
      {...props}
    />
  )
}

export const FontAwesomeIcon = ({
  variant,
  name,
  className,
  size = 18,
  ...props
}: IconProps) => {
  const Icon = withIconCss(_FontAwesomeIcon)

  return (
    <Icon
      name={name}
      size={size}
      className={cn(variant && iconVariants({ variant }), className)}
      {...props}
    />
  )
}

Icon.displayName = "Icon"
