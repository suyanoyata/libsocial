import { User } from "better-auth";
import { db } from "~/lib/db";

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

  public async updateProfilePicture(
    email: User["email"],
    discordId: string,
    avatarId: string
  ) {
    if (avatarId == null) {
      return await db.user.update({
        where: { email },
        data: {
          image: null,
        },
      });
    }

    return await db.user.update({
      where: { email },
      data: {
        image: `https://cdn.discordapp.com/avatars/${discordId}/${avatarId}.png`,
      },
    });
  }
}

export const userService = new Service();
