import { create } from "zustand";
import { TitleColors } from "./useStore";
import { colors } from "@/constants/app.constants";

interface Store {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

type Settings = {
  appTheme: TitleColors;
  connectionType: string;
};

export const app = create<Store>((set) => ({
  settings: {
    appTheme: colors[0],
    connectionType: "",
  },
  setSettings: (settings) => set({ settings }),
}));
