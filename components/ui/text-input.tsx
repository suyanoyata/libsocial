import { cn } from "@/lib/utils"
import {
  TextInput as _TextInput,
  TextInputProps as _TextInputProps,
} from "react-native"

interface TextInputProps extends _TextInputProps {}

export const TextInput = ({ className, ...props }: TextInputProps) => {
  return (
    <_TextInput
      {...props}
      placeholderClassName="text-primary"
      className={cn(
        "bg-muted opacity-50 h-12 placeholder:text-secondary text-primary rounded-full px-5",
        className
      )}
    />
  )
}
