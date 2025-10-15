// utils/cloudSync/mergeService.ts
/**
 * Merge Service - Conflict Resolution
 *
 * Merget lokale und Cloud-Daten mit verschiedenen Strategien:
 * - Stats: Max-Value (höhere Werte gewinnen)
 * - Settings: Last-Write-Wins (neuerer Timestamp gewinnt)
 * - ColorUnlock: Union (alle freigeschalteten Farben kombinieren)
 * - DailyStreak: Cloud-Wins (gegen Manipulation)
 */

import type { GameStats, GameSettings, ColorUnlockData, DailyStreakData } from '@/utils/storage';
import { isLocalNewer } from './firestoreSchema';

// ===== Merge Stats (Max-Value Strategy) =====

export function mergeStats(local: GameStats, cloud: GameStats): GameStats {
  console.log('[MergeService] Merging stats (Max-Value Strategy)');

  // XP: Nimm höheren Wert (kein Addieren wegen Duplikaten)
  const totalXP = Math.max(local.totalXP || 0, cloud.totalXP || 0);

  // Games: Nimm höhere Werte
  const gamesPlayed = Math.max(local.gamesPlayed || 0, cloud.gamesPlayed || 0);
  const gamesWon = Math.max(local.gamesWon || 0, cloud.gamesWon || 0);

  // Best Times: Nimm bessere Zeiten (MIN, aber Infinity ist schlechter)
  const bestTimeEasy =
    local.bestTimeEasy === Infinity ? cloud.bestTimeEasy :
    cloud.bestTimeEasy === Infinity ? local.bestTimeEasy :
    Math.min(local.bestTimeEasy, cloud.bestTimeEasy);

  const bestTimeMedium =
    local.bestTimeMedium === Infinity ? cloud.bestTimeMedium :
    cloud.bestTimeMedium === Infinity ? local.bestTimeMedium :
    Math.min(local.bestTimeMedium, cloud.bestTimeMedium);

  const bestTimeHard =
    local.bestTimeHard === Infinity ? cloud.bestTimeHard :
    cloud.bestTimeHard === Infinity ? local.bestTimeHard :
    Math.min(local.bestTimeHard, cloud.bestTimeHard);

  const bestTimeExpert =
    local.bestTimeExpert === Infinity ? cloud.bestTimeExpert :
    cloud.bestTimeExpert === Infinity ? local.bestTimeExpert :
    Math.min(local.bestTimeExpert, cloud.bestTimeExpert);

  // Completed Games: Nimm höhere Werte
  const completedEasy = Math.max(local.completedEasy || 0, cloud.completedEasy || 0);
  const completedMedium = Math.max(local.completedMedium || 0, cloud.completedMedium || 0);
  const completedHard = Math.max(local.completedHard || 0, cloud.completedHard || 0);
  const completedExpert = Math.max(local.completedExpert || 0, cloud.completedExpert || 0);

  // Streaks: Nimm höhere Werte
  const currentStreak = Math.max(local.currentStreak || 0, cloud.currentStreak || 0);
  const longestStreak = Math.max(local.longestStreak || 0, cloud.longestStreak || 0);

  // Milestones: Union (alle erreichten kombinieren)
  const reachedMilestones = Array.from(
    new Set([...(local.reachedMilestones || []), ...(cloud.reachedMilestones || [])])
  ).sort((a, b) => a - b);

  // DailyStreak: Cloud-Wins (gegen Manipulation)
  const dailyStreak = cloud.dailyStreak || local.dailyStreak;

  // Timestamp: Nimm neueren
  const updatedAt = Math.max(local.updatedAt || 0, cloud.updatedAt || 0);

  const merged: GameStats = {
    gamesPlayed,
    gamesWon,
    bestTimeEasy,
    bestTimeMedium,
    bestTimeHard,
    bestTimeExpert,
    currentStreak,
    longestStreak,
    totalXP,
    reachedMilestones,
    completedEasy,
    completedMedium,
    completedHard,
    completedExpert,
    dailyStreak,
    updatedAt,
  };

  console.log('[MergeService] Stats merged:', {
    totalXP: { local: local.totalXP, cloud: cloud.totalXP, merged: totalXP },
    gamesWon: { local: local.gamesWon, cloud: cloud.gamesWon, merged: gamesWon },
  });

  return merged;
}

// ===== Merge Settings (Last-Write-Wins Strategy) =====

export function mergeSettings(local: GameSettings, cloud: GameSettings): GameSettings {
  console.log('[MergeService] Merging settings (Last-Write-Wins Strategy)');

  // Vergleiche Timestamps
  const useCloud = !isLocalNewer(local.updatedAt, cloud.updatedAt);

  const merged = useCloud ? cloud : local;

  console.log('[MergeService] Settings merged:', {
    localTimestamp: local.updatedAt,
    cloudTimestamp: cloud.updatedAt,
    useCloud,
  });

  return merged;
}

// ===== Merge ColorUnlock (Union Strategy) =====

export function mergeColorUnlock(local: ColorUnlockData, cloud: ColorUnlockData): ColorUnlockData {
  console.log('[MergeService] Merging colorUnlock (Union Strategy)');

  // Kombiniere alle freigeschalteten Farben (Union)
  const unlockedColors = Array.from(
    new Set([...(local.unlockedColors || []), ...(cloud.unlockedColors || [])])
  );

  // Selected Color: Nimm den von der neueren Version
  const useCloud = !isLocalNewer(local.updatedAt, cloud.updatedAt);
  const selectedColor = useCloud ? cloud.selectedColor : local.selectedColor;

  // Timestamp: Nimm neueren
  const updatedAt = Math.max(local.updatedAt || 0, cloud.updatedAt || 0);

  const merged: ColorUnlockData = {
    selectedColor,
    unlockedColors,
    updatedAt,
  };

  console.log('[MergeService] ColorUnlock merged:', {
    localColors: local.unlockedColors?.length,
    cloudColors: cloud.unlockedColors?.length,
    mergedColors: unlockedColors.length,
  });

  return merged;
}

// ===== Orchestrator =====

export interface MergeAllResult {
  stats: GameStats;
  settings: GameSettings;
  colorUnlock: ColorUnlockData;
  conflictsResolved: number;
}

/**
 * Merge alle Daten mit jeweiliger Strategie
 */
export function mergeAllData(
  localStats: GameStats,
  cloudStats: GameStats,
  localSettings: GameSettings,
  cloudSettings: GameSettings,
  localColorUnlock: ColorUnlockData,
  cloudColorUnlock: ColorUnlockData
): MergeAllResult {
  console.log('[MergeService] Starting complete merge...');

  let conflictsResolved = 0;

  // Merge Stats
  const stats = mergeStats(localStats, cloudStats);
  if (localStats.totalXP !== cloudStats.totalXP) conflictsResolved++;

  // Merge Settings
  const settings = mergeSettings(localSettings, cloudSettings);
  if (localSettings.updatedAt !== cloudSettings.updatedAt) conflictsResolved++;

  // Merge ColorUnlock
  const colorUnlock = mergeColorUnlock(localColorUnlock, cloudColorUnlock);
  if (localColorUnlock.unlockedColors.length !== cloudColorUnlock.unlockedColors.length)
    conflictsResolved++;

  console.log('[MergeService] ✅ Merge complete:', { conflictsResolved });

  return {
    stats,
    settings,
    colorUnlock,
    conflictsResolved,
  };
}

export default {
  mergeStats,
  mergeSettings,
  mergeColorUnlock,
  mergeAllData,
};
