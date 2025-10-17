// utils/storage/clearAllData.ts
/**
 * Clear All Local Data
 *
 * Provides function to delete all locally stored game data
 * for users who are not signed in (no cloud sync).
 *
 * ⚠️ IMPORTANT: This is irreversible!
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';

/**
 * Clear all local data and restart the app
 *
 * This deletes ALL AsyncStorage data:
 * - Game stats
 * - Settings
 * - Color unlocks
 * - Saved games
 * - Everything else
 *
 * After clearing, the app is restarted to reset all state.
 *
 * @returns Promise<void>
 * @throws Error if deletion fails
 */
export async function clearAllLocalData(): Promise<void> {
  try {
    console.log('[ClearAllData] Starting to clear all local data...');

    // Clear all AsyncStorage data
    await AsyncStorage.clear();

    console.log('[ClearAllData] ✅ All local data cleared');

    // Restart the app to reset state
    console.log('[ClearAllData] Restarting app...');

    // Use Expo Updates to reload the app
    if (Updates.isEnabled) {
      await Updates.reloadAsync();
    } else {
      // In development, we can't use Updates.reloadAsync()
      // The user will need to manually restart the app
      console.log('[ClearAllData] ⚠️ Development mode - please restart the app manually');
    }
  } catch (error: any) {
    console.error('[ClearAllData] ❌ Failed to clear local data:', error);
    throw new Error('Failed to delete local data: ' + error.message);
  }
}

export default {
  clearAllLocalData,
};
