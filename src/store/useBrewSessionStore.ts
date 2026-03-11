import { create } from "zustand";
import type { Bean, Recipe } from "../types";

interface BrewSessionState {
  selectedRecipe: Recipe | null;
  selectedBean: Bean | null;
  usedCoffeeWeight: number;
  totalElapsed: number;
  setSelectedRecipe: (recipe: Recipe | null) => void;
  setSelectedBean: (bean: Bean | null) => void;
  setUsedCoffeeWeight: (weight: number) => void;
  setTotalElapsed: (elapsed: number) => void;
  reset: () => void;
}

export const useBrewSessionStore = create<BrewSessionState>((set) => ({
  selectedRecipe: null,
  selectedBean: null,
  usedCoffeeWeight: 0,
  totalElapsed: 0,
  setSelectedRecipe: (recipe) => set({ selectedRecipe: recipe }),
  setSelectedBean: (bean) => set({ selectedBean: bean }),
  setUsedCoffeeWeight: (weight) => set({ usedCoffeeWeight: weight }),
  setTotalElapsed: (elapsed) => set({ totalElapsed: elapsed }),
  reset: () =>
    set({ selectedRecipe: null, selectedBean: null, usedCoffeeWeight: 0, totalElapsed: 0 }),
}));
