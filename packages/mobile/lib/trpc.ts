import type { AppRouter } from "api/lib/trpc"

import { QueryClient } from "@tanstack/react-query"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { t } from "@/lib/trpc/trpc-client"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 5,
      retry: 1,
      gcTime: Infinity,
    },
  },
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: t,
  queryClient,
})
