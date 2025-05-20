import { Icon as _Icon } from "@/components/icon"
import { cn } from "@/lib/utils"
import {
  TextInput as _TextInput,
  TextInputProps as _TextInputProps,
  View,
} from "react-native"
import Animated, { FadeIn, FadeOut } from "react-native-reanimated"

interface TextInputProps extends _TextInputProps {
  showClearButton?: boolean
}

const Icon = Animated.createAnimatedComponent(_Icon)

export const TextInput = ({
  className,
  onChangeText,
  showClearButton = true,
  ...props
}: TextInputProps) => {
  return (
    <View
      className={cn(
        "relative justify-center",
        "bg-muted-darken opacity-50 h-12 rounded-full",
        className
      )}
    >
      <_TextInput
        {...props}
        onChangeText={onChangeText}
        placeholderClassName="text-primary"
        clearButtonMode="never"
        className={cn(
          "placeholder:text-secondary text-primary px-5 pl-10 font-medium"
        )}
      />
      <_Icon
        name="Search"
        className="z-20 absolute left-3 top-3 text-muted"
        strokeWidth={2.8}
      />
      {showClearButton && props.value && props.value.length > 0 && (
        <Icon
          entering={FadeIn}
          onPress={() => onChangeText && onChangeText("")}
          name="X"
          hitSlop={20}
          className="z-20 absolute right-3 top-3 text-muted size-6"
          strokeWidth={2.3}
        />
      )}
    </View>
  )
}
