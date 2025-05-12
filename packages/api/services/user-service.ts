import { User } from "better-auth";
import { db } from "lib/db";

class Service {
  public async mergeBookmarks(oldUserId: User["id"], newUserId: User["id"]) {
    console.log(`Transerring bookmarks: ${oldUserId} -> ${newUserId}`);

    await db.bookmark.updateMany({
      where: { userId: oldUserId },
      data: { userId: newUserId },
    });

    await db.user.delete({
      where: { id: oldUserId },
    });
  }
}

export const userService = new Service();
