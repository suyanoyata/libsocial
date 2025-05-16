import { Icon } from "@/components/icon"
import { toast } from "sonner-native"

export const actionToast = (
  type: "watch" | "read",
  indexBiggerThanSaved: boolean,
  description: string,
  isFinished: boolean
) => {
  const ReadIcon = isFinished ? "EyeOff" : "Eye"

  if (type == "watch") {
    return toast.success(
      indexBiggerThanSaved
        ? "Bookmark changed"
        : isFinished
        ? "Marked as unwatched"
        : "Marked as watched",
      {
        styles: {
          description: {
            fontWeight: "500",
          },
        },
        description,
        icon: indexBiggerThanSaved ? (
          <Icon name="Bookmark" className="text-red-400" fill="text-red-400" />
        ) : (
          <Icon name={ReadIcon} className="text-zinc-400" strokeWidth={3} />
        ),
      }
    )
  }

  return toast.success(
    indexBiggerThanSaved
      ? "Bookmark changed"
      : isFinished
      ? "Marked as unread"
      : "Marked as read",
    {
      styles: {
        description: {
          fontWeight: "500",
        },
      },
      description,
      icon: indexBiggerThanSaved ? (
        <Icon name="Bookmark" fill="text-red-400" />
      ) : (
        <Icon name={ReadIcon} className="text-zinc-400" strokeWidth={3} />
      ),
    }
  )
}
