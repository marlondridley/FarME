
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  "projectId": "studio-9207851391-c6f6b",
  "appId": "1:628192282219:web:cab1a173f1589e5e94532e",
  "apiKey": "AIzaSyCOBvOwjV023DgWRZ9ksqNguJhZQEMaF5k",
  "authDomain": "studio-9207851391-c6f6b.firebaseapp.com",
  "messagingSenderId": "628192282219",
  "databaseURL": "https://studio-9207851391-c6f6b.firebaseio.com"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Initialize Firestore with offline persistence
let db;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
  });
} catch (e) {
  console.error("Could not initialize Firestore with offline persistence", e);
  // Fallback to default firestore instance if persistence fails
  db = getFirestore(app);
}


export { app, auth, db };
