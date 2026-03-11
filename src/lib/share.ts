import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import type { Recipe } from "../types";
import { db } from "./firebase";

export async function shareRecipe(recipe: Recipe, authorUid: string): Promise<string> {
  const shareRef = doc(collection(db, "publicRecipes"));
  const batch = writeBatch(db);

  batch.set(shareRef, {
    shareId: shareRef.id,
    recipeData: recipe,
    authorUid,
    createdAt: serverTimestamp(),
  });
  batch.update(doc(db, "users", authorUid, "recipes", recipe.id), {
    isPublic: true,
    shareId: shareRef.id,
  });

  await batch.commit();
  return shareRef.id;
}
