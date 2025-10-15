// utils/cloudSync/types.ts
/**
 * TypeScript Type Definitions für Firestore Cloud Sync
 *
 * Diese Typen repräsentieren die Firestore-Dokumente und unterscheiden sich
 * von den lokalen AsyncStorage-Typen durch das zusätzliche `updatedAt` Feld.
 *
 * Das `updatedAt` Feld wird für Timestamp-basierte Conflict Resolution verwendet:
 * - Last-Write-Wins für Settings
 * - Max-Value + Timestamp für Stats
 * - Cloud-Wins für Security-Critical Data (DailyStreak)
 */

import { Difficulty } from '@/utils/sudoku';
import type {
  GameStats,
  GameSettings,
  DailyStreakData,
  MonthlyPlayData,
  ColorUnlockData,
} from '@/utils/storage';

// ===== Firestore Timestamp Type =====

/**
 * Firestore Timestamp Format
 * - Stored as number (milliseconds since epoch)
 * - Compatible with Date.now()
 * - Used for conflict resolution
 */
export type FirestoreTimestamp = number;

// ===== User Profile =====

/**
 * User Profile (Firestore Document)
 * Collection: users/{userId}/profile
 *
 * Enthält öffentliche User-Informationen
 */
export interface FirestoreProfile {
  displayName: string | null;
  email: string | null;
  avatarUrl: string | null;
  photoURL: string | null; // Google/Apple Profile Photo
  title: string | null; // Zen Level Title (e.g., "Mindful Beginner")
  titleLevelIndex: number | null; // Level Index (0-24)
  createdAt: FirestoreTimestamp; // Account creation date
  updatedAt: FirestoreTimestamp; // Last profile update
}

// ===== Game Statistics =====

/**
 * Game Statistics (Firestore Document)
 * Collection: users/{userId}/stats
 *
 * Synchronisiert mit AsyncStorage GameStats + DailyStreak
 */
export interface FirestoreStats {
  // Core Stats
  gamesPlayed: number;
  gamesWon: number;

  // Best Times
  bestTimeEasy: number;
  bestTimeMedium: number;
  bestTimeHard: number;
  bestTimeExpert: number;

  // DEPRECATED: Win Streak (preserved for backward compatibility)
  currentStreak: number;
  longestStreak: number;

  // XP & Progression
  totalXP: number;
  reachedMilestones: number[];

  // Completed Games by Difficulty
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
  completedExpert: number;

  // Daily Streak (nested structure)
  dailyStreak: FirestoreDailyStreak;

  // Timestamp for conflict resolution
  updatedAt: FirestoreTimestamp;
}

/**
 * Daily Streak Data (Nested in FirestoreStats)
 *
 * Cloud-Wins Strategy: Cloud immer bevorzugt (gegen Manipulation)
 */
export interface FirestoreDailyStreak {
  // Streak Status
  currentStreak: number;
  longestDailyStreak: number;
  lastPlayedDate: string; // ISO date (YYYY-MM-DD)
  firstLaunchDate: string; // ISO date (YYYY-MM-DD)

  // Shield Management
  shieldsAvailable: number;
  shieldsUsedThisWeek: number;
  lastShieldResetDate: string; // ISO date (YYYY-MM-DD)
  bonusShields: number;
  totalShieldsUsed: number;

  // Play History (last 12 months)
  playHistory: {
    [yearMonth: string]: FirestoreMonthlyPlayData; // Format: "2025-01"
  };

  // Statistics
  totalDaysPlayed: number;
  completedMonths: string[]; // ["2024-12", "2025-01"]

  // Timestamp
  updatedAt: FirestoreTimestamp;
}

/**
 * Monthly Play Data (Nested in DailyStreak.playHistory)
 */
export interface FirestoreMonthlyPlayData {
  days: number[]; // [1, 3, 5, ...]
  shieldDays: number[]; // [2, 4]
}

// ===== Game Settings =====

/**
 * Game Settings (Firestore Document)
 * Collection: users/{userId}/settings
 *
 * Last-Write-Wins Strategy: Timestamp bestimmt welche Settings verwendet werden
 */
export interface FirestoreSettings {
  // Game Assists
  highlightRelatedCells: boolean;
  showMistakes: boolean;
  highlightSameValues: boolean;
  autoNotes: boolean;

  // UI Preferences
  darkMode: 'light' | 'dark';
  language: 'de' | 'en' | 'hi';

  // Audio/Haptics
  vibration: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;

  // Timestamp
  updatedAt: FirestoreTimestamp;
}

// ===== Landscape Gallery =====

/**
 * Landscape Collection (Firestore Document)
 * Collection: users/{userId}/landscapes
 *
 * Synchronisiert mit Gallery Landscape Storage
 * Union Strategy: Merge unlocked segments from both devices
 */
export interface FirestoreLandscapes {
  currentImageId: string;
  favorites: string[];
  lastUsedFavoriteIndex: number;
  lastChangedDate: string; // ISO date
  landscapes: {
    [landscapeId: string]: FirestoreLandscape;
  };
  updatedAt: FirestoreTimestamp;
}

/**
 * Individual Landscape (Nested in FirestoreLandscapes)
 */
export interface FirestoreLandscape {
  id: string;
  unlockedSegments: number;
  isFavorite: boolean;
  lastUnlocked: string; // ISO date
}

// ===== Color Unlock =====

/**
 * Color Unlock Data (Firestore Document)
 * Collection: users/{userId}/colorUnlock
 *
 * Union Strategy: Merge unlocked colors from both devices
 * Last-Write-Wins für selectedColor
 */
export interface FirestoreColorUnlock {
  selectedColor: string; // Hex color
  unlockedColors: string[]; // Array of hex colors
  updatedAt: FirestoreTimestamp;
}

// ===== Complete User Data =====

/**
 * Complete User Data Structure
 * Repräsentiert alle Firestore-Dokumente eines Users
 *
 * Used for:
 * - Complete data upload (first registration)
 * - Complete data download (device restore)
 * - Full sync operations
 */
export interface FirestoreUserData {
  profile: FirestoreProfile;
  stats: FirestoreStats;
  settings: FirestoreSettings;
  landscapes: FirestoreLandscapes;
  colorUnlock: FirestoreColorUnlock;
}

// ===== Sync Status =====

/**
 * Sync Status
 * Beschreibt den aktuellen Sync-Zustand
 */
export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Sync Result
 * Ergebnis einer Sync-Operation
 */
export interface SyncResult {
  success: boolean;
  timestamp: FirestoreTimestamp;
  changesDetected: boolean;
  error?: Error;
  details?: {
    statsChanged?: boolean;
    settingsChanged?: boolean;
    landscapesChanged?: boolean;
    colorUnlockChanged?: boolean;
  };
}

/**
 * Conflict Resolution Strategy
 */
export type ConflictStrategy =
  | 'last-write-wins' // Timestamp bestimmt Gewinner (Settings)
  | 'max-value' // Höherer Wert gewinnt (XP, completedGames)
  | 'min-value' // Niedrigerer Wert gewinnt (bestTime)
  | 'cloud-wins' // Cloud immer bevorzugt (DailyStreak)
  | 'union'; // Merge beide Sets (unlockedColors, unlockedSegments)

/**
 * Merge Result
 * Ergebnis einer Merge-Operation
 */
export interface MergeResult<T> {
  merged: T;
  source: 'local' | 'cloud' | 'merged';
  conflictsResolved: number;
  strategy: ConflictStrategy;
}

// ===== Conversion Helpers Types =====

/**
 * Local to Firestore Conversion Options
 */
export interface ConversionOptions {
  includeTimestamp?: boolean; // Add updatedAt timestamp
  validateData?: boolean; // Validate before conversion
  sanitize?: boolean; // Remove invalid/unsafe data
}

/**
 * Validation Result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// ===== Export All =====

export type {
  // Re-export original types from storage.ts for convenience
  GameStats,
  GameSettings,
  DailyStreakData,
  MonthlyPlayData,
  ColorUnlockData,
  Difficulty,
};
