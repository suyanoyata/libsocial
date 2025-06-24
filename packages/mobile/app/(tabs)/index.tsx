import { LastReadTitles } from "@/features/home/ui/last-read-titles"
import { LastWatchTitles } from "@/features/home/ui/last-watch-titles"
import { PopularTitles } from "@/features/home/ui/popular-titles"
import { HomeLayout } from "@/layouts/home-layout"

export default function Home() {
  return (
    <HomeLayout>
      <PopularTitles />
      <LastWatchTitles />
      <LastReadTitles />
    </HomeLayout>
  )
}
