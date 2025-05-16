import _LottieView, { LottieViewProps } from "lottie-react-native"
import { cn } from "@/lib/utils"

import { useMemo } from "react"
import { cssInterop } from "nativewind"

interface LottieProps extends LottieViewProps {
  className?: string
}

export const Lottie = ({ className, ...props }: LottieProps) => {
  const LottieView = useMemo(
    () => cssInterop(_LottieView, { className: { target: "style" } }),
    []
  )

  return (
    <LottieView className={cn("size-24", className)} autoPlay loop {...props} />
  )
}
