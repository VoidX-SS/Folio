'use client';
import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth } from '@/firebase/provider';

export interface UserState {
  user: User | null;
  loading: boolean;
}

const UserContext = createContext<UserState | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const [userState, setUserState] = useState<UserState>({
    user: null,
    loading: true,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserState({ user, loading: false });
    });
    return () => unsubscribe();
  }, [auth]);

  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
