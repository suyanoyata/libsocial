import { HomeLayout } from "@/layouts/home-layout"

import { PopularTitles } from "@/features/home/ui/popular-titles"
import { LastReadTitles } from "@/features/home/ui/last-read-titles"
import { LastWatchTitles } from "@/features/home/ui/last-watch-titles"

import { useQuery, useQueryClient } from "@tanstack/react-query"

import { useEffect } from "react"
import { api } from "@/lib/axios"
import { Text } from "@/components/ui/text"
import { View } from "react-native"

export default function Home() {
  const client = useQueryClient()

  useEffect(() => {
    client.prefetchQuery({
      queryKey: ["home-titles"],
    })
  }, [])

  const { data } = useQuery({
    queryKey: ["api"],
    queryFn: async () => {
      const { data } = await api.get("/")

      return data
    },
  })

  return (
    <View>
      <Text className="text-primary">{JSON.stringify(data, null, 2)}</Text>
    </View>
  )

  return (
    <HomeLayout>
      <PopularTitles />
      <LastWatchTitles />
      <LastReadTitles />
    </HomeLayout>
  )
}
