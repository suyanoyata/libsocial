import { Route } from "@react-navigation/native"

import { Alert, View } from "react-native"

import { Header } from "@/components/ui/header"
import { Icon } from "@/components/icon"

import { useDownloads } from "@/features/downloads/store/use-downloads"

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
        headerRight={
          <Icon
            disabled={items.length == 0}
            onPress={() => {
              Alert.alert(
                "Are you sure?",
                "You're about to delete all downloads",
                [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => useDownloads.getState().clear(),
                  },
                ]
              )
            }}
            hitSlop={10}
            name="Trash2"
            size={20}
            className="text-red-400 disabled:hidden"
          />
        }
      />
    </View>
  )
}
