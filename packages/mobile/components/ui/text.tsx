import { TamaguiText } from "@/components/ui/tamagui-text"
import { Platform, Text as ReactNativeText, TextProps } from "react-native"

type TextComponentProps = TextProps & {
  className?: string
}

export const Text = ({ className, ...props }: TextComponentProps) => {
  if (Platform.OS == "ios") {
    return <ReactNativeText className={className} {...props} />
  } else {
    return <TamaguiText className={className} {...props} />
  }
}
