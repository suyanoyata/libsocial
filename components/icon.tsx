import { textVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { VariantProps } from "class-variance-authority"
import { icons, LucideProps } from "lucide-react-native"

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
  // @ts-ignore
  const LucideIcon = icons[name || "House"]

  return (
    <LucideIcon
      size={size}
      className={cn(className, textVariants({ variant }))}
      {...props}
    />
  )
}

Icon.displayName = "Icon"
