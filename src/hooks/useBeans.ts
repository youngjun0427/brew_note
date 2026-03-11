import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../lib/firebase";
import { useAuthStore } from "../store/useAuthStore";
import { useBeanStore } from "../store/useBeanStore";
import type { Bean } from "../types";

export function useBeans() {
  const { user } = useAuthStore();
  const { beans, isLoading, initialized, error, setBeans, setLoading, setInitialized, setError, reset } = useBeanStore();

  useEffect(() => {
    if (!user) {
      reset();
      return;
    }
    if (initialized) return;

    setLoading(true);
    const q = query(collection(db, "users", user.uid, "beans"));
    getDocs(q)
      .then((snapshot) => {
        const sorted = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }) as Bean)
          .sort((a, b) => (b.purchasedAt?.seconds ?? 0) - (a.purchasedAt?.seconds ?? 0));
        setBeans(sorted);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
        setInitialized(true);
      });
  }, [user]);

  const addBean = (data: Omit<Bean, "id">) => {
    if (!user) return;
    return addDoc(collection(db, "users", user.uid, "beans"), data);
  };

  const updateBean = (id: string, data: Partial<Omit<Bean, "id">>) => {
    if (!user) return;
    return updateDoc(doc(db, "users", user.uid, "beans", id), data);
  };

  const deleteBean = (id: string) => {
    if (!user) return;
    return deleteDoc(doc(db, "users", user.uid, "beans", id));
  };

  return { beans, isLoading, error, addBean, updateBean, deleteBean };
}
