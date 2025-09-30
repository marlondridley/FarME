
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, getDocFromCache } from 'firebase/firestore';
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
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        try {
          // Try to get from cache first for offline speed
          let userDoc;
          try {
            userDoc = await getDocFromCache(userDocRef);
            if (!userDoc.exists()) {
              // If not in cache, fetch from server
              userDoc = await getDoc(userDocRef);
            }
          } catch (e) {
             // If cache fails, fetch from server
             userDoc = await getDoc(userDocRef);
          }
          
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, role: userDoc.data().role });
          } else {
            setUser(firebaseUser); 
          }
        } catch (error) {
          console.error("Error fetching user role, user might be offline or doc doesn't exist yet", error);
          // Gracefully handle offline case by setting user without the role.
          setUser(firebaseUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
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
