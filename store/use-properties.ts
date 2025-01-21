import { create } from "zustand";

interface ApplicationProperties {
  currentImageServerIndex: number;
  setCurrentImageServerIndex: (value: number) => void;
}

export const useProperties = create<ApplicationProperties>((set) => ({
  currentImageServerIndex: 0,
  setCurrentImageServerIndex: (currentImageServerIndex) =>
    set({ currentImageServerIndex }),
}));
