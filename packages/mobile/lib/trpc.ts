import type { AppRouter } from "api/lib/trpc"

import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { t } from "@/lib/trpc/trpc-client"
import { queryClient } from "@/lib/query-client"

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: t,
  queryClient,
})