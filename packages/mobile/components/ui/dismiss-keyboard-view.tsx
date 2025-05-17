import React from "react"
import { TouchableWithoutFeedback, Keyboard, View } from "react-native"

import type { ComponentType, ReactNode } from "react"
import type { ViewProps } from "react-native"

interface DismissKeyboardHOCProps extends ViewProps {
  children?: ReactNode
}

const DismissKeyboardHOC = <P extends object>(Comp: ComponentType<P>) => {
  return ({ children, ...props }: DismissKeyboardHOCProps & P) => (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <Comp {...(props as P)}>{children}</Comp>
    </TouchableWithoutFeedback>
  )
}

export const DismissKeyboardView = DismissKeyboardHOC(View)
