import { create } from "zustand";

interface StoreState {
  notificationsCount: number | undefined;
  setNotificationsCount: (c: number | undefined) => void;
}

export const useNotificationsCountStore = create<StoreState>((set) => ({
  notificationsCount: undefined,
  setNotificationsCount: (c) => set({ notificationsCount: c }),
}));
