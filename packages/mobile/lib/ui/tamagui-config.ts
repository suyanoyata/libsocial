import { createFont, createTamagui } from "@tamagui/core"
import { defaultConfig } from "@tamagui/config/v4"

const systemFont = createFont({
  family: "SF-Regular",
  size: {},
  face: {
    300: { normal: "SF-Light" },
    500: { normal: "SF-Medium" },
    600: { normal: "SF-SemiBold" },
    700: { normal: "SF-Bold" },
    800: { normal: "SF-Heavy" },
  },
})

export const config = createTamagui({
  ...defaultConfig,
  fonts: {
    heading: systemFont,
    body: systemFont,
  },
})
