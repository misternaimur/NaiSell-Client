import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authClient } from "./auth-client";

const firebaseConfig = {
  apiKey: "AIzaSyC7-fLW6gudbCalHM2RKQtftfst3OoetHE",
  authDomain: "naisell-da296.firebaseapp.com",
  projectId: "naisell-da296",
  storageBucket: "naisell-da296.firebasestorage.app",
  messagingSenderId: "622967118512",
  appId: "1:622967118512:web:4e0c1e869200cbc7dc3975",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  // Step 1: Firebase popup to get the Google user's email/name/photo
  const result = await signInWithPopup(auth, googleProvider);
  const { email, displayName, photoURL } = result.user;

  // Step 2: Create/update user in our DB and get the deterministic password
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name: displayName, image: photoURL }),
  });

  const data = await res.json();

  if (!data.success || !data.password) {
    return { success: false, error: data.error || "Failed to prepare account" };
  }

  // Step 3: Sign in via Better-Auth using email+password to get a proper session cookie
  return new Promise((resolve) => {
    authClient.signIn.email(
      { email, password: data.password },
      {
        onSuccess: () => {
          resolve({ success: true, role: data.role });
        },
        onError: (ctx) => {
          resolve({ success: false, error: ctx.error?.message || "Sign-in failed" });
        },
      }
    );
  });
}
