import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ApplicationProperties {
  siteId: string;
  setSiteId: (value: string) => void;
  showReaderScrollbar: boolean;
  readerImagePadding: number;
  readerDisplayCurrentPage: boolean;
  showQueryDevTools: boolean;
  catalogColumns: number;
  catalogImageWidth: number;
  setCatalogImageWidth: (value: number) => void;
  setShowReaderScrollbar: (value: boolean) => void;
  setReaderImagePadding: (value: number) => void;
  setReaderDisplayCurrentPage: (value: boolean) => void;
  setShowQueryDevTools: (value: boolean) => void;
  setCatalogColumns: (value: number) => void;
}

export const useProperties = create<ApplicationProperties>()(
  persist(
    (set) => ({
      siteId: "1",
      setSiteId: (siteId) => set({ siteId }),
      showReaderScrollbar: false,
      readerImagePadding: 0,
      readerDisplayCurrentPage: false,
      showQueryDevTools: true,
      catalogImageWidth: 0,
      setCatalogImageWidth: (catalogImageWidth) => set({ catalogImageWidth }),
      catalogColumns: 3,
      setShowReaderScrollbar: (showReaderScrollbar) => set({ showReaderScrollbar }),
      setReaderImagePadding: (readerImagePadding) => set({ readerImagePadding }),
      setReaderDisplayCurrentPage: (readerDisplayCurrentPage) => set({ readerDisplayCurrentPage }),
      setShowQueryDevTools: (showQueryDevTools) => set({ showQueryDevTools }),
      setCatalogColumns: (catalogColumns) => set({ catalogColumns }),
    }),
    {
      name: "libsocial.client.properties",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
