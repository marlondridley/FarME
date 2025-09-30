
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "studio-9207851391-c6f6b",
  appId: "1:628192282219:web:cab1a173f1589e5e94532e",
  apiKey: "AIzaSyCOBvOwjV023DgWRZ9ksqNguJhZQEMaF5k",
  authDomain: "studio-9207851391-c6f6b.firebaseapp.com",
  databaseURL: "https://studio-9207851391-c6f6b.firebaseio.com",
  measurementId: "",
  messagingSenderId: "628192282219"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled
      // in one tab at a a time.
      console.warn('Firestore persistence failed: multiple tabs open.');
    } else if (err.code == 'unimplemented') {
      // The current browser does not support all of the
      // features required to enable persistence
      console.warn('Firestore persistence is not available in this browser.');
    }
  });


export { app, auth, db };
