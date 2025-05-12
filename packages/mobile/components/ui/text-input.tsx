import { Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import {
  TextInput as _TextInput,
  TextInputProps as _TextInputProps,
  View,
} from "react-native"

interface TextInputProps extends _TextInputProps {}

export const TextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <View className="relative">
      <_TextInput
        {...props}
        placeholderClassName="text-primary"
        className={cn(
          "bg-muted opacity-50 h-12 placeholder:text-secondary text-primary rounded-full px-5 font-medium pl-10",
          className
        )}
      />
      <Icon
        name="Search"
        className="z-20 absolute left-3 top-5 text-muted"
        strokeWidth={2.8}
      />
    </View>
  )
}
