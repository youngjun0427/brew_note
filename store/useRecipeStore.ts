import { create } from "zustand";
import type { Recipe } from "../types";

interface RecipeState {
  recipes: Recipe[];
  setRecipes: (recipes: Recipe[]) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: [],
  setRecipes: (recipes) => set({ recipes }),
}));
