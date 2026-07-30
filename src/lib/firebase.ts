import { getApp, getApps, initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyDn_C0B1RpoU03iI5SZSI1qC10kZWWlNFo",
  authDomain: "phrasal-marker-365812.firebaseapp.com",
  projectId: "phrasal-marker-365812",
  storageBucket: "phrasal-marker-365812.firebasestorage.app",
  messagingSenderId: "2544230303",
  appId: "1:2544230303:web:f6f45f628db48d23a6a7aa",
} as const;

// Reuse the initialized instance during Vite hot reloads.
export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
