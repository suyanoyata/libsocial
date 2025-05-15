import { cssInterop } from "nativewind"

export function withIconCss(icon: any) {
  return cssInterop(icon, {
    fill: {
      target: "fill",
      nativeStyleToProp: {
        color: "fill",
      },
    },
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        opacity: true,
        width: true,
        height: true,
        fontSize: true,
        fontWeight: true,
      },
    },
  })
}
