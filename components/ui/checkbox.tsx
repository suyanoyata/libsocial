import { Pressable, PressableProps } from "react-native";
import { CheckIcon } from "lucide-react-native";

import { cn } from "@/lib/utils";

interface Props extends PressableProps {
  className?: string;
  checked?: boolean;
}

export const Checkbox = ({ checked, className, ...props }: Props) => {
  return (
    <Pressable
      className={cn(
        "items-center justify-center size-6 bg-transparent rounded-md border border-orange-400 pointer-events-none",
        checked && "bg-orange-400",
        className
      )}
      {...props}
    >
      {checked && <CheckIcon color="white" strokeWidth={3} size={16} />}
    </Pressable>
  );
};
