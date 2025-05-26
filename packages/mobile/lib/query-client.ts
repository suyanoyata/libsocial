import { QueryClient } from "@tanstack/react-query"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 30,
      refetchOnMount: true,
      refetchInterval: 1000 * 60 * 15,
      retry: 1,
      gcTime: 1000 * 60 * 10,
      structuralSharing: false,
      notifyOnChangeProps: "all",
    },
  },
})
