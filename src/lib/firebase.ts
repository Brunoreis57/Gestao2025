// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Substitua com suas credenciais reais do Firebase
// Você precisa criar um projeto no Firebase Console e obter estas credenciais
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKeyForNowReplaceThis",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "gestao2025.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "gestao2025",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "gestao2025.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789012:web:abcdef1234567890",
};

// Inicializa o Firebase apenas uma vez
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Inicializa e exporta os serviços do Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app; 