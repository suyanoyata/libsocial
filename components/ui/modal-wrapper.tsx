import { Link } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { View, Text, ScrollView } from "react-native";

export const ModalWrapper = ({
  children,
  scrollable = false,
}: {
  children?: React.ReactNode;
  scrollable?: boolean;
}) => {
  const Comp = scrollable ? ScrollView : View;
  return (
    <Comp showsVerticalScrollIndicator={false} className="flex-1 mt-3 mx-2 bg-black">
      <Link href="../" style={{ zIndex: 999 }}>
        <View className="flex-row gap-1 items-center">
          <ChevronLeft color="#d4d4d8" strokeWidth={2.25} />
          <Text className="text-zinc-300 text-lg font-medium">Back</Text>
        </View>
      </Link>
      {children}
    </Comp>
  );
};
