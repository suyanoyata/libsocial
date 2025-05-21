"use client"

import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"

import { clientPersister } from "@/lib/persistent-query-storage"
import { queryClient } from "@/lib/query-client"

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
