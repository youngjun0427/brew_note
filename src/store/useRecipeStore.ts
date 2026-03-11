import { create } from "zustand";
import type { Recipe } from "../types";

interface RecipeState {
  recipes: Recipe[];
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  setRecipes: (recipes: Recipe[]) => void;
  setLoading: (v: boolean) => void;
  setInitialized: (v: boolean) => void;
  setError: (e: string | null) => void;
  reset: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  isLoading: false,
  initialized: false,
  error: null,
  setRecipes: (recipes) => set({ recipes }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setError: (error) => set({ error }),
  reset: () => set({ recipes: [], isLoading: false, initialized: false, error: null }),
}));
