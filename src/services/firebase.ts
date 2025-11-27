import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAfcDPP3SJm6L2pAnbPB1lmspCyhBw0as",
  authDomain: "duftbasen.firebaseapp.com",
  projectId: "duftbasen",
  storageBucket: "duftbasen.firebasestorage.app",
  messagingSenderId: "1093246786174",
  appId: "1:1093246786174:web:4bf9900d35afd4ad88562f"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
