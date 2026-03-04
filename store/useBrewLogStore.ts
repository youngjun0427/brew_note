import { create } from "zustand";
import type { BrewLog } from "../types";

interface BrewLogState {
  brewLogs: BrewLog[];
  setBrewLogs: (brewLogs: BrewLog[]) => void;
}

export const useBrewLogStore = create<BrewLogState>((set) => ({
  brewLogs: [],
  setBrewLogs: (brewLogs) => set({ brewLogs }),
}));
