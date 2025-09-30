
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-9207851391-c6f6b",
  appId: "1:628192282219:web:cab1a173f1589e5e94532e",
  apiKey: "AIzaSyCOBvOwjV023DgWRZ9ksqNguJhZQEMaF5k",
  authDomain: "studio-9207851391-c6f6b.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "628192282219"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
