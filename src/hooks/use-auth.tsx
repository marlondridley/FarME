
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
          // Try fetching from the server first to get the most up-to-date user role.
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUser({ ...firebaseUser, role: userDoc.data().role });
          } else {
             // If the doc doesn't exist on the server, check the cache.
             // This can happen if the user is offline and the doc was created recently.
            try {
              const cachedDoc = await getDocFromCache(userDocRef);
              if (cachedDoc.exists()) {
                setUser({ ...firebaseUser, role: cachedDoc.data().role });
              } else {
                setUser(firebaseUser); // No role info available.
              }
            } catch (cacheError) {
                console.error("Error fetching user from cache:", cacheError);
                setUser(firebaseUser); // Fallback to user without role.
            }
          }
        } catch (error) {
          console.error("Error fetching user role, user might be offline or doc doesn't exist yet. Trying cache.", error);
          // If server fails (e.g., offline), gracefully fall back to cache.
          try {
             const userDoc = await getDocFromCache(userDocRef);
             if (userDoc.exists()) {
                setUser({ ...firebaseUser, role: userDoc.data().role });
             } else {
                setUser(firebaseUser);
             }
          } catch (cacheError) {
            console.error("Failed to get user from server or cache:", cacheError);
            setUser(firebaseUser); // Fallback to user without role info.
          }
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
