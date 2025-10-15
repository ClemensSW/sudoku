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

import React, { createContext, useState, useEffect, useRef, ReactNode } from 'react';
import { getFirebaseAuth } from '@/utils/cloudSync/firebaseConfig';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { uploadUserData, hasCloudData } from '@/utils/cloudSync/uploadService';

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

  // Track if we've already processed initial sync for this user
  const syncProcessedRef = useRef<string | null>(null);

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
   * Cloud Sync Handler
   * Wird aufgerufen wenn User sich anmeldet
   * - Prüft ob Cloud-Daten existieren
   * - Falls NEIN: Upload lokale Daten (Erstregistrierung)
   * - Falls JA: Download + Merge (später in Sprint 3)
   */
  useEffect(() => {
    // Nur wenn User eingeloggt ist und initializing fertig
    if (!user || initializing) {
      return;
    }

    // Skip wenn wir diesen User bereits processed haben
    if (syncProcessedRef.current === user.uid) {
      return;
    }

    const handleCloudSync = async () => {
      try {
        console.log('[AuthProvider] Handling cloud sync for user:', user.uid);

        // Check ob User bereits Cloud-Daten hat
        const cloudDataExists = await hasCloudData(user.uid);

        if (!cloudDataExists) {
          // ===== ERSTREGISTRIERUNG: Upload lokale Daten =====
          console.log('[AuthProvider] First time sign-in detected - uploading local data...');

          const result = await uploadUserData(user);

          if (result.success) {
            console.log('[AuthProvider] ✅ Initial upload successful');
            console.log('  Uploaded:', result.uploadedDocuments.join(', '));

            // TODO: Show success message to user
            // Alert.alert('Erfolg', 'Deine Daten wurden erfolgreich gesichert!');
          } else {
            console.error('[AuthProvider] ⚠️ Initial upload partially failed');
            console.log('  Uploaded:', result.uploadedDocuments.join(', '));
            console.log('  Errors:', result.errors);

            // TODO: Show warning to user
            // Alert.alert('Warnung', 'Einige Daten konnten nicht gesichert werden.');
          }
        } else {
          // ===== RE-LOGIN: Download + Merge (Sprint 3) =====
          console.log('[AuthProvider] Returning user detected - cloud data exists');
          console.log('[AuthProvider] Download + Merge will be implemented in Sprint 3');

          // TODO Sprint 3: Download Cloud-Daten und merge mit lokalen Daten
        }

        // Mark this user as processed
        syncProcessedRef.current = user.uid;
      } catch (error) {
        console.error('[AuthProvider] ❌ Error during cloud sync:', error);

        // TODO: Show error to user
        // Alert.alert('Fehler', 'Synchronisierung fehlgeschlagen.');
      }
    };

    // Run async
    handleCloudSync();
  }, [user, initializing]);

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

      // Reset sync processed ref
      syncProcessedRef.current = null;

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
