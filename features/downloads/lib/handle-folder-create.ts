import { throwable } from "@/lib/utils"
import * as FileSystem from "expo-file-system"

export const handleFolderCreate = async (
  slug_url: string,
  folderName: string,
  chapterPagesLength: number,
) => {
  const { error: slugFolderFails } = await throwable(
    FileSystem.readDirectoryAsync(`${FileSystem.documentDirectory}${slug_url}`),
  )

  if (slugFolderFails) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}${slug_url}`,
    )
  }

  const { data, error: chapterFolderFails } = await throwable(
    FileSystem.readDirectoryAsync(
      `${FileSystem.documentDirectory}${slug_url}/${folderName}`,
    ),
  )

  if (data?.length == chapterPagesLength) {
    return "exists"
  }

  if (chapterFolderFails) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}${slug_url}/${folderName}`,
    )
  }

  return "created"
}
