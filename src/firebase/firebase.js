import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_ZXz8A1rNCmmj2nugD9MRG1wAwiUJFTY",
  authDomain: "sacco-pulse.firebaseapp.com",
  projectId: "sacco-pulse",
  storageBucket: "sacco-pulse.firebasestorage.app",
  messagingSenderId: "423503826205",
  appId: "1:423503826205:web:56146120bcc2199f1525f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);