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
import { AppState, AppStateStatus } from 'react-native';
import { getFirebaseAuth } from '@/utils/cloudSync/firebaseConfig';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { uploadUserData, hasCloudData } from '@/utils/cloudSync/uploadService';
import { downloadUserData } from '@/utils/cloudSync/downloadService';
import { mergeAllData } from '@/utils/cloudSync/mergeService';
import { syncOnAppLaunch, syncOnAppPause, updateSyncTimestamp } from '@/utils/cloudSync/syncService';
import { loadStats, loadSettings, loadColorUnlock, saveStats, saveSettings, saveColorUnlock, DEFAULT_SETTINGS } from '@/utils/storage';
import { loadUserProfile, saveUserProfile } from '@/utils/profileStorage';
import { gameStatsToFirestore, gameSettingsToFirestore, colorUnlockToFirestore } from '@/utils/cloudSync/firestoreSchema';
import { getFirebaseFirestore } from '@/utils/cloudSync/firebaseConfig';

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

            // Update sync timestamp so UI shows "Gerade eben"
            updateSyncTimestamp();

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

          // 1. Download Cloud-Daten
          const cloudData = await downloadUserData(user.uid);

          // 2. Load lokale Daten
          const localStats = await loadStats();
          const localSettings = (await loadSettings()) || DEFAULT_SETTINGS;
          const localColorUnlock = await loadColorUnlock();
          const localProfile = await loadUserProfile();

          // 3. Merge mit Conflict Resolution
          if (cloudData.stats && cloudData.settings && cloudData.colorUnlock) {
            const merged = mergeAllData(
              localStats,
              cloudData.stats,
              localSettings,
              cloudData.settings,
              localColorUnlock,
              cloudData.colorUnlock,
              null,  // landscapes local (optional)
              null,  // landscapes cloud (optional)
              localProfile,
              cloudData.profile
            );

            console.log('[AuthProvider] Data merged, conflicts resolved:', merged.conflictsResolved);

            // 4. Save merged data lokal
            await Promise.all([
              saveStats(merged.stats),
              saveSettings(merged.settings),
              saveColorUnlock(merged.colorUnlock),
            ]);

            // 4.1 Save merged profile (if available)
            if (merged.profile) {
              await saveUserProfile(merged.profile);
              console.log('[AuthProvider] Profile saved:', merged.profile.name, merged.profile.titleLevelIndex);
            }

            // 5. Upload merged data zurück zu Cloud
            const firestore = getFirebaseFirestore();
            await Promise.all([
              firestore.collection('users').doc(user.uid).collection('data').doc('stats').set(gameStatsToFirestore(merged.stats)),
              firestore.collection('users').doc(user.uid).collection('data').doc('settings').set(gameSettingsToFirestore(merged.settings)),
              firestore.collection('users').doc(user.uid).collection('data').doc('colorUnlock').set(colorUnlockToFirestore(merged.colorUnlock)),
            ]);

            console.log('[AuthProvider] ✅ Sync complete (Download + Merge)');

            // Update sync timestamp so UI shows "Gerade eben"
            updateSyncTimestamp();

            // TODO: Show sync summary to user
          } else {
            console.warn('[AuthProvider] ⚠️ Partial cloud data - using local as fallback');
          }
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
   * Auto-Sync on App State Change
   * Triggert Sync wenn:
   * - App wird aktiv (Launch/Foreground): syncOnAppLaunch()
   * - App geht in Background: syncOnAppPause()
   */
  useEffect(() => {
    // Nur wenn User eingeloggt ist
    if (!user) {
      return;
    }

    console.log('[AuthProvider] Setting up AppState listener for auto-sync...');

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      console.log('[AuthProvider] AppState changed to:', nextAppState);

      if (nextAppState === 'active') {
        // App wird aktiv → Sync
        syncOnAppLaunch().then(result => {
          if (result.success) {
            console.log('[AuthProvider] ✅ Auto-sync on launch successful');
          } else {
            console.log('[AuthProvider] ⚠️ Auto-sync on launch skipped/failed:', result.errors);
          }
        });
      } else if (nextAppState === 'background') {
        // App geht in Background → Sync
        syncOnAppPause().then(result => {
          if (result.success) {
            console.log('[AuthProvider] ✅ Auto-sync on pause successful');
          } else {
            console.log('[AuthProvider] ⚠️ Auto-sync on pause skipped/failed:', result.errors);
          }
        });
      }
    };

    // Subscribe to AppState changes
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Cleanup: Remove listener when component unmounts or user logs out
    return () => {
      console.log('[AuthProvider] Removing AppState listener');
      subscription.remove();
    };
  }, [user]);

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
