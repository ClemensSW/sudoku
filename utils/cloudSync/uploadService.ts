// utils/cloudSync/uploadService.ts
/**
 * Upload Service - Erste Synchronisierung (Local → Firestore)
 *
 * Dieser Service uploaded lokale AsyncStorage Daten zu Firestore:
 * - Stats (GameStats + DailyStreak)
 * - Settings (GameSettings)
 * - ColorUnlock (ColorUnlockData)
 * - Profile (User Info)
 *
 * Wird verwendet bei:
 * - Erstregistrierung (Upload aller lokalen Daten)
 * - Manual Sync (User-triggered)
 * - Auto-Sync nach Änderungen
 */

import { getFirebaseFirestore } from './firebaseConfig';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// Import lokale Storage Functions
import {
  loadStats,
  loadSettings,
  loadColorUnlock,
  DEFAULT_SETTINGS,
} from '@/utils/storage';

// Import Converter Functions
import {
  gameStatsToFirestore,
  gameSettingsToFirestore,
  colorUnlockToFirestore,
  createProfileFromFirebaseUser,
  validateGameStats,
  validateGameSettings,
  validateColorUnlock,
  sanitizeGameStats,
} from './firestoreSchema';

// Import Types
import type {
  FirestoreStats,
  FirestoreSettings,
  FirestoreColorUnlock,
  FirestoreProfile,
} from './types';

// ===== Error Types =====

export class UploadError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'UploadError';
  }
}

// ===== Upload Functions =====

/**
 * Upload Stats (inkl. DailyStreak) zu Firestore
 */
export async function uploadStats(userId: string): Promise<void> {
  try {
    console.log('[UploadService] Uploading stats for user:', userId);

    // 1. Load lokale Stats
    const localStats = await loadStats();

    // 2. Validate Stats
    const validation = validateGameStats(localStats);
    if (!validation.valid) {
      console.warn('[UploadService] Stats validation failed:', validation.errors);
      throw new UploadError(
        'Invalid stats data: ' + validation.errors.join(', '),
        'VALIDATION_ERROR'
      );
    }

    // 3. Sanitize Stats (falls nötig)
    const sanitizedStats = sanitizeGameStats(localStats);

    // 4. Convert to Firestore format
    const firestoreStats: FirestoreStats = gameStatsToFirestore(sanitizedStats);

    // 5. Upload to Firestore
    const firestore = getFirebaseFirestore();
    await firestore.collection('users').doc(userId).collection('data').doc('stats').set(
      firestoreStats,
      { merge: false } // Overwrite, not merge
    );

    console.log('[UploadService] ✅ Stats uploaded successfully');
  } catch (error: any) {
    console.error('[UploadService] ❌ Error uploading stats:', error);
    throw new UploadError(
      'Failed to upload stats',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Upload Settings zu Firestore
 */
export async function uploadSettings(userId: string): Promise<void> {
  try {
    console.log('[UploadService] Uploading settings for user:', userId);

    // 1. Load lokale Settings
    const localSettings = await loadSettings();

    // Falls keine Settings gespeichert, nutze DEFAULT_SETTINGS
    const settings = localSettings || DEFAULT_SETTINGS;

    // 2. Validate Settings
    const validation = validateGameSettings(settings);
    if (!validation.valid) {
      console.warn('[UploadService] Settings validation failed:', validation.errors);
      throw new UploadError(
        'Invalid settings data: ' + validation.errors.join(', '),
        'VALIDATION_ERROR'
      );
    }

    // 3. Convert to Firestore format
    const firestoreSettings: FirestoreSettings = gameSettingsToFirestore(settings);

    // 4. Upload to Firestore
    const firestore = getFirebaseFirestore();
    await firestore.collection('users').doc(userId).collection('data').doc('settings').set(
      firestoreSettings,
      { merge: false } // Overwrite, not merge
    );

    console.log('[UploadService] ✅ Settings uploaded successfully');
  } catch (error: any) {
    console.error('[UploadService] ❌ Error uploading settings:', error);
    throw new UploadError(
      'Failed to upload settings',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Upload ColorUnlock zu Firestore
 */
export async function uploadColorUnlock(userId: string): Promise<void> {
  try {
    console.log('[UploadService] Uploading colorUnlock for user:', userId);

    // 1. Load lokale ColorUnlock
    const localColorUnlock = await loadColorUnlock();

    // 2. Validate ColorUnlock
    const validation = validateColorUnlock(localColorUnlock);
    if (!validation.valid) {
      console.warn('[UploadService] ColorUnlock validation failed:', validation.errors);
      throw new UploadError(
        'Invalid colorUnlock data: ' + validation.errors.join(', '),
        'VALIDATION_ERROR'
      );
    }

    // 3. Convert to Firestore format
    const firestoreColorUnlock: FirestoreColorUnlock =
      colorUnlockToFirestore(localColorUnlock);

    // 4. Upload to Firestore
    const firestore = getFirebaseFirestore();
    await firestore
      .collection('users')
      .doc(userId)
      .collection('data')
      .doc('colorUnlock')
      .set(firestoreColorUnlock, { merge: false });

    console.log('[UploadService] ✅ ColorUnlock uploaded successfully');
  } catch (error: any) {
    console.error('[UploadService] ❌ Error uploading colorUnlock:', error);
    throw new UploadError(
      'Failed to upload colorUnlock',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Upload Profile zu Firestore
 */
export async function uploadProfile(
  userId: string,
  user: FirebaseAuthTypes.User
): Promise<void> {
  try {
    console.log('[UploadService] Uploading profile for user:', userId);

    // 1. Create Profile from Firebase User
    const firestoreProfile: FirestoreProfile = createProfileFromFirebaseUser(user);

    // 2. Upload to Firestore (direkt im users/ document, nicht in sub-collection)
    const firestore = getFirebaseFirestore();
    await firestore.collection('users').doc(userId).set(
      {
        profile: firestoreProfile,
      },
      { merge: true } // Merge, damit wir data sub-collection nicht überschreiben
    );

    console.log('[UploadService] ✅ Profile uploaded successfully');
  } catch (error: any) {
    console.error('[UploadService] ❌ Error uploading profile:', error);
    throw new UploadError(
      'Failed to upload profile',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

// ===== Orchestrator Function =====

/**
 * Upload komplette User-Daten zu Firestore (Erstregistrierung)
 *
 * Wird aufgerufen nach erfolgreichem Google/Apple Sign-In
 * Falls Firestore noch keine Daten hat (Erstregistrierung)
 */
export async function uploadUserData(
  user: FirebaseAuthTypes.User
): Promise<{
  success: boolean;
  uploadedDocuments: string[];
  errors: Array<{ document: string; error: string }>;
}> {
  const userId = user.uid;
  console.log('[UploadService] Starting complete user data upload for:', userId);

  const uploadedDocuments: string[] = [];
  const errors: Array<{ document: string; error: string }> = [];

  try {
    // Upload in parallelen Batches für bessere Performance
    // (Profile muss zuerst, da es das users/{userId} document erstellt)

    // Step 1: Upload Profile (erstellt das users document)
    try {
      await uploadProfile(userId, user);
      uploadedDocuments.push('profile');
    } catch (error: any) {
      console.error('[UploadService] Profile upload failed:', error);
      errors.push({ document: 'profile', error: error.message });
      // Profile ist kritisch - wenn das fehlschlägt, brechen wir ab
      throw error;
    }

    // Step 2: Upload andere Daten parallel
    const uploadPromises = [
      uploadStats(userId).then(() => {
        uploadedDocuments.push('stats');
      }),
      uploadSettings(userId).then(() => {
        uploadedDocuments.push('settings');
      }),
      uploadColorUnlock(userId).then(() => {
        uploadedDocuments.push('colorUnlock');
      }),
    ];

    // Wait for all uploads (aber fange Errors individuell)
    const results = await Promise.allSettled(uploadPromises);

    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        const docName = ['stats', 'settings', 'colorUnlock'][index];
        console.error(`[UploadService] ${docName} upload failed:`, result.reason);
        errors.push({
          document: docName,
          error: result.reason?.message || 'Unknown error',
        });
      }
    });

    // Log summary
    console.log('[UploadService] Upload summary:');
    console.log('  ✅ Uploaded:', uploadedDocuments.join(', '));
    if (errors.length > 0) {
      console.log('  ❌ Errors:', errors.map((e) => e.document).join(', '));
    }

    // Upload war erfolgreich wenn mindestens Profile + Stats hochgeladen wurden
    const success = uploadedDocuments.includes('profile') && uploadedDocuments.includes('stats');

    return {
      success,
      uploadedDocuments,
      errors,
    };
  } catch (error: any) {
    console.error('[UploadService] ❌ Complete upload failed:', error);
    return {
      success: false,
      uploadedDocuments,
      errors: [...errors, { document: 'general', error: error.message }],
    };
  }
}

/**
 * Prüft ob User bereits Daten in Firestore hat
 * (für Unterscheidung Erstregistrierung vs. Re-Login)
 */
export async function hasCloudData(userId: string): Promise<boolean> {
  try {
    console.log('[UploadService] Checking if user has cloud data:', userId);

    const firestore = getFirebaseFirestore();

    // Prüfe ob stats document existiert (Hauptindikator)
    const statsDoc = await firestore
      .collection('users')
      .doc(userId)
      .collection('data')
      .doc('stats')
      .get();

    // Handle both function and boolean forms of exists (API version compatibility)
    const hasData = typeof statsDoc.exists === 'function' ? statsDoc.exists() : statsDoc.exists;
    console.log('[UploadService] User has cloud data:', hasData);

    return hasData;
  } catch (error: any) {
    console.error('[UploadService] ❌ Error checking cloud data:', error);
    // Bei Error gehen wir davon aus, dass keine Daten vorhanden sind
    return false;
  }
}

// ===== Export All =====

export default {
  uploadStats,
  uploadSettings,
  uploadColorUnlock,
  uploadProfile,
  uploadUserData,
  hasCloudData,
};
