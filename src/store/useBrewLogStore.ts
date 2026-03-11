import { create } from "zustand";
import type { BrewLog } from "../types";

interface BrewLogState {
  brewLogs: BrewLog[];
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  setBrewLogs: (brewLogs: BrewLog[]) => void;
  setLoading: (v: boolean) => void;
  setInitialized: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useBrewLogStore = create<BrewLogState>((set) => ({
  brewLogs: [],
  isLoading: false,
  initialized: false,
  error: null,
  setBrewLogs: (brewLogs) => set({ brewLogs }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setError: (error) => set({ error }),
  reset: () => set({ brewLogs: [], isLoading: false, initialized: false, error: null }),
}));
