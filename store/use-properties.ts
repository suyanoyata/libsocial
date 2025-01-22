import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ApplicationProperties {
  currentImageServerIndex: number;
  readerImagePadding: number;
  setReaderImagePadding: (value: number) => void;
  setCurrentImageServerIndex: (value: number) => void;
}

export const useProperties = create<ApplicationProperties>()(
  persist(
    (set) => ({
      currentImageServerIndex: 0,
      readerImagePadding: 0,
      setReaderImagePadding: (readerImagePadding) => set({ readerImagePadding }),
      setCurrentImageServerIndex: (currentImageServerIndex) =>
        set({ currentImageServerIndex }),
    }),
    {
      name: "libsocial.client.properties",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
