import { Button, ButtonProps } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet"

import * as React from "react"
import { Pressable } from "react-native"

interface SheetConfig {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const SheetContext = React.createContext<SheetConfig | null>(null)

const useSheetContext = (): SheetConfig => {
  const context = React.useContext(SheetContext)

  if (!context) {
    throw new Error("useSheetContext must be used within a SheetProvider")
  }

  return context
}

const Sheet = ({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean
  onOpenChange?: (value: boolean) => void
  children: React.ReactNode
}) => {
  const [_open, _setOpen] = React.useState(false)

  return (
    <SheetContext.Provider
      value={{
        open: open ?? _open,
        onOpenChange: (open: boolean) => {
          if (onOpenChange) {
            onOpenChange(open)
          } else {
            _setOpen(open)
          }
        },
      }}
    >
      {children}
    </SheetContext.Provider>
  )
}

const SheetTrigger = ({ asChild, children, ...props }: ButtonProps) => {
  const { onOpenChange } = useSheetContext()

  const Comp = asChild ? Pressable : Button

  return (
    <Comp onPress={() => onOpenChange(true)} {...props}>
      {children}
    </Comp>
  )
}

const SheetContent = ({
  scrollable = false,
  maxHeight = "80%",
  asChild,
  className,
  children,
}: {
  scrollable?: boolean
  maxHeight?: string
  asChild?: boolean
  className?: string
  children?: React.ReactNode
}) => {
  const { open, onOpenChange } = useSheetContext()

  const Comp = scrollable ? BottomSheetScrollView : BottomSheetView

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null)

  React.useEffect(() => {
    if (open) {
      bottomSheetModalRef.current?.present()
    } else {
      bottomSheetModalRef.current?.dismiss()
    }
  }, [open])

  return (
    <BottomSheetModal
      onDismiss={() => onOpenChange(false)}
      snapPoints={scrollable ? [maxHeight] : undefined}
      enableDynamicSizing={!scrollable}
      // @ts-ignore
      backgroundClassName="bg-primary"
      indicatorClassName="bg-muted"
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          onPress={() => onOpenChange(false)}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior="close"
        />
      )}
      ref={bottomSheetModalRef}
    >
      <Comp className={cn(!asChild && "flex-1 p-2 px-4 z-30", className)}>
        {children}
      </Comp>
    </BottomSheetModal>
  )
}

const SheetTitle = ({
  children,
  className,
}: {
  children?: React.ReactNode
  className?: string
}) => {
  return (
    <Text className={cn("text-4xl font-extrabold text-primary", className)}>
      {children}
    </Text>
  )
}

export { Sheet, SheetTrigger, SheetContent, SheetTitle, useSheetContext }
