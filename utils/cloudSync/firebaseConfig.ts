// utils/cloudSync/firebaseConfig.ts
/**
 * Firebase Configuration & Initialization (Web SDK for Expo)
 *
 * Dieses Modul initialisiert Firebase für die App mit dem JS/Web SDK.
 * - Firebase App (Core)
 * - Firebase Auth (Google/Apple Sign-In)
 * - Firestore (Cloud-Datenbank)
 *
 * ✅ Funktioniert mit Expo Go (keine Native Modules)
 * ✅ Offline-First mit IndexedDB/AsyncStorage
 * ✅ Cross-Platform (iOS, Android, Web)
 */

import { Platform } from 'react-native';
import { initializeApp, FirebaseApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  Firestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Firebase Configuration
 * Diese Werte kommen aus der Firebase Console:
 * Project Settings > General > Your apps > SDK setup and configuration
 */
const firebaseConfig = {
  apiKey: 'AIzaSyDxFNfSPH_YpwRZLfYZ9k8lQ4oKYQN-Xz8',
  authDomain: 'sudoku-duo-cc9e5.firebaseapp.com',
  projectId: 'sudoku-duo-cc9e5',
  storageBucket: 'sudoku-duo-cc9e5.firebasestorage.app',
  messagingSenderId: '1088781317667',
  appId: '1:1088781317667:android:3c8e8f8b5c5f5f5f5f5f5f',
};

let firebaseApp: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

/**
 * Initialisiert Firebase Services
 * - Firebase App
 * - Auth mit React Native Persistence (AsyncStorage)
 * - Firestore mit Offline-Persistenz
 *
 * ⚠️ WICHTIG: Diese Funktion sollte beim App-Start aufgerufen werden!
 */
export async function initializeFirebase(): Promise<void> {
  try {
    console.log('[Firebase] Initializing Firebase (Web SDK)...');

    // 1. Initialize Firebase App (nur wenn noch nicht initialisiert)
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log('[Firebase] ✅ Firebase App initialized');
    } else {
      firebaseApp = getApp();
      console.log('[Firebase] ✅ Firebase App already initialized');
    }

    // 2. Initialize Auth mit AsyncStorage Persistence (React Native)
    if (Platform.OS !== 'web') {
      try {
        auth = initializeAuth(firebaseApp, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
        console.log('[Firebase] ✅ Firebase Auth initialized (React Native Persistence)');
      } catch (error: any) {
        // Falls Auth schon initialisiert ist, hole die bestehende Instanz
        if (error.code === 'auth/already-initialized') {
          auth = getAuth(firebaseApp);
          console.log('[Firebase] ✅ Firebase Auth already initialized');
        } else {
          throw error;
        }
      }
    } else {
      // Web: Standard Auth
      auth = getAuth(firebaseApp);
      console.log('[Firebase] ✅ Firebase Auth initialized (Web)');
    }

    // 3. Initialize Firestore mit Offline-Persistenz
    try {
      if (Platform.OS !== 'web') {
        // React Native: Persistent Local Cache
        firestore = initializeFirestore(firebaseApp, {
          localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
          }),
        });
        console.log('[Firebase] ✅ Firestore initialized (Persistent Cache)');
      } else {
        // Web: Standard Firestore
        firestore = getFirestore(firebaseApp);
        console.log('[Firebase] ✅ Firestore initialized (Web)');
      }
    } catch (error: any) {
      // Falls Firestore schon initialisiert ist, hole die bestehende Instanz
      if (error.code === 'failed-precondition') {
        firestore = getFirestore(firebaseApp);
        console.log('[Firebase] ✅ Firestore already initialized');
      } else {
        throw error;
      }
    }

    console.log('[Firebase] ✅ Firebase initialized successfully');
    console.log('[Firebase] Platform:', Platform.OS);
  } catch (error) {
    console.error('[Firebase] ❌ Error initializing Firebase:', error);
    // Fehler wird nicht geworfen - App soll trotzdem starten können
    // Firebase-Features werden dann einfach nicht verfügbar sein
  }
}

/**
 * Gibt die Firebase App Instanz zurück
 */
export function getFirebaseApp(): FirebaseApp {
  if (!firebaseApp) {
    throw new Error('[Firebase] Firebase not initialized. Call initializeFirebase() first.');
  }
  return firebaseApp;
}

/**
 * Gibt die Firebase Auth Instanz zurück
 * Für Google/Apple Sign-In und User Management
 */
export function getFirebaseAuth(): Auth {
  if (!auth) {
    throw new Error('[Firebase] Firebase Auth not initialized. Call initializeFirebase() first.');
  }
  return auth;
}

/**
 * Gibt die Firestore Instanz zurück
 * Für Cloud-Datenbank Zugriffe
 */
export function getFirebaseFirestore(): Firestore {
  if (!firestore) {
    throw new Error('[Firebase] Firestore not initialized. Call initializeFirebase() first.');
  }
  return firestore;
}

/**
 * Prüft ob Firebase initialisiert und verfügbar ist
 */
export function isFirebaseAvailable(): boolean {
  try {
    return getApps().length > 0 && auth !== undefined;
  } catch (error) {
    console.error('[Firebase] Firebase not available:', error);
    return false;
  }
}

/**
 * Gibt den aktuell eingeloggten User zurück (oder null)
 */
export function getCurrentUser() {
  try {
    if (!auth) {
      return null;
    }
    return auth.currentUser;
  } catch (error) {
    console.error('[Firebase] Error getting current user:', error);
    return null;
  }
}

/**
 * Prüft ob ein User eingeloggt ist
 */
export function isUserLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Export für externe Nutzung
export default {
  initializeFirebase,
  getFirebaseApp,
  getFirebaseAuth,
  getFirebaseFirestore,
  isFirebaseAvailable,
  getCurrentUser,
  isUserLoggedIn,
};
