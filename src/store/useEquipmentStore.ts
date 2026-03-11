import { create } from "zustand";
import type { Equipment } from "../types";

interface EquipmentState {
  equipment: Equipment[];
  isLoading: boolean;
  initialized: boolean;
  error: string | null;
  setEquipment: (equipment: Equipment[]) => void;
  setLoading: (isLoading: boolean) => void;
  setInitialized: (v: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useEquipmentStore = create<EquipmentState>((set) => ({
  equipment: [],
  isLoading: false,
  initialized: false,
  error: null,
  setEquipment: (equipment) => set({ equipment }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (initialized) => set({ initialized }),
  setError: (error) => set({ error }),
  reset: () => set({ equipment: [], isLoading: false, initialized: false, error: null }),
}));
