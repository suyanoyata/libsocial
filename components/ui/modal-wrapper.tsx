import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View, ScrollView } from "react-native";
import { Text } from "@/components/ui/text";

export const ModalWrapper = ({
  children,
  scrollable = false,
}: {
  children?: React.ReactNode;
  scrollable?: boolean;
}) => {
  const Comp = scrollable ? ScrollView : View;
  return (
    <Comp showsVerticalScrollIndicator={false} className="flex-1 pt-3 bg-black">
      <Link href="../" style={{ zIndex: 20 }} className="mx-2">
        <View className="flex-row gap-1 items-center z-10">
          <ChevronLeft color="#d4d4d8" strokeWidth={2.25} />
          <Text className="text-zinc-300 text-lg font-medium">Back</Text>
        </View>
      </Link>
      {children}
    </Comp>
  );
};
