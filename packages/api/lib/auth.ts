import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaClient } from "~/lib/prisma";

import { anonymous } from "better-auth/plugins";
import { expo } from "@better-auth/expo";
import { userService } from "~/services/user-service";

import axios from "axios";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    discord: {
      async getUserInfo(token) {
        const { data } = await axios.get("https://discord.com/api/users/@me", {
          headers: {
            Authorization: `${token.tokenType} ${token.accessToken}`,
          },
        });

        await userService.updateProfilePicture(
          data.email,
          data.id,
          data.avatar
        );

        return { user: { ...data }, data };
      },
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
  plugins: [
    anonymous({
      emailDomainName: "libsocial.com",
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.log(
          `Linking from ${anonymousUser.user.id} -> ${newUser.user.id}`
        );
        return await userService.mergeBookmarks(
          anonymousUser.user.id,
          newUser.user.id
        );
      },
    }),
    expo(),
  ],
  appName: "libsocial",
  trustedOrigins: [process.env.BETTER_AUTH_URL!, "libsocial://"],
});
