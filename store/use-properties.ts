import { zustandStorage } from "@/lib/persistent-zustand-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface ApplicationProperties {
  currentImageServerIndex: number;
  setCurrentImageServerIndex: (value: number) => void;
}

export const useProperties = create<ApplicationProperties>()(
  persist(
    (set) => ({
      currentImageServerIndex: 0,
      setCurrentImageServerIndex: (currentImageServerIndex: number) =>
        set({ currentImageServerIndex }),
    }),
    {
      name: "libsocial.client.properties",
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
