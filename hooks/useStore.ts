import { Chapter } from "@/components/manga-chapters";
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
  label: string;
};

interface StoreState {
  currentTitleSlug: string;
  setCurrentTitleSlug: (s: string) => void;
  chapters: Chapter[];
  setChapters: (c: Chapter[]) => void;
  chaptersCount: number;
  setChaptersCount: (n: number) => void;
  ready: boolean;
  setReady: (b: boolean) => void;
  imageServers: ImageServer[];
  setImageServers: (servers: ImageServer[]) => void;
  videoServers: VideoServer[];
  setVideoServers: (servers: VideoServer[]) => void;
  imageServerIndex: number;
  setImageServerIndex: (index: number) => void;
}

export const store = create<StoreState>((set) => ({
  currentTitleSlug: "",
  setCurrentTitleSlug: (currentTitleSlug: string) => set({ currentTitleSlug }),
  chaptersCount: 0,
  setChaptersCount: (chaptersCount: number) => set({ chaptersCount }),
  ready: false,
  setReady: (ready: boolean) => set({ ready }),
  chapters: [],
  setChapters: (chapters: Chapter[]) => ({ chapters }),
  videoServers: [],
  setVideoServers: (videoServers: VideoServer[]) => set({ videoServers }),
  imageServers: [],
  setImageServers: (imageServers: ImageServer[]) => set({ imageServers }),
  imageServerIndex: 0,
  setImageServerIndex: (imageServerIndex: number) => set({ imageServerIndex }),
}));
