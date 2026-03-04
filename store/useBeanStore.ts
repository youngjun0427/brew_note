import { create } from "zustand";
import type { Bean } from "../types";

interface BeanState {
  beans: Bean[];
  setBeans: (beans: Bean[]) => void;
}

export const useBeanStore = create<BeanState>((set) => ({
  beans: [],
  setBeans: (beans) => set({ beans }),
}));
