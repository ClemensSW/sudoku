// utils/cloudSync/syncService.ts
/**
 * Sync Service - Auto-Sync & Manual Sync
 *
 * Orchestriert komplette Synchronisierung zwischen Local & Cloud:
 * - Download Cloud-Daten
 * - Load lokale Daten
 * - Merge mit Conflict Resolution
 * - Save merged lokal
 * - Upload merged zurück zu Cloud
 *
 * Features:
 * - Debouncing (max 1 sync alle 5 Minuten)
 * - Retry Logic bei Netzwerkfehlern
 * - Status Tracking (isSyncing, lastSync)
 * - Error Handling
 *
 * Wird getriggert bei:
 * - App Launch (if logged in)
 * - App Pause/Background (if logged in)
 * - Game Completion (if logged in)
 * - Manual Sync Button
 */

import { getFirebaseAuth, getFirebaseFirestore } from './firebaseConfig';
import { downloadUserData } from './downloadService';
import { uploadUserData } from './uploadService';
import { mergeAllData } from './mergeService';
import { hasAnyDirty, getDirtyDocuments, clearDirtyBatch } from './dirtyFlags';
import {
  loadStats,
  loadSettings,
  loadColorUnlock,
  saveStats,
  saveSettings,
  saveColorUnlock,
  DEFAULT_SETTINGS,
} from '@/utils/storage';
import {
  loadLandscapeCollection,
  saveLandscapeCollection,
} from '@/screens/Gallery/utils/landscapes/storage';
import {
  loadUserProfile,
  saveUserProfile,
} from '@/utils/profileStorage';
import {
  gameStatsToFirestore,
  gameSettingsToFirestore,
  colorUnlockToFirestore,
  landscapesToFirestore,
  userProfileToFirestore,
} from './firestoreSchema';

// ===== Types =====

export interface SyncResult {
  success: boolean;
  timestamp: number;
  conflictsResolved: number;
  errors?: string[];
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSync: number | null;
  lastError: string | null;
}

// ===== State Management =====

let syncStatus: SyncStatus = {
  isSyncing: false,
  lastSync: null,
  lastError: null,
};

// Listener für Sync-Status Updates
type SyncStatusListener = (status: SyncStatus) => void;
const syncStatusListeners: Set<SyncStatusListener> = new Set();

// Debounce: Min 15 Minuten zwischen Syncs
const MIN_SYNC_INTERVAL = 15 * 60 * 1000; // 15 minutes

// Retry Config
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// ===== Helper Functions =====

/**
 * Benachrichtigt alle Listener über Status-Änderung
 */
function notifySyncStatusListeners(): void {
  const statusCopy = { ...syncStatus };
  syncStatusListeners.forEach(listener => {
    try {
      listener(statusCopy);
    } catch (error) {
      console.error('[SyncService] Error in sync status listener:', error);
    }
  });
}

/**
 * Registriert einen Listener für Sync-Status Updates
 * @returns Cleanup-Funktion zum Entfernen des Listeners
 */
export function subscribeSyncStatus(listener: SyncStatusListener): () => void {
  syncStatusListeners.add(listener);
  // Sofort aktuellen Status senden
  listener({ ...syncStatus });

  // Return cleanup function
  return () => {
    syncStatusListeners.delete(listener);
  };
}

/**
 * Prüft ob Sync erlaubt ist (Debouncing)
 */
function canSync(): boolean {
  if (syncStatus.isSyncing) {
    console.log('[SyncService] Sync already in progress - skipping');
    return false;
  }

  if (syncStatus.lastSync !== null) {
    const timeSinceLastSync = Date.now() - syncStatus.lastSync;
    if (timeSinceLastSync < MIN_SYNC_INTERVAL) {
      const remainingTime = Math.ceil((MIN_SYNC_INTERVAL - timeSinceLastSync) / 1000);
      console.log(`[SyncService] Last sync was ${Math.floor(timeSinceLastSync / 1000)}s ago - waiting ${remainingTime}s before next sync`);
      return false;
    }
  }

  return true;
}

/**
 * Wartet für Retry
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ===== Main Sync Function =====

/**
 * Synchronisiert alle User-Daten (Bidirektional)
 *
 * Flow:
 * 1. Download Cloud-Daten
 * 2. Load lokale Daten
 * 3. Merge mit Conflict Resolution
 * 4. Save merged lokal
 * 5. Upload merged zurück zu Cloud
 *
 * @param options - Sync options
 * @param options.force - Force sync even if debounce would block (default: false)
 * @param options.retryCount - Internal retry counter (default: 0)
 * @returns SyncResult with success status and details
 */
export async function syncUserData(options: {
  force?: boolean;
  retryCount?: number;
} = {}): Promise<SyncResult> {
  const { force = false, retryCount = 0 } = options;

  try {
    // 1. Check if user is logged in
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      console.log('[SyncService] No user logged in - skipping sync');
      return {
        success: false,
        timestamp: Date.now(),
        conflictsResolved: 0,
        errors: ['No user logged in'],
      };
    }

    // 2. Check debounce (unless forced)
    if (!force && !canSync()) {
      return {
        success: false,
        timestamp: Date.now(),
        conflictsResolved: 0,
        errors: ['Sync debounced'],
      };
    }

    // 3. Check if any data is dirty (unless forced)
    if (!force) {
      const hasDirty = await hasAnyDirty();
      if (!hasDirty) {
        console.log('[SyncService] No dirty data - skipping sync');
        return {
          success: false,
          timestamp: Date.now(),
          conflictsResolved: 0,
          errors: ['No dirty data'],
        };
      }
    }

    // 4. Mark as syncing
    syncStatus.isSyncing = true;
    syncStatus.lastError = null;
    notifySyncStatusListeners();

    console.log('[SyncService] Starting sync for user:', user.uid);

    // 4. Download Cloud-Daten
    console.log('[SyncService] Step 1/5: Downloading cloud data...');
    const cloudData = await downloadUserData(user.uid);

    // 5. Load lokale Daten
    console.log('[SyncService] Step 2/5: Loading local data...');
    const localStats = await loadStats();
    const localSettings = (await loadSettings()) || DEFAULT_SETTINGS;
    const localColorUnlock = await loadColorUnlock();
    const localLandscapes = await loadLandscapeCollection();
    const localProfile = await loadUserProfile();

    // Load lokale Settings Tracking (für Difficulty-Based Settings)
    const { loadSettingsTracking } = await import('@/utils/storage');
    const localTracking = await loadSettingsTracking();

    // 6. Merge mit Conflict Resolution
    console.log('[SyncService] Step 3/5: Merging data...');
    if (!cloudData.stats || !cloudData.settings || !cloudData.colorUnlock) {
      console.warn('[SyncService] ⚠️ Partial cloud data - using local as fallback');

      // Fallback: Upload local data if cloud is missing
      const uploadResult = await uploadUserData(user);

      syncStatus.isSyncing = false;
      syncStatus.lastSync = Date.now();
      notifySyncStatusListeners();

      return {
        success: uploadResult.success,
        timestamp: Date.now(),
        conflictsResolved: 0,
        errors: uploadResult.errors.map(e => e.error),
      };
    }

    const merged = mergeAllData(
      localStats,
      cloudData.stats,
      localSettings,
      cloudData.settings,
      localColorUnlock,
      cloudData.colorUnlock,
      localLandscapes,
      cloudData.landscapes,
      localProfile,
      cloudData.profile
    );

    console.log('[SyncService] Conflicts resolved:', merged.conflictsResolved);

    // Merge Settings Tracking (Cloud-Tracking wurde im downloadUserData lokal gespeichert)
    const cloudTracking = await loadSettingsTracking();
    const { mergeSettingsTracking } = await import('./mergeService');
    const mergedTracking = mergeSettingsTracking(localTracking, cloudTracking);
    console.log('[SyncService] Settings tracking merged');

    // 7. Save merged lokal
    console.log('[SyncService] Step 4/5: Saving merged data locally...');
    const { saveSettingsTracking } = await import('@/utils/storage');
    const savePromises = [
      saveStats(merged.stats),
      saveSettings(merged.settings),
      saveColorUnlock(merged.colorUnlock),
      saveSettingsTracking(mergedTracking), // Save merged tracking
    ];

    // Landscapes optional speichern (falls vorhanden)
    if (merged.landscapes) {
      savePromises.push(saveLandscapeCollection(merged.landscapes));
    }

    // Profile optional speichern (falls vorhanden)
    if (merged.profile) {
      savePromises.push(saveUserProfile(merged.profile).then(() => {}));
    }

    await Promise.all(savePromises);

    // 7.5 Nach Sync die Streak-Logik ausführen um Shields retroaktiv anzuwenden
    console.log('[SyncService] Step 4.5/5: Processing streak data after sync...');
    const { checkWeeklyShieldReset, applyShieldsAfterSync } = await import('@/utils/dailyStreak');
    await checkWeeklyShieldReset();
    await applyShieldsAfterSync();

    // 7.6 Stats neu laden nach Shield-Anwendung (damit Upload aktuelle Daten hat)
    const updatedStats = await loadStats();

    // 8. Upload nur dirty Documents zurück zu Cloud (Conditional Upload)
    console.log('[SyncService] Step 5/5: Uploading dirty documents to cloud...');
    const dirtyDocs = await getDirtyDocuments();
    console.log('[SyncService] Dirty documents:', dirtyDocs);

    if (dirtyDocs.length === 0) {
      console.log('[SyncService] No documents to upload - skipping upload step');
    } else {
      const firestore = getFirebaseFirestore();
      const uploadPromises: Promise<any>[] = [];
      const uploadedDocs: string[] = [];

      // Stats (TIER 1 - Critical) - Verwende updatedStats nach Shield-Anwendung!
      if (dirtyDocs.includes('stats')) {
        uploadPromises.push(
          firestore
            .collection('users')
            .doc(user.uid)
            .collection('data')
            .doc('stats')
            .set(gameStatsToFirestore(updatedStats))
            .then(() => uploadedDocs.push('stats'))
        );
      }

      // Settings (TIER 2 - Important)
      if (dirtyDocs.includes('settings')) {
        uploadPromises.push(
          firestore
            .collection('users')
            .doc(user.uid)
            .collection('data')
            .doc('settings')
            .set(gameSettingsToFirestore(merged.settings, mergedTracking))
            .then(() => uploadedDocs.push('settings'))
        );
      }

      // ColorUnlock (TIER 3 - Low Priority)
      if (dirtyDocs.includes('colorUnlock')) {
        uploadPromises.push(
          firestore
            .collection('users')
            .doc(user.uid)
            .collection('data')
            .doc('colorUnlock')
            .set(colorUnlockToFirestore(merged.colorUnlock))
            .then(() => uploadedDocs.push('colorUnlock'))
        );
      }

      // Landscapes (TIER 3 - Low Priority)
      if (dirtyDocs.includes('landscapes') && merged.landscapes) {
        uploadPromises.push(
          firestore
            .collection('users')
            .doc(user.uid)
            .collection('data')
            .doc('landscapes')
            .set(landscapesToFirestore(merged.landscapes))
            .then(() => uploadedDocs.push('landscapes'))
        );
      }

      // Profile (TIER 2 - Important)
      if (dirtyDocs.includes('profile') && merged.profile) {
        const existingDoc = await firestore.collection('users').doc(user.uid).get();
        const existingProfile = (typeof existingDoc.exists === 'function' ? existingDoc.exists() : existingDoc.exists)
          ? existingDoc.data()?.profile
          : null;

        uploadPromises.push(
          firestore
            .collection('users')
            .doc(user.uid)
            .set(
              {
                profile: userProfileToFirestore(merged.profile, existingProfile),
              },
              { merge: true }
            )
            .then(() => uploadedDocs.push('profile'))
        );
      }

      // Upload all dirty documents
      await Promise.all(uploadPromises);

      console.log('[SyncService] ✅ Uploaded documents:', uploadedDocs);

      // 9. Clear dirty flags for successfully uploaded documents
      await clearDirtyBatch(uploadedDocs as any);
      console.log('[SyncService] Dirty flags cleared for:', uploadedDocs);
    }

    // 10. Update status
    syncStatus.isSyncing = false;
    syncStatus.lastSync = Date.now();
    notifySyncStatusListeners();

    console.log('[SyncService] ✅ Sync complete!');

    return {
      success: true,
      timestamp: Date.now(),
      conflictsResolved: merged.conflictsResolved,
    };
  } catch (error: any) {
    console.error('[SyncService] ❌ Sync failed:', error);

    // Retry Logic (bei Netzwerkfehlern)
    if (retryCount < MAX_RETRIES && isNetworkError(error)) {
      console.log(`[SyncService] Retrying... (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY);
      return syncUserData({ force, retryCount: retryCount + 1 });
    }

    // Update status
    syncStatus.isSyncing = false;
    syncStatus.lastError = error.message;
    notifySyncStatusListeners();

    return {
      success: false,
      timestamp: Date.now(),
      conflictsResolved: 0,
      errors: [error.message],
    };
  }
}

/**
 * Prüft ob Error ein Netzwerkfehler ist (retryable)
 */
function isNetworkError(error: any): boolean {
  const networkErrorCodes = [
    'network-request-failed',
    'unavailable',
    'deadline-exceeded',
    'timeout',
  ];

  return (
    networkErrorCodes.includes(error.code) ||
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('timeout')
  );
}

// ===== Status Getters =====

/**
 * Gibt aktuellen Sync-Status zurück
 */
export function getSyncStatus(): SyncStatus {
  return { ...syncStatus };
}

/**
 * Prüft ob Sync gerade läuft
 */
export function isSyncing(): boolean {
  return syncStatus.isSyncing;
}

/**
 * Gibt Timestamp des letzten erfolgreichen Syncs zurück
 */
export function getLastSyncTimestamp(): number | null {
  return syncStatus.lastSync;
}

/**
 * Gibt letzten Sync-Error zurück (oder null)
 */
export function getLastSyncError(): string | null {
  return syncStatus.lastError;
}

// ===== Manual Sync =====

/**
 * Manueller Sync (z.B. via Button)
 * Ignoriert Debounce
 */
export async function manualSync(): Promise<SyncResult> {
  console.log('[SyncService] Manual sync requested');
  return syncUserData({ force: true });
}

// ===== Auto-Sync Helpers =====

/**
 * Sync bei App Launch
 * Respektiert Debounce
 */
export async function syncOnAppLaunch(): Promise<SyncResult> {
  console.log('[SyncService] Auto-sync triggered: App Launch');
  return syncUserData({ force: false });
}

/**
 * Sync bei App Pause/Background
 * Respektiert Debounce
 */
export async function syncOnAppPause(): Promise<SyncResult> {
  console.log('[SyncService] Auto-sync triggered: App Pause');
  return syncUserData({ force: false });
}

/**
 * Sync nach Game Completion
 * Respektiert Debounce
 */
export async function syncAfterGameCompletion(): Promise<SyncResult> {
  console.log('[SyncService] Auto-sync triggered: Game Completion');
  return syncUserData({ force: false });
}

// ===== Export =====

export default {
  syncUserData,
  manualSync,
  syncOnAppLaunch,
  syncOnAppPause,
  syncAfterGameCompletion,
  getSyncStatus,
  subscribeSyncStatus,
  isSyncing,
  getLastSyncTimestamp,
  getLastSyncError,
};
