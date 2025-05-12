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
  baseURL: "http://192.168.50.48:3000",
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
