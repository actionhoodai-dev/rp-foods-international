import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrr9CMZaSkku2IY4BK52C3lKyOKTf9N1w",
  authDomain: "rp-foods-international.firebaseapp.com",
  projectId: "rp-foods-international",
  storageBucket: "rp-foods-international.firebasestorage.app",
  messagingSenderId: "273366549677",
  appId: "1:273366549677:web:2c4a4e81e213d4da983224",
  measurementId: "G-HLRC78WGXY"
};

// Initialize Firebase (SSR Safe Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
