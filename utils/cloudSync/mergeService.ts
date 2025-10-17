// utils/cloudSync/mergeService.ts
/**
 * Merge Service - Conflict Resolution
 *
 * Merget lokale und Cloud-Daten mit verschiedenen Strategien:
 * - Stats: Max-Value (höhere Werte gewinnen)
 * - Settings: Last-Write-Wins (neuerer Timestamp gewinnt)
 * - ColorUnlock: Union (alle freigeschalteten Farben kombinieren)
 * - DailyStreak: Smart-Merge (Union playHistory, Max rewards, Last-Write-Wins für Live-Daten)
 */

import type { GameStats, GameSettings, ColorUnlockData, DailyStreakData, MonthlyPlayData } from '@/utils/storage';
import type { LandscapeCollection } from '@/screens/Gallery/utils/landscapes/storage';
import type { UserProfile } from '@/utils/profileStorage';
import { isLocalNewer, firestoreToLandscapes, landscapesToFirestore } from './firestoreSchema';

// ===== Helper: Merge Play History (Union Strategy) =====

/**
 * Merge Monthly Play History from two devices
 * Union-Strategy: Kombiniert alle gespielten Tage von beiden Devices
 */
function mergePlayHistory(
  localHistory: { [yearMonth: string]: MonthlyPlayData } | undefined,
  cloudHistory: { [yearMonth: string]: MonthlyPlayData } | undefined
): { [yearMonth: string]: MonthlyPlayData } {
  const mergedHistory: { [yearMonth: string]: MonthlyPlayData } = {};

  // Sammle alle Monate (Union)
  const allMonths = new Set([
    ...Object.keys(localHistory || {}),
    ...Object.keys(cloudHistory || {}),
  ]);

  allMonths.forEach(yearMonth => {
    const localMonth = localHistory?.[yearMonth];
    const cloudMonth = cloudHistory?.[yearMonth];

    if (localMonth && cloudMonth) {
      // Beide Devices haben Daten für diesen Monat → Merge (Union)
      mergedHistory[yearMonth] = {
        days: Array.from(new Set([...localMonth.days, ...cloudMonth.days])).sort((a, b) => a - b),
        shieldDays: Array.from(new Set([...localMonth.shieldDays, ...cloudMonth.shieldDays])).sort(
          (a, b) => a - b
        ),
      };
    } else if (localMonth) {
      // Nur Local hat Daten
      mergedHistory[yearMonth] = { ...localMonth };
    } else if (cloudMonth) {
      // Nur Cloud hat Daten
      mergedHistory[yearMonth] = { ...cloudMonth };
    }
  });

  return mergedHistory;
}

// ===== Merge Daily Streak (Smart-Merge Strategy) =====

/**
 * Merge Daily Streak Data mit Smart-Merge Strategy
 *
 * Merge-Strategie:
 * - playHistory: Union (kombiniere alle gespielten Tage von beiden Devices)
 * - bonusShields: Max (höhere Anzahl gewinnt, da Rewards)
 * - longestDailyStreak: Max (historischer Rekord)
 * - currentStreak, lastPlayedDate, shieldsAvailable: Last-Write-Wins (basierend auf lastPlayedDate)
 * - totalDaysPlayed: Berechnet aus merged playHistory
 * - completedMonths: Union (alle vollständig abgeschlossenen Monate)
 */
export function mergeDailyStreak(
  local: DailyStreakData | undefined,
  cloud: DailyStreakData | undefined
): DailyStreakData | undefined {
  console.log('[MergeService] Merging dailyStreak (Smart-Merge Strategy)');

  // Falls beide undefined, return undefined
  if (!local && !cloud) {
    return undefined;
  }

  // Falls nur eine Seite Daten hat, nutze diese
  if (!local && cloud) {
    console.log('[MergeService] Using cloud dailyStreak (no local)');
    return cloud;
  }

  if (local && !cloud) {
    console.log('[MergeService] Using local dailyStreak (no cloud)');
    return local;
  }

  // Beide existieren → Intelligent Merge
  if (!local || !cloud) {
    // TypeScript guard (sollte nie passieren)
    return local || cloud;
  }

  // 1. Merge playHistory (Union - alle gespielten Tage kombinieren)
  const mergedPlayHistory = mergePlayHistory(local.playHistory, cloud.playHistory);

  // 2. Berechne totalDaysPlayed aus merged playHistory
  const allDaysPlayed = new Set<string>();
  Object.entries(mergedPlayHistory).forEach(([yearMonth, monthData]) => {
    monthData.days.forEach(day => {
      allDaysPlayed.add(`${yearMonth}-${String(day).padStart(2, '0')}`);
    });
  });
  const totalDaysPlayed = allDaysPlayed.size;

  // 3. Merge completedMonths (Union)
  const completedMonths = Array.from(
    new Set([...(local.completedMonths || []), ...(cloud.completedMonths || [])])
  ).sort();

  // 4. bonusShields: Max (höhere Anzahl gewinnt)
  const bonusShields = Math.max(local.bonusShields || 0, cloud.bonusShields || 0);

  // 5. longestDailyStreak: Max (historischer Rekord)
  const longestDailyStreak = Math.max(
    local.longestDailyStreak || 0,
    cloud.longestDailyStreak || 0
  );

  // 6. totalShieldsUsed: Max (höhere Anzahl gewinnt, da kumulative Statistik)
  const totalShieldsUsed = Math.max(local.totalShieldsUsed || 0, cloud.totalShieldsUsed || 0);

  // 7. Conflict Resolution für Live-Daten: Last-Write-Wins (basierend auf lastPlayedDate)
  //    Device mit neuerem lastPlayedDate bestimmt: currentStreak, shieldsAvailable, lastShieldResetDate, shieldsUsedThisWeek
  const useCloud =
    cloud.lastPlayedDate && local.lastPlayedDate
      ? new Date(cloud.lastPlayedDate) >= new Date(local.lastPlayedDate)
      : cloud.lastPlayedDate
        ? true
        : false;

  const newerDevice = useCloud ? cloud : local;

  // 8. firstLaunchDate: Nimm früheres Datum (falls beide vorhanden)
  let firstLaunchDate = local.firstLaunchDate || cloud.firstLaunchDate || '';
  if (local.firstLaunchDate && cloud.firstLaunchDate) {
    firstLaunchDate =
      new Date(local.firstLaunchDate) < new Date(cloud.firstLaunchDate)
        ? local.firstLaunchDate
        : cloud.firstLaunchDate;
  }

  // 9. Merged Result
  const merged: DailyStreakData = {
    // Streak Status - von neuerem Device
    currentStreak: newerDevice.currentStreak,
    longestDailyStreak, // Max
    lastPlayedDate: newerDevice.lastPlayedDate,
    firstLaunchDate,

    // Shield Management
    shieldsAvailable: newerDevice.shieldsAvailable,
    shieldsUsedThisWeek: newerDevice.shieldsUsedThisWeek,
    lastShieldResetDate: newerDevice.lastShieldResetDate,
    bonusShields, // Max
    totalShieldsUsed, // Max

    // Kalender-Daten - Union
    playHistory: mergedPlayHistory,

    // Statistiken
    totalDaysPlayed, // Berechnet aus merged playHistory
    completedMonths, // Union

    // Timestamp - neuerer Wert
    updatedAt: Math.max(local.updatedAt || 0, cloud.updatedAt || 0),
  };

  console.log('[MergeService] DailyStreak merged:', {
    localLastPlayed: local.lastPlayedDate,
    cloudLastPlayed: cloud.lastPlayedDate,
    useCloud,
    mergedStreak: merged.currentStreak,
    mergedTotalDays: merged.totalDaysPlayed,
    localTotalDays: local.totalDaysPlayed,
    cloudTotalDays: cloud.totalDaysPlayed,
  });

  return merged;
}

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

  // DailyStreak: Smart-Merge (Union + Intelligent Conflict Resolution)
  const dailyStreak = mergeDailyStreak(local.dailyStreak, cloud.dailyStreak);

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

// ===== Merge Landscapes (Union Strategy) =====

/**
 * Merge Landscape Collections
 * Union-Strategy: Nimm die höchste Anzahl freigeschalteter Segmente von beiden Devices
 * Favoriten werden kombiniert
 */
export function mergeLandscapes(
  local: LandscapeCollection,
  cloud: LandscapeCollection
): LandscapeCollection {
  console.log('[MergeService] Merging landscapes (Union Strategy)');

  const mergedLandscapes = { ...local.landscapes };

  // Merge jede Landscape: Nimm höhere unlockedSegments-Zahl
  Object.entries(cloud.landscapes).forEach(([id, cloudLandscape]) => {
    const localLandscape = mergedLandscapes[id];

    if (localLandscape && cloudLandscape) {
      const localProgress = localLandscape.progress || 0;
      const cloudProgress = cloudLandscape.progress || 0;
      const maxProgress = Math.max(localProgress, cloudProgress);

      // Update segments basierend auf dem höchsten Fortschritt
      const updatedSegments = localLandscape.segments.map((segment, index) => ({
        ...segment,
        isUnlocked: index < maxProgress || segment.isUnlocked,
        unlockedAt:
          index < maxProgress && !segment.unlockedAt
            ? cloudLandscape.segments[index]?.unlockedAt || new Date().toISOString()
            : segment.unlockedAt,
      }));

      mergedLandscapes[id] = {
        ...localLandscape,
        segments: updatedSegments,
        progress: maxProgress,
        isComplete: maxProgress >= 9,
        isFavorite: localLandscape.isFavorite || cloudLandscape.isFavorite, // Union
        completedAt:
          maxProgress >= 9
            ? localLandscape.completedAt || cloudLandscape.completedAt
            : undefined,
      };
    }
  });

  // Favorites: Union (kombiniere beide Listen)
  const allFavorites = Array.from(
    new Set([...(local.favorites || []), ...(cloud.favorites || [])])
  );

  // currentImageId: Last-Write-Wins basierend auf lastChangedDate
  const useCloudCurrentImage =
    new Date(cloud.lastChangedDate || 0) > new Date(local.lastChangedDate || 0);
  const currentImageId = useCloudCurrentImage ? cloud.currentImageId : local.currentImageId;

  // lastUsedFavoriteIndex: Nimm von neuester lastChangedDate
  const lastUsedFavoriteIndex = useCloudCurrentImage
    ? cloud.lastUsedFavoriteIndex
    : local.lastUsedFavoriteIndex;

  // lastChangedDate: Nimm neueste
  const lastChangedDate =
    new Date(cloud.lastChangedDate || 0) > new Date(local.lastChangedDate || 0)
      ? cloud.lastChangedDate
      : local.lastChangedDate;

  const merged: LandscapeCollection = {
    landscapes: mergedLandscapes,
    favorites: allFavorites,
    currentImageId,
    lastUsedFavoriteIndex,
    lastChangedDate,
    version: local.version, // Version bleibt lokal
  };

  console.log('[MergeService] Landscapes merged:', {
    localFavorites: local.favorites?.length || 0,
    cloudFavorites: cloud.favorites?.length || 0,
    mergedFavorites: allFavorites.length,
  });

  return merged;
}

// ===== Merge Profile (Last-Write-Wins Strategy) =====

/**
 * Merge User Profile
 * Last-Write-Wins: Neueres Profil gewinnt (basierend auf Manual-Edit Zeitstempel)
 *
 * HINWEIS: Da UserProfile kein updatedAt Feld hat, nehmen wir an, dass Cloud immer neuer ist
 * bei Re-Login, und Local gewinnt bei erster Registrierung
 */
export function mergeProfile(
  local: UserProfile | null,
  cloud: UserProfile | null
): UserProfile | null {
  console.log('[MergeService] Merging profile');

  if (!local && !cloud) {
    return null;
  }

  if (!local) {
    console.log('[MergeService] Using cloud profile (no local)');
    return cloud;
  }

  if (!cloud) {
    console.log('[MergeService] Using local profile (no cloud)');
    return local;
  }

  // Wenn beide existieren: Prefer Cloud (typischerweise neuer bei Device-Wechsel)
  // Außer Local hat nicht-Default-Werte (bedeutet User hat lokal geändert)
  const hasLocalChanges = local.name !== 'User' || local.avatarUri !== null;

  if (hasLocalChanges) {
    console.log('[MergeService] Using local profile (has local changes)');
    return local;
  }

  console.log('[MergeService] Using cloud profile (default)');
  return cloud;
}

// ===== Orchestrator =====

export interface MergeAllResult {
  stats: GameStats;
  settings: GameSettings;
  colorUnlock: ColorUnlockData;
  landscapes: LandscapeCollection | null;
  profile: UserProfile | null;
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
  cloudColorUnlock: ColorUnlockData,
  localLandscapes?: LandscapeCollection | null,
  cloudLandscapes?: LandscapeCollection | null,
  localProfile?: UserProfile | null,
  cloudProfile?: UserProfile | null
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

  // Merge Landscapes (optional)
  let landscapes: LandscapeCollection | null = null;
  if (localLandscapes && cloudLandscapes) {
    landscapes = mergeLandscapes(localLandscapes, cloudLandscapes);
    if (localLandscapes.favorites.length !== cloudLandscapes.favorites.length)
      conflictsResolved++;
  } else {
    landscapes = localLandscapes || cloudLandscapes || null;
  }

  // Merge Profile (optional)
  const profile = mergeProfile(localProfile || null, cloudProfile || null);

  console.log('[MergeService] ✅ Merge complete:', { conflictsResolved });

  return {
    stats,
    settings,
    colorUnlock,
    landscapes,
    profile,
    conflictsResolved,
  };
}

export default {
  mergeStats,
  mergeSettings,
  mergeColorUnlock,
  mergeLandscapes,
  mergeProfile,
  mergeAllData,
};
