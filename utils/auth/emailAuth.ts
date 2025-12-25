// utils/auth/emailAuth.ts
/**
 * Email/Password Authentication with Firebase
 *
 * Handles email/password authentication:
 * - Sign up with email and password
 * - Sign in with email and password
 * - Password reset
 * - Email verification (optional)
 * - Sign out
 *
 * Firebase Auth automatically persists the session - user stays logged in!
 */

import { getFirebaseAuth } from '@/utils/cloudSync/firebaseConfig';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';

/**
 * Firebase Auth Error Codes and their user-friendly messages
 */
export type EmailAuthErrorCode =
  | 'auth/email-already-in-use'
  | 'auth/invalid-email'
  | 'auth/weak-password'
  | 'auth/user-not-found'
  | 'auth/wrong-password'
  | 'auth/too-many-requests'
  | 'auth/invalid-credential'
  | 'auth/network-request-failed'
  | 'unknown';

/**
 * Maps Firebase error codes to translation keys
 */
export function getEmailAuthErrorKey(errorCode: string): string {
  const errorMap: Record<string, string> = {
    'auth/email-already-in-use': 'emailInUse',
    'auth/invalid-email': 'invalidEmail',
    'auth/weak-password': 'weakPassword',
    'auth/user-not-found': 'userNotFound',
    'auth/wrong-password': 'wrongPassword',
    'auth/too-many-requests': 'tooManyRequests',
    'auth/invalid-credential': 'wrongPassword', // Firebase v9+ combines wrong-password into this
    'auth/network-request-failed': 'networkError',
  };

  return errorMap[errorCode] || 'generic';
}

/**
 * Sign up with email and password
 * Creates a new user account in Firebase
 *
 * @param email - User's email address
 * @param password - User's password (min 6 characters)
 * @returns Firebase User
 * @throws Error with Firebase error code
 */
export async function signUpWithEmail(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    console.log('[EmailAuth] Creating new account...');

    const firebaseAuth = getFirebaseAuth();
    const userCredential = await firebaseAuth.createUserWithEmailAndPassword(
      email.trim().toLowerCase(),
      password
    );

    console.log('[EmailAuth] ✅ Account created successfully:', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('[EmailAuth] ❌ Error creating account:', error.code, error.message);
    throw error;
  }
}

/**
 * Sign in with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Firebase User
 * @throws Error with Firebase error code
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<FirebaseAuthTypes.User> {
  try {
    console.log('[EmailAuth] Signing in...');

    const firebaseAuth = getFirebaseAuth();
    const userCredential = await firebaseAuth.signInWithEmailAndPassword(
      email.trim().toLowerCase(),
      password
    );

    console.log('[EmailAuth] ✅ Sign in successful:', {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
    });

    return userCredential.user;
  } catch (error: any) {
    console.error('[EmailAuth] ❌ Error signing in:', error.code, error.message);
    throw error;
  }
}

/**
 * Send password reset email
 *
 * @param email - User's email address
 * @throws Error with Firebase error code
 */
export async function sendPasswordReset(email: string): Promise<void> {
  try {
    console.log('[EmailAuth] Sending password reset email...');

    const firebaseAuth = getFirebaseAuth();
    await firebaseAuth.sendPasswordResetEmail(email.trim().toLowerCase());

    console.log('[EmailAuth] ✅ Password reset email sent');
  } catch (error: any) {
    console.error('[EmailAuth] ❌ Error sending password reset:', error.code, error.message);
    throw error;
  }
}

/**
 * Send email verification to current user
 * Call this after sign up if you want to verify the email
 *
 * @throws Error if no user is signed in
 */
export async function sendEmailVerification(): Promise<void> {
  try {
    const firebaseAuth = getFirebaseAuth();
    const currentUser = firebaseAuth.currentUser;

    if (!currentUser) {
      throw new Error('No user is currently signed in');
    }

    if (currentUser.emailVerified) {
      console.log('[EmailAuth] Email already verified');
      return;
    }

    console.log('[EmailAuth] Sending verification email...');
    await currentUser.sendEmailVerification();
    console.log('[EmailAuth] ✅ Verification email sent');
  } catch (error: any) {
    console.error('[EmailAuth] ❌ Error sending verification email:', error.code, error.message);
    throw error;
  }
}

/**
 * Check if current user's email is verified
 */
export function isEmailVerified(): boolean {
  const firebaseAuth = getFirebaseAuth();
  return firebaseAuth.currentUser?.emailVerified ?? false;
}

/**
 * Reload current user to get fresh email verification status
 */
export async function reloadUser(): Promise<void> {
  const firebaseAuth = getFirebaseAuth();
  await firebaseAuth.currentUser?.reload();
}

/**
 * Sign out from Firebase
 * Works for both email and Google sign-in
 */
export async function signOutFromEmail(): Promise<void> {
  try {
    console.log('[EmailAuth] Signing out...');

    const firebaseAuth = getFirebaseAuth();
    await firebaseAuth.signOut();

    console.log('[EmailAuth] ✅ Signed out successfully');
  } catch (error: any) {
    console.error('[EmailAuth] ❌ Error signing out:', error);
    throw error;
  }
}

/**
 * Get the current authentication provider type
 * Returns 'email', 'google.com', 'apple.com', or null
 */
export function getAuthProvider(): string | null {
  const firebaseAuth = getFirebaseAuth();
  const user = firebaseAuth.currentUser;

  if (!user) return null;

  // Check provider data
  const providers = user.providerData;
  if (providers.length > 0) {
    return providers[0].providerId;
  }

  return null;
}

/**
 * Check if user is signed in with email/password
 */
export function isEmailUser(): boolean {
  return getAuthProvider() === 'password';
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength
 * Firebase requires minimum 6 characters
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

// Export default object for convenience
export default {
  signUp: signUpWithEmail,
  signIn: signInWithEmail,
  sendPasswordReset,
  sendEmailVerification,
  isEmailVerified,
  reloadUser,
  signOut: signOutFromEmail,
  getAuthProvider,
  isEmailUser,
  isValidEmail,
  isValidPassword,
  getErrorKey: getEmailAuthErrorKey,
};
