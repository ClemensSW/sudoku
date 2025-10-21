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
import functions, { FirebaseFunctionsTypes } from '@react-native-firebase/functions';
import { Platform } from 'react-native';

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

    // ⚠️ DEVELOPMENT ONLY: Connect to Firebase Emulator
    if (__DEV__) {
      try {
        // Use different host depending on platform and device type
        // Physical Device: Use computer's IP address (192.168.0.206)
        // Android Emulator: Use 10.0.2.2 (special emulator IP)
        // iOS Simulator: Use localhost
        const localhost = Platform.OS === 'android' ? '192.168.0.206' : 'localhost';

        // Connect to Functions Emulator
        // Note: Emulator serves all functions regardless of their declared region
        functions().useEmulator(localhost, 5001);
        console.log(`[Firebase] ✅ Connected to Functions Emulator at ${localhost}:5001`);

        // Connect to Firestore Emulator
        firestore().useEmulator(localhost, 8088);
        console.log(`[Firebase] ✅ Connected to Firestore Emulator at ${localhost}:8088`);

        // Connect to Auth Emulator
        auth().useEmulator(`http://${localhost}:9099`);
        console.log(`[Firebase] ✅ Connected to Auth Emulator at ${localhost}:9099`);
      } catch (error) {
        console.warn('[Firebase] ⚠️ Could not connect to emulators (might already be connected):', error);
      }
    }

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
 * Gibt die Firebase Functions Instanz zurück
 *
 * Note: Functions are deployed to europe-west3 region (Frankfurt, Germany) for GDPR compliance.
 * The region is specified in the backend function definitions, not in the client call.
 * React Native Firebase's namespaced API automatically routes to the correct region.
 */
export function getFirebaseFunctions(): FirebaseFunctionsTypes.Module {
  return functions();
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
  getFirebaseFunctions,
  isFirebaseAvailable,
  getCurrentUser,
  isUserLoggedIn,
};
