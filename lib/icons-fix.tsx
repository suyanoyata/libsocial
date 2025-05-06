import { Loader, LucideIcon, Unplug } from "lucide-react-native";

import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import FeatherIcon from "react-native-vector-icons/Feather";

import { cssInterop } from "nativewind";
import { Icon } from "@/components/icon";

export function interopIcons(icons: LucideIcon[]) {
  icons.map((icon) =>
    cssInterop(icon, {
      className: {
        target: "style",
        nativeStyleToProp: {
          color: true,
          opacity: true,
        },
      },
    })
  );
}

export const iconFix = () =>
  interopIcons([Icon, Loader, Unplug, FontAwesomeIcon as any, FeatherIcon as any]);
