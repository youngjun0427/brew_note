import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../lib/firebase";

export function useGoogleSignIn() {
  const signIn = () => {
    signInWithPopup(auth, new GoogleAuthProvider());
  };
  return { signIn };
}
