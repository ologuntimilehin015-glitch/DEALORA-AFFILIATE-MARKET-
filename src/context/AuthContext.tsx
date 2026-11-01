import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  auth,
  googleProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  isUserAdmin,
  BOOTSTRAP_ADMIN_EMAIL,
  testConnection,
} from '../lib/firebase';
import { seedInitialProductsToFirestore } from '../services/productService';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  devAdminBypass: boolean;
  enableDevAdmin: () => void;
  disableDevAdmin: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAdmin: false,
  loading: true,
  loginWithGoogle: async () => {},
  logout: async () => {},
  devAdminBypass: false,
  enableDevAdmin: () => {},
  disableDevAdmin: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [devAdminBypass, setDevAdminBypass] = useState<boolean>(() => {
    return localStorage.getItem('omnisync_dev_admin') === 'true';
  });

  useEffect(() => {
    // Run initial connection test
    testConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user && isUserAdmin(user)) {
        // Attempt seeding initial products if firestore is empty
        try {
          await seedInitialProductsToFirestore();
        } catch (e) {
          console.warn('Auto-seed check complete:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && isUserAdmin(result.user)) {
        await seedInitialProductsToFirestore();
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setDevAdminBypass(false);
      localStorage.removeItem('omnisync_dev_admin');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const enableDevAdmin = () => {
    setDevAdminBypass(true);
    localStorage.setItem('omnisync_dev_admin', 'true');
  };

  const disableDevAdmin = () => {
    setDevAdminBypass(false);
    localStorage.removeItem('omnisync_dev_admin');
  };

  const isAdmin = isUserAdmin(currentUser) || devAdminBypass;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        loading,
        loginWithGoogle,
        logout,
        devAdminBypass,
        enableDevAdmin,
        disableDevAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
