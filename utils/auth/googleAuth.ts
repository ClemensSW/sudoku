// utils/auth/googleAuth.ts
/**
 * Google Sign-In Integration (Stub for Expo Go)
 *
 * ⚠️ IMPORTANT: Google Sign-In requires Native Modules
 * This STUB version is for Expo Go compatibility.
 *
 * To enable Google Sign-In, you need to:
 * 1. Create a Development Build with `npx expo prebuild`
 * 2. Install `@react-native-google-signin/google-signin`
 * 3. Rebuild the app
 *
 * For now, this returns errors to disable the button in UI.
 */

import { User } from 'firebase/auth';

/**
 * Konfiguriert Google Sign-In (STUB)
 * DOES NOTHING in Expo Go - requires Development Build
 */
export function configureGoogleSignIn(): void {
  console.log('[GoogleAuth] ⚠️ Google Sign-In NOT AVAILABLE in Expo Go');
  console.log('[GoogleAuth] Create a Development Build to enable Google Sign-In');
}

/**
 * Sign in with Google (STUB)
 * Always returns null in Expo Go
 *
 * @returns null (not implemented)
 */
export async function signInWithGoogle(): Promise<User | null> {
  console.error('[GoogleAuth] ❌ Google Sign-In not available in Expo Go');
  throw new Error(
    'Google Sign-In benötigt einen Development Build. ' +
    'Diese Funktion ist in Expo Go nicht verfügbar.'
  );
}

/**
 * Sign out from Google (STUB)
 */
export async function signOutFromGoogle(): Promise<void> {
  console.log('[GoogleAuth] Sign-out stub (no-op)');
}

/**
 * Check if user is currently signed in with Google (STUB)
 */
export async function isGoogleSignedIn(): Promise<boolean> {
  return false;
}

/**
 * Get current Google user info (STUB)
 */
export async function getCurrentGoogleUser() {
  return null;
}

/**
 * Revoke Google access (STUB)
 */
export async function revokeGoogleAccess(): Promise<void> {
  console.log('[GoogleAuth] Revoke access stub (no-op)');
}

/**
 * Check if Google Sign-In is available (for UI conditional rendering)
 */
export function isGoogleSignInAvailable(): boolean {
  // In Expo Go: NOT available
  // In Development Build: Check if module exists
  try {
    // @ts-ignore - Check if native module exists
    return typeof require('@react-native-google-signin/google-signin') !== 'undefined';
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
