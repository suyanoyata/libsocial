import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ApplicationProperties {
  currentImageServerIndex: number;
  readerImagePadding: number;
  readerDisplayCurrentPage: boolean;
  showQueryDevTools: boolean;
  setCurrentImageServerIndex: (value: number) => void;
  setReaderImagePadding: (value: number) => void;
  setReaderDisplayCurrentPage: (value: boolean) => void;
  setShowQueryDevTools: (value: boolean) => void;
}

export const useProperties = create<ApplicationProperties>()(
  persist(
    (set) => ({
      currentImageServerIndex: 0,
      readerImagePadding: 0,
      readerDisplayCurrentPage: false,
      showQueryDevTools: true,
      setReaderImagePadding: (readerImagePadding) => set({ readerImagePadding }),
      setCurrentImageServerIndex: (currentImageServerIndex) =>
        set({ currentImageServerIndex }),
      setReaderDisplayCurrentPage: (readerDisplayCurrentPage) =>
        set({ readerDisplayCurrentPage }),
      setShowQueryDevTools: (showQueryDevTools) => set({ showQueryDevTools }),
    }),
    {
      name: "libsocial.client.properties",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
