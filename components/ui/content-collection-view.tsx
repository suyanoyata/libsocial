import { useMemo, useTransition } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useWindowDimensions, View } from "react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";

import { SortAsc, SortDesc } from "lucide-react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { FlashList, FlashListProps } from "@shopify/flash-list";

import { cn } from "@/lib/utils";

interface Props<T> extends FlashListProps<T> {
  title: string;
  descending: boolean;
  reverseCallback: () => void;
}

export const ContentCollectionView = <T,>({
  title,
  descending,
  reverseCallback,
  ...props
}: Props<T>) => {
  const { width, height } = useWindowDimensions();

  const contentHeight = useMemo(() => height - 121, [height]);

  const { bottom } = useSafeAreaInsets();

  const [isReversing, startReversing] = useTransition();

  return (
    <Animated.View entering={FadeIn} className={cn("flex-1")}>
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-4xl font-extrabold text-white/80">{title}</Text>
        <Button
          onPress={() => {
            startReversing(() => reverseCallback());
          }}
          variant="ghost"
          className="rounded-full w-28"
          iconLeft={
            !descending ? (
              <SortDesc className="text-zinc-200" size={18} />
            ) : (
              <SortAsc className="text-zinc-200" size={18} />
            )
          }
        >
          Order
        </Button>
      </View>
      <View
        style={{
          height: contentHeight,
        }}
      >
        <FlashList
          className={cn(
            `gap-2 flex-1 pt-2 opacity-100 overflow-hidden`,
            isReversing && "opacity-50"
          )}
          contentContainerStyle={{
            paddingBottom: bottom + 14,
          }}
          estimatedListSize={{
            height,
            width,
          }}
          showsVerticalScrollIndicator={false}
          disableAutoLayout
          drawDistance={contentHeight}
          removeClippedSubviews
          {...props}
        />
      </View>
    </Animated.View>
  );
};
