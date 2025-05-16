import { getCookie } from "@/lib/auth"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import SuperJSON from "superjson"
import type { AppRouter } from "api/lib/trpc"
import { useProperties } from "@/store/use-properties"

export const t = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      transformer: SuperJSON,
      url: "https://libsocial-api.vercel.app/api/trpc",
      headers() {
        return {
          siteId: useProperties.getState().siteId,
          cookie: getCookie(),
        }
      },
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        })
      },
    }),
  ],
})
