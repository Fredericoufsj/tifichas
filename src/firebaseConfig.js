// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDvDl2uezImBuCiqhZdjafhj3tFKLavG-M",
    authDomain: "flashcards-projeto.firebaseapp.com",
    projectId: "flashcards-projeto",
    storageBucket: "flashcards-projeto.firebasestorage.app",
    messagingSenderId: "485348311072",
    appId: "1:485348311072:web:c102ddb5a71af62416bc45"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
