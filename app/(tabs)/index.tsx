import { ScrollView, Text, View } from "react-native";

import { Button } from "@/components/ui/button";

import { useHomeTitles } from "@/features/home/api/use-home-titles";
import { HomeLayout } from "@/layouts/home-layout";
import { PopularTitles } from "@/features/home/ui/popular-titles";
import { LastReadTitles } from "@/features/home/ui/last-read-titles";

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
      <LastReadTitles />
    </HomeLayout>
  );
}
