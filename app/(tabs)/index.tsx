import { Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import { useHomeTitles } from "@/features/home/api/useHomeTitles";
import { HomeLayout } from "@/layouts/home-layout";
import { PopularTitles } from "@/features/home/ui/popular-titles";
import { Trash2 } from "lucide-react-native";

export default function Home() {
  const { isError } = useHomeTitles();

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Something went wrong</Text>
        <Button className="mt-2 font-medium">Try again</Button>
      </View>
    );
  }

  return (
    <HomeLayout>
      <PopularTitles />
      <View className="flex-row items-center justify-between mx-2 mt-3">
        <Text className="text-3xl font-extrabold text-white">You've stopped at</Text>
        <Button iconLeft={<Trash2 size={18} color="white" />} variant="destructive">
          Clear all
        </Button>
      </View>
    </HomeLayout>
  );
}
