// utils/cloudSync/dirtyFlags.ts
/**
 * Dirty Flag System - Change Tracking für Cloud Sync
 *
 * Trackt welche Daten sich seit letztem Sync geändert haben
 * um unnötige Firestore Writes zu vermeiden.
 *
 * Verhindert:
 * - Upload von unveränderten Daten
 * - Sync bei App Pause ohne Änderungen
 * - Unnötige Reads/Writes bei Settings-Only Changes
 *
 * Features:
 * - Per-Document Dirty Flags (stats, settings, colorUnlock, landscapes, profile)
 * - Last Modified Timestamps für jedes Document
 * - Persistence via AsyncStorage (überlebt App Restarts)
 * - Atomic Operations
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// ===== Types =====

export type DirtyDocument = 'stats' | 'settings' | 'colorUnlock' | 'landscapes' | 'profile';

export interface DirtyFlags {
  stats: boolean;
  settings: boolean;
  colorUnlock: boolean;
  landscapes: boolean;
  profile: boolean;
  lastModified: {
    stats?: number;
    settings?: number;
    colorUnlock?: number;
    landscapes?: number;
    profile?: number;
  };
}

// ===== Storage Key =====

const DIRTY_FLAGS_KEY = '@sudoku_cloud_dirty_flags';

// ===== Default State =====

const DEFAULT_DIRTY_FLAGS: DirtyFlags = {
  stats: false,
  settings: false,
  colorUnlock: false,
  landscapes: false,
  profile: false,
  lastModified: {},
};

// ===== In-Memory Cache =====

let dirtyFlagsCache: DirtyFlags | null = null;

// ===== Core Functions =====

/**
 * Load Dirty Flags from AsyncStorage
 */
export async function loadDirtyFlags(): Promise<DirtyFlags> {
  try {
    // Return cached version if available
    if (dirtyFlagsCache !== null) {
      return dirtyFlagsCache;
    }

    const json = await AsyncStorage.getItem(DIRTY_FLAGS_KEY);

    if (!json) {
      console.log('[DirtyFlags] No flags found - using defaults');
      dirtyFlagsCache = { ...DEFAULT_DIRTY_FLAGS };
      return dirtyFlagsCache;
    }

    const flags = JSON.parse(json) as DirtyFlags;
    dirtyFlagsCache = flags;

    console.log('[DirtyFlags] Loaded:', flags);
    return flags;
  } catch (error) {
    console.error('[DirtyFlags] ❌ Error loading flags:', error);
    dirtyFlagsCache = { ...DEFAULT_DIRTY_FLAGS };
    return dirtyFlagsCache;
  }
}

/**
 * Save Dirty Flags to AsyncStorage
 */
async function saveDirtyFlags(flags: DirtyFlags): Promise<void> {
  try {
    await AsyncStorage.setItem(DIRTY_FLAGS_KEY, JSON.stringify(flags));
    dirtyFlagsCache = flags;
    console.log('[DirtyFlags] Saved:', flags);
  } catch (error) {
    console.error('[DirtyFlags] ❌ Error saving flags:', error);
  }
}

// ===== Public API =====

/**
 * Markiert ein Document als "dirty" (geändert)
 * Wird aufgerufen nach jedem save*() in storage.ts
 */
export async function setDirty(document: DirtyDocument): Promise<void> {
  try {
    const flags = await loadDirtyFlags();
    const timestamp = Date.now();

    flags[document] = true;
    flags.lastModified[document] = timestamp;

    await saveDirtyFlags(flags);

    console.log(`[DirtyFlags] ✏️ ${document} marked as dirty`);
  } catch (error) {
    console.error(`[DirtyFlags] ❌ Error setting dirty flag for ${document}:`, error);
  }
}

/**
 * Markiert ein Document als "clean" (synchronisiert)
 * Wird aufgerufen nach erfolgreichem Upload/Download
 */
export async function clearDirty(document: DirtyDocument): Promise<void> {
  try {
    const flags = await loadDirtyFlags();

    flags[document] = false;
    // Keep lastModified timestamp for debugging

    await saveDirtyFlags(flags);

    console.log(`[DirtyFlags] ✅ ${document} marked as clean`);
  } catch (error) {
    console.error(`[DirtyFlags] ❌ Error clearing dirty flag for ${document}:`, error);
  }
}

/**
 * Markiert mehrere Documents als "clean"
 * Batch-Version für Upload Success
 */
export async function clearDirtyBatch(documents: DirtyDocument[]): Promise<void> {
  try {
    const flags = await loadDirtyFlags();

    documents.forEach(doc => {
      flags[doc] = false;
    });

    await saveDirtyFlags(flags);

    console.log(`[DirtyFlags] ✅ Batch cleared: ${documents.join(', ')}`);
  } catch (error) {
    console.error('[DirtyFlags] ❌ Error clearing dirty flags batch:', error);
  }
}

/**
 * Markiert ALLE Documents als "clean"
 * Wird aufgerufen nach erfolgreichem Full Sync
 */
export async function clearAllDirty(): Promise<void> {
  try {
    const flags = await loadDirtyFlags();

    flags.stats = false;
    flags.settings = false;
    flags.colorUnlock = false;
    flags.landscapes = false;
    flags.profile = false;

    await saveDirtyFlags(flags);

    console.log('[DirtyFlags] ✅ All flags cleared');
  } catch (error) {
    console.error('[DirtyFlags] ❌ Error clearing all dirty flags:', error);
  }
}

/**
 * Prüft ob ein bestimmtes Document dirty ist
 */
export async function isDirty(document: DirtyDocument): Promise<boolean> {
  const flags = await loadDirtyFlags();
  return flags[document];
}

/**
 * Prüft ob IRGENDEIN Document dirty ist
 * Für "Skip Sync" Decision
 */
export async function hasAnyDirty(): Promise<boolean> {
  const flags = await loadDirtyFlags();
  return flags.stats || flags.settings || flags.colorUnlock || flags.landscapes || flags.profile;
}

/**
 * Gibt alle Dirty Documents zurück
 * Für selektiven Upload
 */
export async function getDirtyDocuments(): Promise<DirtyDocument[]> {
  const flags = await loadDirtyFlags();
  const dirty: DirtyDocument[] = [];

  if (flags.stats) dirty.push('stats');
  if (flags.settings) dirty.push('settings');
  if (flags.colorUnlock) dirty.push('colorUnlock');
  if (flags.landscapes) dirty.push('landscapes');
  if (flags.profile) dirty.push('profile');

  return dirty;
}

/**
 * Reset komplett (für Testing/Debugging)
 */
export async function resetDirtyFlags(): Promise<void> {
  try {
    await AsyncStorage.removeItem(DIRTY_FLAGS_KEY);
    dirtyFlagsCache = null;
    console.log('[DirtyFlags] 🔄 Reset complete');
  } catch (error) {
    console.error('[DirtyFlags] ❌ Error resetting flags:', error);
  }
}

// ===== Export All =====

export default {
  loadDirtyFlags,
  setDirty,
  clearDirty,
  clearDirtyBatch,
  clearAllDirty,
  isDirty,
  hasAnyDirty,
  getDirtyDocuments,
  resetDirtyFlags,
};
