import { Chapter } from "@/features/shared/types/chapter"
import { BaseTitle } from "@/features/shared/types/title"

export type Bookmark = {
  id: number
  mark: string
  type: "anime" | "manga"
  addedAt: Date
  media: BaseTitle
  last_seen: Chapter | null
}
