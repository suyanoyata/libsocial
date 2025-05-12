import { textVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"
import { icons, LucideProps } from "lucide-react-native"
import { cssInterop } from "nativewind"
import { useMemo } from "react"

interface IconProps extends LucideProps {
  name: string
  size?: number
  variant?: VariantProps<typeof textVariants>["variant"]
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

    return cssInterop(Icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          width: true,
          height: true,
        },
      },
    })
  }, [name])

  return (
    <LucideIcon
      size={size}
      className={cn(variant ? textVariants({ variant }) : className)}
      {...props}
    />
  )
}

Icon.displayName = "Icon"
