import { Route } from "@react-navigation/native"

import { Alert, View } from "react-native"

import { Header } from "@/components/ui/header"
import { Icon } from "@/components/icon"

import { useDownloads } from "@/features/downloads/store/use-downloads"
import { ClearDownloadedChapters } from "@/features/downloads/components/clear-downloaded-chapters"

type NativeStackHeaderProps = {
  options: {}
  route: Route<string>
}

export const DownloadsIcon = ({ ...props }: NativeStackHeaderProps) => {
  const items = useDownloads((state) => state.items)

  return (
    <View className="mt-safe">
      <Header
        showBackButton
        {...props}
        headerRight={<ClearDownloadedChapters />}
      />
    </View>
  )
}
