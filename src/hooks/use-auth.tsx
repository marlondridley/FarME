
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

export interface User extends FirebaseUser {
  role?: 'consumer' | 'farmer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is logged in, now fetch their role from Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({ ...firebaseUser, role: userData.role });
          } else {
            // User exists in Auth but not Firestore. This can happen during registration
            // before the Firestore doc is created. Treat as logged in but without a role.
            setUser(firebaseUser);
          }
        } catch (error) {
            console.error("Error fetching user data from Firestore:", error);
            // If there's an error fetching from Firestore, treat as logged in but without a role.
            setUser(firebaseUser);
        }
      } else {
        // User is logged out
        setUser(null);
      }
      // Set loading to false only after all async operations are complete.
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);
  
  // The loading screen will now show until the onAuthStateChanged listener,
  // and the subsequent Firestore fetch (if applicable), are complete.
  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
