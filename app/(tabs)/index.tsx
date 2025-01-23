import { useHomeTitles } from "@/features/home/api/use-home-titles";
import { HomeLayout } from "@/layouts/home-layout";
import { PopularTitles } from "@/features/home/ui/popular-titles";
import { LastReadTitles } from "@/features/home/ui/last-read-titles";

export default function Home() {
  useHomeTitles();

  return (
    <HomeLayout>
      <PopularTitles />
      <LastReadTitles />
    </HomeLayout>
  );
}
