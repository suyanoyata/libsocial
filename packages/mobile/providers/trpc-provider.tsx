"use client"

import { queryClient } from "@/lib/trpc"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"

import { clientPersister } from "@/lib/persistent-query-storage"

export const TRPCQueryProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <PersistQueryClientProvider
      persistOptions={{ persister: clientPersister }}
      client={queryClient}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
