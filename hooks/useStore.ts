import { Chapter } from "@/features/chapters/ui/manga-chapters";
import { colors } from "@/constants/app.constants";
import { create } from "zustand";

type VideoServer = {
  id: string;
  label: string;
  url: string;
};

export type TitleColors = {
  primary: string;
  tabSelector: string;
  showMore: string;
};

export type ImageServer = {
  site_ids: number[];
  url: string;
  id: "main" | "secondary" | "compress";
  label: string;
};

interface StoreState {
  imageServers: ImageServer[];
  setImageServers: (servers: ImageServer[]) => void;
  videoServers: VideoServer[];
  setVideoServers: (servers: VideoServer[]) => void;
  imageServerIndex: number;
  setImageServerIndex: (index: number) => void;
}

export const store = create<StoreState>((set) => ({
  videoServers: [],
  setVideoServers: (videoServers: VideoServer[]) => set({ videoServers }),
  imageServers: [],
  setImageServers: (imageServers: ImageServer[]) => set({ imageServers }),
  imageServerIndex: 0,
  setImageServerIndex: (imageServerIndex: number) => set({ imageServerIndex }),
}));
