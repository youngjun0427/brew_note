import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import { useRecipeStore } from "../store/useRecipeStore";
import type { Recipe } from "../types";

export function useRecipes() {
  const { user } = useAuthStore();
  const { recipes, setRecipes } = useRecipeStore();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "recipes"),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setRecipes(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Recipe));
    });
  }, [user]);

  const addRecipe = (data: Omit<Recipe, "id" | "createdAt">) => {
    if (!user) return;
    return addDoc(collection(db, "users", user.uid, "recipes"), {
      ...data,
      createdAt: serverTimestamp(),
    });
  };

  const updateRecipe = (id: string, data: Partial<Omit<Recipe, "id" | "createdAt">>) => {
    if (!user) return;
    return updateDoc(doc(db, "users", user.uid, "recipes", id), data);
  };

  const deleteRecipe = (id: string) => {
    if (!user) return;
    return deleteDoc(doc(db, "users", user.uid, "recipes", id));
  };

  return { recipes, addRecipe, updateRecipe, deleteRecipe };
}
