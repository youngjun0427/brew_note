import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import { useBrewLogStore } from "../store/useBrewLogStore";
import type { BrewLog } from "../types";

export function useBrewLogs() {
  const { user } = useAuthStore();
  const { brewLogs, isLoading, initialized, error, setBrewLogs, setLoading, setInitialized, setError, reset } = useBrewLogStore();

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }
    if (initialized) return;

    setLoading(true);
    const q = query(collection(db, "users", user.uid, "brewLogs"));
    getDocs(q)
      .then((snapshot) => {
        const sorted = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }) as BrewLog)
          .sort((a, b) => (b.brewedAt?.seconds ?? 0) - (a.brewedAt?.seconds ?? 0));
        setBrewLogs(sorted);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [user]);

  const addBrewLog = (data: Omit<BrewLog, "id" | "brewedAt">) => {
    if (!user) return;
    return addDoc(collection(db, "users", user.uid, "brewLogs"), {
      ...data,
      brewedAt: serverTimestamp(),
    });
  };

  const updateBrewLog = (id: string, data: Partial<Omit<BrewLog, "id" | "brewedAt">>) => {
    if (!user) return;
    return updateDoc(doc(db, "users", user.uid, "brewLogs", id), data);
  };

  const deleteBrewLog = (id: string) => {
    if (!user) return;
    return deleteDoc(doc(db, "users", user.uid, "brewLogs", id));
  };

  return { brewLogs, isLoading, error, addBrewLog, updateBrewLog, deleteBrewLog };
}
