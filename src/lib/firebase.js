import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  // Create/update user in Better-Auth via API
  const res = await fetch("/api/auth/google", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: user.email,
      name: user.displayName,
      image: user.photoURL,
    }),
  });

  return res.json();
}
