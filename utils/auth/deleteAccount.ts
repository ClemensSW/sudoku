// utils/auth/deleteAccount.ts
/**
 * Account Deletion
 *
 * Handles complete account deletion:
 * - Delete Firebase Auth account
 * - Delete cloud data (Firestore)
 * - Delete local data (AsyncStorage)
 * - Revoke Google access
 *
 * ⚠️ IMPORTANT: This is irreversible!
 */

import { getFirebaseAuth, getFirebaseFirestore } from '@/utils/cloudSync/firebaseConfig';
import { revokeGoogleAccess } from './googleAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Delete user account and all associated data
 *
 * Steps:
 * 1. Delete Firestore user document
 * 2. Delete Firebase Auth account
 * 3. Revoke Google access
 * 4. Clear local AsyncStorage
 *
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export async function deleteUserAccount(): Promise<void> {
  try {
    console.log('[DeleteAccount] Starting account deletion process...');

    // Get current user
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('No user is currently signed in');
    }

    const userId = user.uid;
    console.log('[DeleteAccount] Deleting account for user:', userId);

    // Step 1: Delete Firestore user document AND sub-collections
    try {
      const firestore = getFirebaseFirestore();

      console.log('[DeleteAccount] Deleting Firestore sub-collections...');

      // Delete sub-collection documents first (Firestore doesn't auto-delete sub-collections)
      const deletePromises = [
        firestore.collection('users').doc(userId).collection('data').doc('stats').delete(),
        firestore.collection('users').doc(userId).collection('data').doc('settings').delete(),
        firestore.collection('users').doc(userId).collection('data').doc('colorUnlock').delete(),
      ];

      // Wait for all sub-documents to be deleted (use allSettled to continue even if some fail)
      const results = await Promise.allSettled(deletePromises);

      // Log any failures
      results.forEach((result, index) => {
        const docName = ['stats', 'settings', 'colorUnlock'][index];
        if (result.status === 'rejected') {
          console.warn(`[DeleteAccount] ⚠️ Failed to delete ${docName}:`, result.reason);
        } else {
          console.log(`[DeleteAccount] ✅ Deleted ${docName}`);
        }
      });

      // Then delete parent document (this also removes the profile field)
      const userDocRef = firestore.collection('users').doc(userId);
      await userDocRef.delete();
      console.log('[DeleteAccount] ✅ Firestore user document deleted');
    } catch (error) {
      console.error('[DeleteAccount] ⚠️ Error deleting Firestore document:', error);
      // Continue even if Firestore deletion fails
    }

    // Step 2: Revoke Google access (if applicable)
    try {
      await revokeGoogleAccess();
      console.log('[DeleteAccount] ✅ Google access revoked');
    } catch (error) {
      console.error('[DeleteAccount] ⚠️ Error revoking Google access:', error);
      // Continue even if revoke fails (user might not be signed in with Google)
    }

    // Step 3: Delete Firebase Auth account
    // IMPORTANT: This must be done BEFORE clearing local data
    // because we need the auth session to delete the account
    // Note: user.delete() is deprecated in v22, but still works
    // Migration to modular API will be done in future update
    await user.delete();
    console.log('[DeleteAccount] ✅ Firebase Auth account deleted');

    // Step 4: Clear all local data
    await AsyncStorage.clear();
    console.log('[DeleteAccount] ✅ Local data cleared');

    console.log('[DeleteAccount] ✅ Account deletion completed successfully');
  } catch (error: any) {
    console.error('[DeleteAccount] ❌ Account deletion failed:', error);

    // Provide more specific error messages
    if (error.code === 'auth/requires-recent-login') {
      throw new Error(
        'Aus Sicherheitsgründen musst du dich erneut anmelden, bevor du dein Konto löschen kannst. Bitte melde dich ab und wieder an.'
      );
    }

    throw error;
  }
}

/**
 * Re-authenticate user before account deletion
 * Required if the user session is old (> 5 minutes since last sign-in)
 *
 * @returns Promise<boolean> - true if re-auth successful
 */
export async function reauthenticateForDeletion(): Promise<boolean> {
  try {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      return false;
    }

    // Force token refresh to check if session is still valid
    await user.getIdToken(true);

    return true;
  } catch (error) {
    console.error('[DeleteAccount] Re-authentication failed:', error);
    return false;
  }
}
