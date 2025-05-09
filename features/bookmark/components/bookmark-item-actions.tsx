import ContextMenu from "react-native-context-menu-view"

interface BookmarkItemActionsProps {
  children?: React.ReactNode
  onEdit?: () => void
  onDelete?: () => void
}

export const BookmarkItemActions = ({
  children,
  onEdit,
  onDelete,
}: BookmarkItemActionsProps) => {
  return (
    <ContextMenu
      disableShadow
      dropdownMenuMode
      onPress={(value) => {
        if (value.nativeEvent.index === 0) {
          onEdit?.()
        } else {
          onDelete?.()
        }
      }}
      className="z-20"
      actions={[
        {
          title: "Edit",
          systemIcon: "pencil",
        },
        {
          title: "Delete",
          systemIcon: "trash",
          destructive: true,
        },
      ]}
    >
      {children}
    </ContextMenu>
  )
}
