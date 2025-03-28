import { Bookmark, EyeIcon, EyeOff } from "lucide-react-native";
import { toast } from "sonner-native";

export const actionToast = (
  type: "watch" | "read",
  indexBiggerThanSaved: boolean,
  description: string,
  isFinished: boolean
) => {
  const ReadIcon = isFinished ? EyeOff : EyeIcon;

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
          <Bookmark className="text-red-400 fill-red-400" />
        ) : (
          <ReadIcon className="text-zinc-400" strokeWidth={3} />
        ),
      }
    );
  }

  return toast.success(
    indexBiggerThanSaved ? "Bookmark changed" : isFinished ? "Marked as unread" : "Marked as read",
    {
      styles: {
        description: {
          fontWeight: "500",
        },
      },
      description,
      icon: indexBiggerThanSaved ? (
        <Bookmark className="text-red-400 fill-red-400" />
      ) : (
        <ReadIcon className="text-zinc-400" strokeWidth={3} />
      ),
    }
  );
};
