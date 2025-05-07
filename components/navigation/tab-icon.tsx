import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { View } from "react-native";

export const TabIcon = ({ icon, focused }: { icon: string; focused: boolean }) => {
  return (
    <View className={cn(focused && "bg-violet-100 dark:bg-violet-400/50 rounded-full p-2 px-6")}>
      <Icon
        size={20}
        name={icon}
        className={cn(
          focused ? "text-violet-600 dark:text-violet-300" : "dark:text-zinc-600 text-zinc-400"
        )}
      />
    </View>
  );
};
