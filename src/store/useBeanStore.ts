import { create } from "zustand";
import type { Bean } from "../types";

interface BeanState {
  beans: Bean[];
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  setBeans: (beans: Bean[]) => void;
  setLoading: (v: boolean) => void;
  setInitialized: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useBeanStore = create<BeanState>((set) => ({
  beans: [],
  isLoading: false,
  initialized: false,
  error: null,
  setBeans: (beans) => set({ beans }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setError: (error) => set({ error }),
  reset: () => set({ beans: [], isLoading: false, initialized: false, error: null }),
}));
