// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAZCJHxP6IZAgfnYnSlV1htY3cbnpfN_bw",
  authDomain: "parks-of-mill.firebaseapp.com",
  projectId: "parks-of-mill",
  storageBucket: "parks-of-mill.firebasestorage.app",
  messagingSenderId: "726186290880",
  appId: "1:726186290880:web:585681a6c1b33b39ef4725",
  measurementId: "G-ZVWX9J5TRF"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db };
