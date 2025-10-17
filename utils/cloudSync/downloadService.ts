// utils/cloudSync/downloadService.ts
/**
 * Download Service - Cloud → Local Sync
 *
 * Downloaded Firestore-Daten und speichert sie in AsyncStorage
 * Wird verwendet bei:
 * - Re-Login (Returning User)
 * - Geräte-Wechsel
 * - Manual Sync
 */

import { getFirebaseFirestore } from './firebaseConfig';
import {
  saveStats,
  saveSettings,
  saveColorUnlock,
  type GameStats,
  type GameSettings,
  type ColorUnlockData,
} from '@/utils/storage';
import {
  loadLandscapeCollection,
  saveLandscapeCollection,
  type LandscapeCollection,
} from '@/screens/Gallery/utils/landscapes/storage';
import { type UserProfile } from '@/utils/profileStorage';
import {
  firestoreToGameStats,
  firestoreToGameSettings,
  firestoreToColorUnlock,
  firestoreToLandscapes,
  firestoreToUserProfile,
} from './firestoreSchema';
import type {
  FirestoreStats,
  FirestoreSettings,
  FirestoreColorUnlock,
  FirestoreLandscapes,
  FirestoreProfile,
} from './types';

// ===== Error Types =====

export class DownloadError extends Error {
  constructor(message: string, public code: string, public originalError?: Error) {
    super(message);
    this.name = 'DownloadError';
  }
}

// ===== Download Functions =====

/**
 * Download Stats von Firestore
 */
export async function downloadStats(userId: string): Promise<GameStats | null> {
  try {
    console.log('[DownloadService] Downloading stats for user:', userId);

    const firestore = getFirebaseFirestore();
    const doc = await firestore.collection('users').doc(userId).collection('data').doc('stats').get();

    if (!doc.exists) {
      console.log('[DownloadService] No stats found in Firestore');
      return null;
    }

    const data = doc.data();
    if (!data) {
      console.log('[DownloadService] Stats document is empty');
      return null;
    }

    const firestoreStats = data as FirestoreStats;
    const localStats = firestoreToGameStats(firestoreStats);

    console.log('[DownloadService] ✅ Stats downloaded successfully');
    return localStats;
  } catch (error: any) {
    console.error('[DownloadService] ❌ Error downloading stats:', error);
    throw new DownloadError('Failed to download stats', error.code || 'UNKNOWN_ERROR', error);
  }
}

/**
 * Download Settings von Firestore
 */
export async function downloadSettings(userId: string): Promise<GameSettings | null> {
  try {
    console.log('[DownloadService] Downloading settings for user:', userId);

    const firestore = getFirebaseFirestore();
    const doc = await firestore.collection('users').doc(userId).collection('data').doc('settings').get();

    if (!doc.exists) {
      console.log('[DownloadService] No settings found in Firestore');
      return null;
    }

    const data = doc.data();
    if (!data) {
      console.log('[DownloadService] Settings document is empty');
      return null;
    }

    const firestoreSettings = data as FirestoreSettings;
    const localSettings = firestoreToGameSettings(firestoreSettings);

    console.log('[DownloadService] ✅ Settings downloaded successfully');
    return localSettings;
  } catch (error: any) {
    console.error('[DownloadService] ❌ Error downloading settings:', error);
    throw new DownloadError('Failed to download settings', error.code || 'UNKNOWN_ERROR', error);
  }
}

/**
 * Download ColorUnlock von Firestore
 */
export async function downloadColorUnlock(userId: string): Promise<ColorUnlockData | null> {
  try {
    console.log('[DownloadService] Downloading colorUnlock for user:', userId);

    const firestore = getFirebaseFirestore();
    const doc = await firestore.collection('users').doc(userId).collection('data').doc('colorUnlock').get();

    if (!doc.exists) {
      console.log('[DownloadService] No colorUnlock found in Firestore');
      return null;
    }

    const data = doc.data();
    if (!data) {
      console.log('[DownloadService] ColorUnlock document is empty');
      return null;
    }

    const firestoreColorUnlock = data as FirestoreColorUnlock;
    const localColorUnlock = firestoreToColorUnlock(firestoreColorUnlock);

    console.log('[DownloadService] ✅ ColorUnlock downloaded successfully');
    return localColorUnlock;
  } catch (error: any) {
    console.error('[DownloadService] ❌ Error downloading colorUnlock:', error);
    throw new DownloadError('Failed to download colorUnlock', error.code || 'UNKNOWN_ERROR', error);
  }
}

/**
 * Download Landscapes von Firestore
 * WICHTIG: Merged mit lokaler Collection, da statische Assets (Bilder, Namen) lokal bleiben
 */
export async function downloadLandscapes(userId: string): Promise<LandscapeCollection | null> {
  try {
    console.log('[DownloadService] Downloading landscapes for user:', userId);

    const firestore = getFirebaseFirestore();
    const doc = await firestore
      .collection('users')
      .doc(userId)
      .collection('data')
      .doc('landscapes')
      .get();

    if (!doc.exists) {
      console.log('[DownloadService] No landscapes found in Firestore');
      return null;
    }

    const data = doc.data();
    if (!data) {
      console.log('[DownloadService] Landscapes document is empty');
      return null;
    }

    const firestoreLandscapes = data as FirestoreLandscapes;

    // Lade lokale Collection für Merge (statische Daten bleiben lokal)
    const localCollection = await loadLandscapeCollection();

    // Merge Firestore-Daten mit lokaler Collection
    const mergedCollection = firestoreToLandscapes(firestoreLandscapes, localCollection);

    console.log('[DownloadService] ✅ Landscapes downloaded and merged successfully');
    return mergedCollection;
  } catch (error: any) {
    console.error('[DownloadService] ❌ Error downloading landscapes:', error);
    throw new DownloadError(
      'Failed to download landscapes',
      error.code || 'UNKNOWN_ERROR',
      error
    );
  }
}

/**
 * Download Profile von Firestore
 * Holt Name, Avatar und Titel aus der Cloud
 */
export async function downloadProfile(userId: string): Promise<UserProfile | null> {
  try {
    console.log('[DownloadService] Downloading profile for user:', userId);

    const firestore = getFirebaseFirestore();
    const doc = await firestore.collection('users').doc(userId).get();

    if (!doc.exists) {
      console.log('[DownloadService] No profile found in Firestore');
      return null;
    }

    const data = doc.data();
    const profileData = data?.profile;

    if (!profileData) {
      console.log('[DownloadService] Profile data is empty');
      return null;
    }

    const firestoreProfile = profileData as FirestoreProfile;
    const localProfile = firestoreToUserProfile(firestoreProfile);

    console.log('[DownloadService] ✅ Profile downloaded successfully');
    return localProfile;
  } catch (error: any) {
    console.error('[DownloadService] ❌ Error downloading profile:', error);
    throw new DownloadError('Failed to download profile', error.code || 'UNKNOWN_ERROR', error);
  }
}

// ===== Orchestrator =====

export interface DownloadResult {
  stats: GameStats | null;
  settings: GameSettings | null;
  colorUnlock: ColorUnlockData | null;
  landscapes: LandscapeCollection | null;
  profile: UserProfile | null;
}

/**
 * Download alle User-Daten von Firestore
 */
export async function downloadUserData(userId: string): Promise<DownloadResult> {
  console.log('[DownloadService] Downloading all user data for:', userId);

  const [stats, settings, colorUnlock, landscapes, profile] = await Promise.all([
    downloadStats(userId).catch(err => {
      console.error('[DownloadService] Stats download failed:', err);
      return null;
    }),
    downloadSettings(userId).catch(err => {
      console.error('[DownloadService] Settings download failed:', err);
      return null;
    }),
    downloadColorUnlock(userId).catch(err => {
      console.error('[DownloadService] ColorUnlock download failed:', err);
      return null;
    }),
    downloadLandscapes(userId).catch(err => {
      console.error('[DownloadService] Landscapes download failed:', err);
      return null;
    }),
    downloadProfile(userId).catch(err => {
      console.error('[DownloadService] Profile download failed:', err);
      return null;
    }),
  ]);

  console.log('[DownloadService] Download complete:', {
    stats: stats !== null,
    settings: settings !== null,
    colorUnlock: colorUnlock !== null,
    landscapes: landscapes !== null,
    profile: profile !== null,
  });

  return { stats, settings, colorUnlock, landscapes, profile };
}

export default {
  downloadStats,
  downloadSettings,
  downloadColorUnlock,
  downloadLandscapes,
  downloadProfile,
  downloadUserData,
};
