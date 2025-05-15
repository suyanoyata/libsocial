import { cssInterop } from "nativewind"

export function withIconCss(icon: any) {
  return cssInterop(icon, {
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
}
