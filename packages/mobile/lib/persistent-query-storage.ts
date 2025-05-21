import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister"

import { mmkv } from "@/lib/storage"

const clientStorage = {
  setItem: (key: string, value: string) => {
    mmkv.set(key, value)
  },
  getItem: (key: string) => {
    const value = mmkv.getString(key)
    return value === undefined ? null : value
  },
  removeItem: (key: string) => {
    mmkv.delete(key)
  },
}

export const clientPersister = createSyncStoragePersister({
  storage: clientStorage,
  key: "libsocial.client.cache",
})
