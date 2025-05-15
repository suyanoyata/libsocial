import {
  Bookmark,
  Loader,
  LucideIcon,
  Play,
  Plus,
  Unplug,
} from "lucide-react-native"

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6"
import FeatherIcon from "react-native-vector-icons/Feather"

import { cssInterop } from "nativewind"
import { Icon } from "@/components/icon"
import { BottomSheetModal } from "@gorhom/bottom-sheet"

export function interopIcons(icons: LucideIcon[]) {
  return icons.map((icon) =>
    cssInterop(icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
          width: true,
          height: true,
        },
      },
    })
  )
}

export function interopSheet(icons: any[]) {
  icons.map((icon) =>
    cssInterop(icon, {
      backgroundClassName: {
        target: "backgroundStyle",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
      indicatorClassName: {
        target: "handleIndicatorStyle",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    })
  )
}

export const iconFix = () => {
  // interopIcons([
  //   Loader,
  //   Unplug,
  //   Plus,
  //   Play,
  //   Bookmark,
  //   FontAwesomeIcon as any,
  //   FeatherIcon as any,
  // ])
  interopSheet([BottomSheetModal])
}
