// utils/cloudSync/firestoreSchema.ts
/**
 * Firestore Schema & Converter Functions
 *
 * Konvertiert zwischen lokalen AsyncStorage-Typen und Firestore-Typen
 * - AsyncStorage → Firestore (Upload)
 * - Firestore → AsyncStorage (Download)
 * - Validierung & Sanitization
 *
 * WICHTIG: Firestore unterstützt kein `Infinity` → muss als `null` oder große Zahl gespeichert werden
 */

import type {
  GameStats,
  GameSettings,
  DailyStreakData,
  ColorUnlockData,
  MonthlyPlayData,
} from '@/utils/storage';

import type {
  FirestoreStats,
  FirestoreSettings,
  FirestoreDailyStreak,
  FirestoreColorUnlock,
  FirestoreLandscapes,
  FirestoreLandscape,
  FirestoreProfile,
  FirestoreMonthlyPlayData,
  FirestoreUserData,
  ValidationResult,
} from './types';

import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

// ===== Constants =====

/**
 * Firestore verwendet null statt Infinity für nicht gesetzte Bestzeiten
 * Bei Download wird null zurück zu Infinity konvertiert
 */
const INFINITY_PLACEHOLDER = null;

/**
 * Max-Value für Firestore Numbers (statt Infinity)
 * Alternative zu null - kann für Sorting verwendet werden
 */
const MAX_NUMBER = 999999999;

// ===== Converter: GameStats ↔ FirestoreStats =====

/**
 * Konvertiert lokale GameStats → FirestoreStats (für Upload)
 */
export function gameStatsToFirestore(stats: GameStats): FirestoreStats {
  // DailyStreak konvertieren (falls vorhanden)
  const dailyStreak: FirestoreDailyStreak = stats.dailyStreak
    ? dailyStreakToFirestore(stats.dailyStreak)
    : {
        currentStreak: 0,
        longestDailyStreak: stats.longestStreak || 0,
        lastPlayedDate: '',
        firstLaunchDate: new Date().toISOString().split('T')[0],
        shieldsAvailable: 2,
        shieldsUsedThisWeek: 0,
        lastShieldResetDate: '',
        bonusShields: 0,
        totalShieldsUsed: 0,
        playHistory: {},
        totalDaysPlayed: 0,
        completedMonths: [],
        updatedAt: Date.now(),
      };

  return {
    gamesPlayed: stats.gamesPlayed || 0,
    gamesWon: stats.gamesWon || 0,

    // Infinity → null für Firestore
    bestTimeEasy: stats.bestTimeEasy === Infinity ? INFINITY_PLACEHOLDER : stats.bestTimeEasy,
    bestTimeMedium: stats.bestTimeMedium === Infinity ? INFINITY_PLACEHOLDER : stats.bestTimeMedium,
    bestTimeHard: stats.bestTimeHard === Infinity ? INFINITY_PLACEHOLDER : stats.bestTimeHard,
    bestTimeExpert: stats.bestTimeExpert === Infinity ? INFINITY_PLACEHOLDER : stats.bestTimeExpert,

    currentStreak: stats.currentStreak || 0,
    longestStreak: stats.longestStreak || 0,

    totalXP: stats.totalXP || 0,
    reachedMilestones: stats.reachedMilestones || [],

    completedEasy: stats.completedEasy || 0,
    completedMedium: stats.completedMedium || 0,
    completedHard: stats.completedHard || 0,
    completedExpert: stats.completedExpert || 0,

    dailyStreak: dailyStreak,

    updatedAt: stats.updatedAt || Date.now(),
  };
}

/**
 * Konvertiert FirestoreStats → lokale GameStats (für Download)
 */
export function firestoreToGameStats(firestoreStats: FirestoreStats): GameStats {
  return {
    gamesPlayed: firestoreStats.gamesPlayed || 0,
    gamesWon: firestoreStats.gamesWon || 0,

    // null → Infinity für lokale Verwendung
    bestTimeEasy:
      firestoreStats.bestTimeEasy === null || firestoreStats.bestTimeEasy === undefined
        ? Infinity
        : firestoreStats.bestTimeEasy,
    bestTimeMedium:
      firestoreStats.bestTimeMedium === null || firestoreStats.bestTimeMedium === undefined
        ? Infinity
        : firestoreStats.bestTimeMedium,
    bestTimeHard:
      firestoreStats.bestTimeHard === null || firestoreStats.bestTimeHard === undefined
        ? Infinity
        : firestoreStats.bestTimeHard,
    bestTimeExpert:
      firestoreStats.bestTimeExpert === null || firestoreStats.bestTimeExpert === undefined
        ? Infinity
        : firestoreStats.bestTimeExpert,

    currentStreak: firestoreStats.currentStreak || 0,
    longestStreak: firestoreStats.longestStreak || 0,

    totalXP: firestoreStats.totalXP || 0,
    reachedMilestones: firestoreStats.reachedMilestones || [],

    completedEasy: firestoreStats.completedEasy || 0,
    completedMedium: firestoreStats.completedMedium || 0,
    completedHard: firestoreStats.completedHard || 0,
    completedExpert: firestoreStats.completedExpert || 0,

    dailyStreak: firestoreStats.dailyStreak
      ? firestoreToDailyStreak(firestoreStats.dailyStreak)
      : undefined,

    updatedAt: firestoreStats.updatedAt || Date.now(),
  };
}

// ===== Converter: DailyStreakData ↔ FirestoreDailyStreak =====

/**
 * Konvertiert lokale DailyStreakData → FirestoreDailyStreak
 */
export function dailyStreakToFirestore(streak: DailyStreakData): FirestoreDailyStreak {
  // playHistory konvertieren
  const playHistory: { [yearMonth: string]: FirestoreMonthlyPlayData } = {};
  Object.entries(streak.playHistory || {}).forEach(([key, value]) => {
    playHistory[key] = {
      days: value.days || [],
      shieldDays: value.shieldDays || [],
    };
  });

  return {
    currentStreak: streak.currentStreak || 0,
    longestDailyStreak: streak.longestDailyStreak || 0,
    lastPlayedDate: streak.lastPlayedDate || '',
    firstLaunchDate: streak.firstLaunchDate || new Date().toISOString().split('T')[0],
    shieldsAvailable: streak.shieldsAvailable || 2,
    shieldsUsedThisWeek: streak.shieldsUsedThisWeek || 0,
    lastShieldResetDate: streak.lastShieldResetDate || '',
    bonusShields: streak.bonusShields || 0,
    totalShieldsUsed: streak.totalShieldsUsed || 0,
    playHistory: playHistory,
    totalDaysPlayed: streak.totalDaysPlayed || 0,
    completedMonths: streak.completedMonths || [],
    updatedAt: streak.updatedAt || Date.now(),
  };
}

/**
 * Konvertiert FirestoreDailyStreak → lokale DailyStreakData
 */
export function firestoreToDailyStreak(firestoreStreak: FirestoreDailyStreak): DailyStreakData {
  // playHistory konvertieren
  const playHistory: { [yearMonth: string]: MonthlyPlayData } = {};
  Object.entries(firestoreStreak.playHistory || {}).forEach(([key, value]) => {
    playHistory[key] = {
      days: value.days || [],
      shieldDays: value.shieldDays || [],
    };
  });

  return {
    currentStreak: firestoreStreak.currentStreak || 0,
    longestDailyStreak: firestoreStreak.longestDailyStreak || 0,
    lastPlayedDate: firestoreStreak.lastPlayedDate || '',
    firstLaunchDate:
      firestoreStreak.firstLaunchDate || new Date().toISOString().split('T')[0],
    shieldsAvailable: firestoreStreak.shieldsAvailable || 2,
    shieldsUsedThisWeek: firestoreStreak.shieldsUsedThisWeek || 0,
    lastShieldResetDate: firestoreStreak.lastShieldResetDate || '',
    bonusShields: firestoreStreak.bonusShields || 0,
    totalShieldsUsed: firestoreStreak.totalShieldsUsed || 0,
    playHistory: playHistory,
    totalDaysPlayed: firestoreStreak.totalDaysPlayed || 0,
    completedMonths: firestoreStreak.completedMonths || [],
    updatedAt: firestoreStreak.updatedAt || Date.now(),
  };
}

// ===== Converter: GameSettings ↔ FirestoreSettings =====

/**
 * Konvertiert lokale GameSettings → FirestoreSettings
 */
export function gameSettingsToFirestore(settings: GameSettings): FirestoreSettings {
  return {
    highlightRelatedCells: settings.highlightRelatedCells ?? true,
    showMistakes: settings.showMistakes ?? true,
    highlightSameValues: settings.highlightSameValues ?? true,
    autoNotes: settings.autoNotes ?? false,
    darkMode: settings.darkMode || 'dark',
    language: settings.language || 'de',
    vibration: settings.vibration ?? true,
    soundEffects: settings.soundEffects ?? true,
    backgroundMusic: settings.backgroundMusic ?? false,
    updatedAt: settings.updatedAt || Date.now(),
  };
}

/**
 * Konvertiert FirestoreSettings → lokale GameSettings
 */
export function firestoreToGameSettings(firestoreSettings: FirestoreSettings): GameSettings {
  return {
    highlightRelatedCells: firestoreSettings.highlightRelatedCells ?? true,
    showMistakes: firestoreSettings.showMistakes ?? true,
    highlightSameValues: firestoreSettings.highlightSameValues ?? true,
    autoNotes: firestoreSettings.autoNotes ?? false,
    darkMode: firestoreSettings.darkMode || 'dark',
    language: firestoreSettings.language || 'de',
    vibration: firestoreSettings.vibration ?? true,
    soundEffects: firestoreSettings.soundEffects ?? true,
    backgroundMusic: firestoreSettings.backgroundMusic ?? false,
    updatedAt: firestoreSettings.updatedAt || Date.now(),
  };
}

// ===== Converter: ColorUnlockData ↔ FirestoreColorUnlock =====

/**
 * Konvertiert lokale ColorUnlockData → FirestoreColorUnlock
 */
export function colorUnlockToFirestore(colorData: ColorUnlockData): FirestoreColorUnlock {
  return {
    selectedColor: colorData.selectedColor || '#4285F4',
    unlockedColors: colorData.unlockedColors || ['#4285F4'],
    updatedAt: colorData.updatedAt || Date.now(),
  };
}

/**
 * Konvertiert FirestoreColorUnlock → lokale ColorUnlockData
 */
export function firestoreToColorUnlock(firestoreColor: FirestoreColorUnlock): ColorUnlockData {
  return {
    selectedColor: firestoreColor.selectedColor || '#4285F4',
    unlockedColors: firestoreColor.unlockedColors || ['#4285F4'],
    updatedAt: firestoreColor.updatedAt || Date.now(),
  };
}

// ===== Converter: User Profile =====

/**
 * Erstellt FirestoreProfile aus Firebase User (für Erstregistrierung)
 */
export function createProfileFromFirebaseUser(
  user: FirebaseAuthTypes.User
): FirestoreProfile {
  return {
    displayName: user.displayName || null,
    email: user.email || null,
    avatarUrl: null, // Später: Cloud Storage URL
    photoURL: user.photoURL || null,
    title: null, // Wird später aus Stats berechnet
    titleLevelIndex: null, // Wird später aus Stats berechnet
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ===== Validation =====

/**
 * Validiert GameStats vor Upload
 */
export function validateGameStats(stats: GameStats): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Prüfe Basis-Werte
  if (stats.gamesPlayed < 0) errors.push('gamesPlayed cannot be negative');
  if (stats.gamesWon < 0) errors.push('gamesWon cannot be negative');
  if (stats.gamesWon > stats.gamesPlayed)
    errors.push('gamesWon cannot exceed gamesPlayed');
  if (stats.totalXP < 0) errors.push('totalXP cannot be negative');

  // Prüfe completedGames
  if (stats.completedEasy < 0) errors.push('completedEasy cannot be negative');
  if (stats.completedMedium < 0) errors.push('completedMedium cannot be negative');
  if (stats.completedHard < 0) errors.push('completedHard cannot be negative');
  if (stats.completedExpert < 0) errors.push('completedExpert cannot be negative');

  // Warnings
  if (stats.totalXP > 1000000) warnings.push('Unusually high XP value');
  if (stats.gamesPlayed > 100000) warnings.push('Unusually high gamesPlayed value');

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validiert GameSettings vor Upload
 */
export function validateGameSettings(settings: GameSettings): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Prüfe darkMode
  if (settings.darkMode !== 'light' && settings.darkMode !== 'dark') {
    errors.push('darkMode must be "light" or "dark"');
  }

  // Prüfe language
  if (!['de', 'en', 'hi'].includes(settings.language)) {
    errors.push('language must be "de", "en", or "hi"');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validiert ColorUnlockData vor Upload
 */
export function validateColorUnlock(colorData: ColorUnlockData): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Prüfe selectedColor Format (Hex)
  const hexColorRegex = /^#[0-9A-F]{6}$/i;
  if (!hexColorRegex.test(colorData.selectedColor)) {
    errors.push('selectedColor must be a valid hex color (#RRGGBB)');
  }

  // Prüfe unlockedColors
  if (colorData.unlockedColors.length === 0) {
    errors.push('At least one color must be unlocked');
  }

  colorData.unlockedColors.forEach((color, index) => {
    if (!hexColorRegex.test(color)) {
      errors.push(`unlockedColors[${index}] is not a valid hex color`);
    }
  });

  // Prüfe ob selectedColor in unlockedColors ist
  if (!colorData.unlockedColors.includes(colorData.selectedColor)) {
    errors.push('selectedColor must be in unlockedColors array');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// ===== Sanitization =====

/**
 * Entfernt ungültige/unsichere Daten aus GameStats
 */
export function sanitizeGameStats(stats: GameStats): GameStats {
  return {
    ...stats,
    gamesPlayed: Math.max(0, stats.gamesPlayed || 0),
    gamesWon: Math.max(0, Math.min(stats.gamesWon || 0, stats.gamesPlayed || 0)),
    totalXP: Math.max(0, stats.totalXP || 0),
    completedEasy: Math.max(0, stats.completedEasy || 0),
    completedMedium: Math.max(0, stats.completedMedium || 0),
    completedHard: Math.max(0, stats.completedHard || 0),
    completedExpert: Math.max(0, stats.completedExpert || 0),
    reachedMilestones: Array.isArray(stats.reachedMilestones) ? stats.reachedMilestones : [],
  };
}

// ===== Helper Functions =====

/**
 * Prüft ob ein Timestamp gültig ist
 */
export function isValidTimestamp(timestamp: number | undefined | null): boolean {
  if (timestamp === undefined || timestamp === null) return false;
  if (typeof timestamp !== 'number') return false;
  if (timestamp < 0) return false;

  // Timestamp sollte zwischen 2020 und 2100 liegen
  const minTimestamp = new Date('2020-01-01').getTime();
  const maxTimestamp = new Date('2100-01-01').getTime();

  return timestamp >= minTimestamp && timestamp <= maxTimestamp;
}

/**
 * Gibt den aktuelleren Timestamp zurück (für Last-Write-Wins)
 */
export function getNewerTimestamp(
  timestamp1: number | undefined,
  timestamp2: number | undefined
): number {
  const ts1 = timestamp1 || 0;
  const ts2 = timestamp2 || 0;
  return Math.max(ts1, ts2);
}

/**
 * Prüft ob Local neuer ist als Cloud
 */
export function isLocalNewer(
  localTimestamp: number | undefined,
  cloudTimestamp: number | undefined
): boolean {
  const local = localTimestamp || 0;
  const cloud = cloudTimestamp || 0;
  return local > cloud;
}

// ===== Export All =====

export default {
  // Stats Converters
  gameStatsToFirestore,
  firestoreToGameStats,

  // Daily Streak Converters
  dailyStreakToFirestore,
  firestoreToDailyStreak,

  // Settings Converters
  gameSettingsToFirestore,
  firestoreToGameSettings,

  // Color Unlock Converters
  colorUnlockToFirestore,
  firestoreToColorUnlock,

  // Profile Converters
  createProfileFromFirebaseUser,

  // Validation
  validateGameStats,
  validateGameSettings,
  validateColorUnlock,

  // Sanitization
  sanitizeGameStats,

  // Helpers
  isValidTimestamp,
  getNewerTimestamp,
  isLocalNewer,
};
