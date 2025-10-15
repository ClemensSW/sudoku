// utils/cloudSync/firebaseConfig.ts
/**
 * Firebase Configuration & Initialization (React Native Firebase - Native SDK)
 *
 * Dieses Modul initialisiert Firebase für die App mit dem Native SDK.
 * - Firebase App (Core) - Auto-initialized from google-services.json / GoogleService-Info.plist
 * - Firebase Auth (Google/Apple Sign-In)
 * - Firestore (Cloud-Datenbank)
 *
 * ✅ Native Performance (C++ Firebase SDK)
 * ✅ Offline-First mit nativer Persistenz
 * ✅ Push Notifications Support (FCM)
 * ✅ Cross-Platform (iOS, Android)
 * ⚠️ Requires Development Build (not compatible with Expo Go)
 */

import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/**
 * Initialisiert Firebase Services
 *
 * ⚠️ WICHTIG:
 * - Firebase App wird automatisch aus google-services.json (Android) initialisiert
 * - Firebase App wird automatisch aus GoogleService-Info.plist (iOS) initialisiert
 * - Diese Funktion aktiviert Firestore Offline-Persistenz
 *
 * Diese Funktion sollte beim App-Start aufgerufen werden!
 */
export async function initializeFirebase(): Promise<void> {
  try {
    console.log('[Firebase] Initializing Firebase (Native SDK)...');

    // Firebase App wird automatisch initialisiert - nichts zu tun!
    console.log('[Firebase] ✅ Firebase App auto-initialized from google-services.json');

    // Firebase Auth wird automatisch initialisiert - nichts zu tun!
    console.log('[Firebase] ✅ Firebase Auth auto-initialized');

    // Firestore Offline-Persistenz aktivieren
    try {
      await firestore().settings({
        persistence: true, // Enable offline persistence
        cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED, // No size limit (or set a specific size)
      });
      console.log('[Firebase] ✅ Firestore Offline-Persistenz enabled');
    } catch (error: any) {
      // Settings können nur einmal gesetzt werden - ignorieren falls schon gesetzt
      if (error.code === 'firestore/already-exists') {
        console.log('[Firebase] ✅ Firestore settings already configured');
      } else {
        console.warn('[Firebase] ⚠️ Could not configure Firestore settings:', error);
      }
    }

    console.log('[Firebase] ✅ Firebase initialized successfully');
  } catch (error) {
    console.error('[Firebase] ❌ Error initializing Firebase:', error);
    // Fehler wird nicht geworfen - App soll trotzdem starten können
    // Firebase-Features werden dann einfach nicht verfügbar sein
  }
}

/**
 * Gibt die Firebase Auth Instanz zurück
 * Für Google/Apple Sign-In und User Management
 */
export function getFirebaseAuth(): FirebaseAuthTypes.Module {
  return auth();
}

/**
 * Gibt die Firestore Instanz zurück
 * Für Cloud-Datenbank Zugriffe
 */
export function getFirebaseFirestore(): FirebaseFirestoreTypes.Module {
  return firestore();
}

/**
 * Prüft ob Firebase initialisiert und verfügbar ist
 */
export function isFirebaseAvailable(): boolean {
  try {
    // Check if auth module is available
    const authInstance = auth();
    return authInstance !== null && authInstance !== undefined;
  } catch (error) {
    console.error('[Firebase] Firebase not available:', error);
    return false;
  }
}

/**
 * Gibt den aktuell eingeloggten User zurück (oder null)
 */
export function getCurrentUser(): FirebaseAuthTypes.User | null {
  try {
    return auth().currentUser;
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
  getFirebaseAuth,
  getFirebaseFirestore,
  isFirebaseAvailable,
  getCurrentUser,
  isUserLoggedIn,
};
