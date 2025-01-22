import { cssInterop } from "nativewind";
import { Text } from "tamagui";

function interopComponent(component: any) {
  cssInterop(component, {
    className: {
      target: "style",
      nativeStyleToProp: {
        color: true,
        fontWeight: true,
        fontFamily: true,
        opacity: true,
      },
    },
  });
}

interopComponent(Text);

export { Text as TamaguiText };
