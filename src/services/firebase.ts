import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

  const firebaseConfig = {
    apiKey: "AIzaSyBakaUFoLdV-Z2SRFZfN4KtrxTBDVBiuNA",
    authDomain: "lista-cha-d2711.firebaseapp.com",
    projectId: "lista-cha-d2711",
    storageBucket: "lista-cha-d2711.firebasestorage.app",
    messagingSenderId: "785457124010",
    appId: "1:785457124010:web:c9e5f3118079315803b6d3",
    measurementId: "G-ZE8SGGSFF7"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);