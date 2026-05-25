import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2_E93lvSpO4rVo6n8BercQ8_MCjtPtYk",
  authDomain: "cotizador-flexo-troqueladas.firebaseapp.com",
  projectId: "cotizador-flexo-troqueladas",
  storageBucket: "cotizador-flexo-troqueladas.firebasestorage.app",
  messagingSenderId: "701121746339",
  appId: "1:701121746339:web:1ba5dd6138e3b3e19f3616",
  measurementId: "G-N7XHW9W6TV"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
