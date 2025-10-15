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
import {
  loadStats,
  loadSettings,
  loadColorUnlock,
  saveStats,
  saveSettings,
  saveColorUnlock,
  DEFAULT_SETTINGS,
} from '@/utils/storage';
import { gameStatsToFirestore, gameSettingsToFirestore, colorUnlockToFirestore } from './firestoreSchema';

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

// Debounce: Min 5 Minuten zwischen Syncs
const MIN_SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Retry Config
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// ===== Helper Functions =====

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

    // 3. Mark as syncing
    syncStatus.isSyncing = true;
    syncStatus.lastError = null;

    console.log('[SyncService] Starting sync for user:', user.uid);

    // 4. Download Cloud-Daten
    console.log('[SyncService] Step 1/5: Downloading cloud data...');
    const cloudData = await downloadUserData(user.uid);

    // 5. Load lokale Daten
    console.log('[SyncService] Step 2/5: Loading local data...');
    const localStats = await loadStats();
    const localSettings = (await loadSettings()) || DEFAULT_SETTINGS;
    const localColorUnlock = await loadColorUnlock();

    // 6. Merge mit Conflict Resolution
    console.log('[SyncService] Step 3/5: Merging data...');
    if (!cloudData.stats || !cloudData.settings || !cloudData.colorUnlock) {
      console.warn('[SyncService] ⚠️ Partial cloud data - using local as fallback');

      // Fallback: Upload local data if cloud is missing
      const uploadResult = await uploadUserData(user);

      syncStatus.isSyncing = false;
      syncStatus.lastSync = Date.now();

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
      cloudData.colorUnlock
    );

    console.log('[SyncService] Conflicts resolved:', merged.conflictsResolved);

    // 7. Save merged lokal
    console.log('[SyncService] Step 4/5: Saving merged data locally...');
    await Promise.all([
      saveStats(merged.stats),
      saveSettings(merged.settings),
      saveColorUnlock(merged.colorUnlock),
    ]);

    // 8. Upload merged zurück zu Cloud
    console.log('[SyncService] Step 5/5: Uploading merged data to cloud...');
    const firestore = getFirebaseFirestore();
    await Promise.all([
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('data')
        .doc('stats')
        .set(gameStatsToFirestore(merged.stats)),
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('data')
        .doc('settings')
        .set(gameSettingsToFirestore(merged.settings)),
      firestore
        .collection('users')
        .doc(user.uid)
        .collection('data')
        .doc('colorUnlock')
        .set(colorUnlockToFirestore(merged.colorUnlock)),
    ]);

    // 9. Update status
    syncStatus.isSyncing = false;
    syncStatus.lastSync = Date.now();

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
  isSyncing,
  getLastSyncTimestamp,
  getLastSyncError,
};
