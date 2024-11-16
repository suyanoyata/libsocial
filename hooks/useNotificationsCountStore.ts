import { create } from "zustand";

interface StoreState {
  notificationsCount: number | undefined;
  setNotificationsCount: (c: number) => void;
}

export const useNotificationsCountStore = create<StoreState>((set) => ({
  notificationsCount: undefined,
  setNotificationsCount: (c: number) => set({ notificationsCount: c }),
}));
