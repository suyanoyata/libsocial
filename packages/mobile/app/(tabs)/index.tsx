import { HomeLayout } from "@/layouts/home-layout"

import { PopularTitles } from "@/features/home/ui/popular-titles"
import { LastReadTitles } from "@/features/home/ui/last-read-titles"
import { LastWatchTitles } from "@/features/home/ui/last-watch-titles"

import { useQueryClient } from "@tanstack/react-query"

import { useEffect } from "react"

export default function Home() {
  const client = useQueryClient()

  useEffect(() => {
    client.prefetchQuery({
      queryKey: ["home-titles"],
    })
  }, [])

  return (
    <HomeLayout>
      <PopularTitles />
      <LastWatchTitles />
      <LastReadTitles />
    </HomeLayout>
  )
}
