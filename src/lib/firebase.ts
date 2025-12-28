import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDj6QXtdVVDh7C3YHpqr6We9fXdjwurU_0",
  authDomain: "feel-fly-technology.firebaseapp.com",
  projectId: "feel-fly-technology",
  storageBucket: "feel-fly-technology.firebasestorage.app",
  messagingSenderId: "694249369556",
  appId: "1:694249369556:web:1c4a57bfdbc802dbad3041",
  measurementId: "G-H9HFPLB565"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;