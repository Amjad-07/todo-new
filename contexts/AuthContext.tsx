import React, { createContext, useState, useEffect } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { User } from '../types';
import * as authService from '../services/authService';
import { auth } from '../firebase';
import { Spinner } from '../components/Spinner';

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => {
    const name = firebaseUser.displayName || firebaseUser.email || 'Anonymous';
    const initials = (name.split(' ').map(n => n[0]).join('') || '?').toUpperCase().substring(0, 2);
    return {
        id: firebaseUser.uid,
        name,
        email: firebaseUser.email || '',
        initials,
    };
};

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  loading: boolean; // This will represent action loading
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setInitialLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setError(null);
    setActionLoading(true);
    try {
      await authService.login(email, pass);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    setError(null);
    setActionLoading(true);
    try {
      await authService.signup(name, email, pass);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
  };

  if (initialLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Spinner />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading: actionLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};