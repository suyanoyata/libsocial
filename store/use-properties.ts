import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type AllowedSiteIds = "1" | "5";

export interface ApplicationProperties {
  siteId: AllowedSiteIds;
  setSiteId: (value: AllowedSiteIds) => void;
  showReaderScrollbar: boolean;
  currentImageServerIndex: number;
  readerImagePadding: number;
  readerDisplayCurrentPage: boolean;
  showQueryDevTools: boolean;
  catalogColumns: number;
  catalogImageWidth: number;
  setCatalogImageWidth: (value: number) => void;
  setShowReaderScrollbar: (value: boolean) => void;
  setCurrentImageServerIndex: (value: number) => void;
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
      currentImageServerIndex: 0,
      readerImagePadding: 0,
      readerDisplayCurrentPage: false,
      showQueryDevTools: true,
      catalogImageWidth: 0,
      setCatalogImageWidth: (catalogImageWidth) => set({ catalogImageWidth }),
      catalogColumns: 3,
      setShowReaderScrollbar: (showReaderScrollbar) => set({ showReaderScrollbar }),
      setReaderImagePadding: (readerImagePadding) => set({ readerImagePadding }),
      setCurrentImageServerIndex: (currentImageServerIndex) => set({ currentImageServerIndex }),
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
