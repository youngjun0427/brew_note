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
import { useBeanStore } from "../store/useBeanStore";
import type { Bean } from "../types";

export function useBeans() {
  const { user } = useAuthStore();
  const { beans, setBeans } = useBeanStore();

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "users", user.uid, "beans"),
      orderBy("purchasedAt", "desc")
    );
    return onSnapshot(q, (snapshot) => {
      setBeans(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Bean));
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

  return { beans, addBean, updateBean, deleteBean };
}
