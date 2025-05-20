import { createAuthClient } from "better-auth/react"
import { anonymousClient } from "better-auth/client/plugins"
import { expoClient } from "@better-auth/expo/client"

import * as SecureStore from "expo-secure-store"

export const {
  useSession,
  signIn,
  signUp,
  signOut,
  linkSocial,
  getCookie,
  ...authClient
} = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  scheme: "libsocial",
  plugins: [
    anonymousClient(),
    expoClient({
      scheme: "libsocial",
      storagePrefix: "libsocial",
      storage: SecureStore,
    }),
  ],
})
