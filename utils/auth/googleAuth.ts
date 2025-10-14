// utils/auth/googleAuth.ts
/**
 * Google Sign-In Integration (Firebase JS SDK + Google Sign-In Native Module)
 *
 * Handles Google OAuth Sign-In with Firebase Authentication
 * - Configure Google Sign-In
 * - Sign in with Google
 * - Get Google ID Token
 * - Authenticate with Firebase
 *
 * ⚠️ REQUIRES: Development Build (not compatible with Expo Go)
 * To enable: npx expo prebuild && npx expo run:android
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getFirebaseAuth } from '@/utils/cloudSync/firebaseConfig';
import { GoogleAuthProvider, signInWithCredential, User } from 'firebase/auth';

/**
 * Konfiguriert Google Sign-In
 * MUSS beim App-Start aufgerufen werden!
 *
 * Die webClientId kommt aus der google-services.json:
 * - Öffne android/app/google-services.json
 * - Suche nach "client" -> "oauth_client" -> "client_type": 3
 * - Kopiere die "client_id" (endet mit .apps.googleusercontent.com)
 */
export function configureGoogleSignIn(): void {
  try {
    GoogleSignin.configure({
      // webClientId aus google-services.json (client_type: 3)
      webClientId: '1088781317667-q8rjg6nvk723ie0rekrua6hrc1kuiggt.apps.googleusercontent.com',

      // Offline Access für Server-Side API Calls (optional)
      offlineAccess: false,

      // Force Code for Refresh Token (optional)
      forceCodeForRefreshToken: false,

      // Scopes (optional - default: profile + email)
      scopes: ['profile', 'email'],
    });

    console.log('[GoogleAuth] ✅ Google Sign-In configured successfully');
  } catch (error) {
    console.error('[GoogleAuth] ❌ Error configuring Google Sign-In:', error);
    throw error;
  }
}

/**
 * Sign in with Google (Firebase JS SDK + Google Sign-In Native)
 * Öffnet Google Sign-In Dialog und authentifiziert mit Firebase
 *
 * @returns Firebase User oder null bei Abbruch
 * @throws Error bei Fehlern (Network, Permission, etc.)
 */
export async function signInWithGoogle(): Promise<User | null> {
  try {
    console.log('[GoogleAuth] Starting Google Sign-In...');

    // 1. Check if Play Services are available (Android only)
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    // 2. Sign in and get Google ID Token
    const { idToken, user: googleUser } = await GoogleSignin.signIn();

    console.log('[GoogleAuth] ✅ Google Sign-In successful:', {
      email: googleUser.email,
      name: googleUser.name,
    });

    // 3. Create Firebase credential with Google ID Token
    const googleCredential = GoogleAuthProvider.credential(idToken);

    // 4. Sign in to Firebase with the credential
    const auth = getFirebaseAuth();
    const userCredential = await signInWithCredential(auth, googleCredential);

    console.log('[GoogleAuth] ✅ Firebase authentication successful:', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return userCredential.user;
  } catch (error: any) {
    // Handle specific error codes
    if (error.code === 'SIGN_IN_CANCELLED') {
      console.log('[GoogleAuth] User cancelled sign-in');
      return null; // User cancelled - not an error
    }

    if (error.code === 'IN_PROGRESS') {
      console.log('[GoogleAuth] Sign-in already in progress');
      return null;
    }

    if (error.code === 'PLAY_SERVICES_NOT_AVAILABLE') {
      console.error('[GoogleAuth] ❌ Google Play Services not available');
      throw new Error('Google Play Services sind nicht verfügbar. Bitte aktualisiere Google Play Services.');
    }

    // Log and re-throw other errors
    console.error('[GoogleAuth] ❌ Error during Google Sign-In:', error);
    throw error;
  }
}

/**
 * Sign out from Google and Firebase
 */
export async function signOutFromGoogle(): Promise<void> {
  try {
    console.log('[GoogleAuth] Signing out from Google...');

    // 1. Sign out from Firebase
    const auth = getFirebaseAuth();
    await auth.signOut();

    // 2. Sign out from Google (revoke access)
    await GoogleSignin.signOut();

    console.log('[GoogleAuth] ✅ Signed out successfully');
  } catch (error) {
    console.error('[GoogleAuth] ❌ Error signing out:', error);
    throw error;
  }
}

/**
 * Check if user is currently signed in with Google
 */
export async function isGoogleSignedIn(): Promise<boolean> {
  try {
    return await GoogleSignin.isSignedIn();
  } catch (error) {
    console.error('[GoogleAuth] ❌ Error checking Google sign-in status:', error);
    return false;
  }
}

/**
 * Get current Google user info (without signing in again)
 */
export async function getCurrentGoogleUser() {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    return userInfo;
  } catch (error) {
    console.error('[GoogleAuth] ❌ Error getting current Google user:', error);
    return null;
  }
}

/**
 * Revoke Google access (complete logout)
 * User will need to re-grant permissions on next sign-in
 */
export async function revokeGoogleAccess(): Promise<void> {
  try {
    console.log('[GoogleAuth] Revoking Google access...');
    await GoogleSignin.revokeAccess();
    console.log('[GoogleAuth] ✅ Google access revoked');
  } catch (error) {
    console.error('[GoogleAuth] ❌ Error revoking Google access:', error);
    throw error;
  }
}

/**
 * Check if Google Sign-In is available (for UI conditional rendering)
 * Returns true in Development Build, false in Expo Go
 */
export function isGoogleSignInAvailable(): boolean {
  try {
    // Check if native module exists
    return GoogleSignin !== undefined && GoogleSignin.configure !== undefined;
  } catch {
    return false;
  }
}

// Export default object
export default {
  configure: configureGoogleSignIn,
  signIn: signInWithGoogle,
  signOut: signOutFromGoogle,
  isSignedIn: isGoogleSignedIn,
  getCurrentUser: getCurrentGoogleUser,
  revokeAccess: revokeGoogleAccess,
  isAvailable: isGoogleSignInAvailable,
};
