// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Valores padrão para desenvolvimento local
const defaultConfig = {
  apiKey: "AIzaSyCIxcuiAS8SDsvyvOTKpCWPRqVeZOeReZ0",
  authDomain: "gestao2025-a1990.firebaseapp.com",
  projectId: "gestao2025-a1990",
  storageBucket: "gestao2025-a1990.appspot.com",
  messagingSenderId: "82754378633",
  appId: "1:82754378633:web:cd2592340b7c82908f1f58"
};

// Obtém as variáveis de ambiente ou usa os valores padrão
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || defaultConfig.appId
};

// Log para verificação em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  console.log('Firebase config:', {
    apiKey: firebaseConfig.apiKey ? '**********' : 'ausente',
    authDomain: firebaseConfig.authDomain ? 'disponível' : 'ausente',
    projectId: firebaseConfig.projectId ? 'disponível' : 'ausente',
    storageBucket: firebaseConfig.storageBucket ? 'disponível' : 'ausente',
    messagingSenderId: firebaseConfig.messagingSenderId ? 'disponível' : 'ausente',
    appId: firebaseConfig.appId ? 'disponível' : 'ausente'
  });
  
  // Aviso sobre variáveis de ambiente
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    console.warn(
      'Variáveis de ambiente não detectadas. Usando configuração padrão. ' +
      'Para desenvolvimento local, crie um arquivo .env.local na raiz do projeto.'
    );
  }
}

// Verifica se já existe uma instância do Firebase
let app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

// Inicializa e exporta os serviços do Firebase
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app; 