// contexts/AuthProvider.tsx
/**
 * Authentication Context Provider (React Native Firebase)
 *
 * Manages authentication state for the entire app:
 * - User login/logout
 * - Firebase Auth listener
 * - Loading states
 * - Error handling
 *
 * ✅ Native Performance (React Native Firebase SDK)
 * ⚠️ Requires Development Build (not compatible with Expo Go)
 */

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getFirebaseAuth } from '@/utils/cloudSync/firebaseConfig';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

// ===== Types =====

export interface AuthContextType {
  // State
  user: FirebaseAuthTypes.User | null;
  isLoggedIn: boolean;
  loading: boolean;
  initializing: boolean;

  // Methods
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export interface AuthProviderProps {
  children: ReactNode;
}

// ===== Context =====

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ===== Provider Component =====

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Derived state
  const isLoggedIn = user !== null;

  /**
   * Firebase Auth State Listener
   * Wird automatisch aufgerufen wenn sich der Auth-Status ändert:
   * - User meldet sich an
   * - User meldet sich ab
   * - App-Start (aktueller Auth-Status)
   */
  useEffect(() => {
    console.log('[AuthProvider] Setting up Firebase Auth listener...');

    try {
      const auth = getFirebaseAuth();

      // Native SDK: onAuthStateChanged returns unsubscribe function
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        console.log('[AuthProvider] Auth state changed:', {
          isLoggedIn: firebaseUser !== null,
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
        });

        setUser(firebaseUser);

        // Initializing ist nur beim ersten Load true
        if (initializing) {
          setInitializing(false);
        }
      });

      // Cleanup: Listener entfernen wenn Component unmountet
      return () => {
        console.log('[AuthProvider] Removing Firebase Auth listener');
        unsubscribe();
      };
    } catch (error) {
      console.error('[AuthProvider] ❌ Error setting up auth listener:', error);
      setInitializing(false);
    }
  }, [initializing]);

  /**
   * Sign Out
   * Meldet den User ab und löscht den Firebase Auth-Token
   */
  const signOut = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('[AuthProvider] Signing out user...');

      const auth = getFirebaseAuth();
      await auth.signOut();

      console.log('[AuthProvider] ✅ User signed out successfully');
    } catch (error) {
      console.error('[AuthProvider] ❌ Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh User
   * Lädt die aktuellen User-Daten von Firebase neu
   * (z.B. nach Profil-Update)
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        console.log('[AuthProvider] Refreshing user data...');
        await currentUser.reload();
        setUser(auth.currentUser);
        console.log('[AuthProvider] ✅ User data refreshed');
      }
    } catch (error) {
      console.error('[AuthProvider] ❌ Error refreshing user:', error);
      throw error;
    }
  };

  // Context Value
  const value: AuthContextType = {
    user,
    isLoggedIn,
    loading,
    initializing,
    signOut,
    refreshUser,
  };

  // Don't render children until initial auth check is complete
  // Das verhindert flashing von Login/Logout-Screens
  if (initializing) {
    // Optional: Zeige einen Splash Screen hier
    // Für jetzt: Render nichts während initializing
    return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
