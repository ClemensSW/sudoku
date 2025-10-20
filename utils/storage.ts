// utils/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Difficulty } from "@/utils/sudoku";
// XP-Berechnung importieren
import { calculateXpGain } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
// Landschafts-Integration
import {
  unlockNextSegment,
  saveUnlockEvent,
} from "@/screens/Gallery/utils/landscapes/storage";
// Supporter EP-Multiplikator
import { calculateEpWithBonus } from "@/modules/game/epCalculator";
// PERFORMANCE: In-Memory Cache für AsyncStorage
import { storageCache, withCache } from "@/utils/storage/cache";
// Cloud Sync: Dirty Flag Tracking
import { setDirty } from "@/utils/cloudSync/dirtyFlags";

// Schlüssel für den Storage
const KEYS = {
  GAME_STATE: "@sudoku/game_state",
  STATISTICS: "@sudoku/statistics",
  SETTINGS: "@sudoku/settings",
  PAUSED_GAME: "@sudoku/paused_game",
  COLOR_UNLOCK: "@sudoku/color_unlock",
  SETTINGS_TRACKING: "@sudoku/settings_tracking",
};

// Spielzustand Typ
export type GameState = {
  puzzle: number[][];
  initialPuzzle: number[][];
  difficulty: "easy" | "medium" | "hard";
  timeElapsed: number;
  lastPlayed: string;
  completed: boolean;
};

// Pausierter Spielstand Typ (für Einzelspieler-Modus)
export type PausedGameState = {
  board: any[]; // SudokuBoard type from sudoku utils
  solution: number[][];
  difficulty: Difficulty;
  gameTime: number;
  hintsRemaining: number;
  errorsRemaining: number;
  autoNotesUsed: boolean;
  pausedAt: string; // ISO timestamp
};

// Spielstatistiken Typ - mit totalXP, reachedMilestones und completedByDifficulty ergänzt
export type GameStats = {
  gamesPlayed: number;
  gamesWon: number;
  bestTimeEasy: number;
  bestTimeMedium: number;
  bestTimeHard: number;
  bestTimeExpert: number;

  // DEPRECATED: Win-Streak (wird durch dailyStreak ersetzt)
  // Behalten für Rückwärtskompatibilität
  currentStreak: number;
  longestStreak: number;

  totalXP: number;
  reachedMilestones: number[];

  // NEU: Speicherung der gelösten Sudokus pro Schwierigkeitsgrad
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
  completedExpert: number;

  // NEU: Daily Streak System
  dailyStreak?: DailyStreakData; // Optional für Migration

  // Cloud Sync: Timestamp für Conflict Resolution
  updatedAt?: number; // Timestamp in milliseconds (Date.now())
};

// Einstellungen Typ
export type GameSettings = {
  highlightRelatedCells: boolean;
  showMistakes: boolean;
  highlightSameValues: boolean;
  autoNotes: boolean;
  darkMode: "light" | "dark";
  vibration: boolean;
  soundEffects: boolean;
  backgroundMusic: boolean;
  language: "de" | "en";

  // Cloud Sync: Timestamp für Conflict Resolution
  updatedAt?: number; // Timestamp in milliseconds (Date.now())
};

// Settings Modification Tracking - trackt ob User Settings manuell verändert hat
export type SettingsModificationTracking = {
  highlightSameValuesModified: boolean;
  highlightRelatedCellsModified: boolean;
  showMistakesModified: boolean;
};

// Farbauswahl Typ
export type ColorUnlockData = {
  selectedColor: string; // Aktuell ausgewählte Farbe
  unlockedColors: string[]; // Freigeschaltete Farben

  // Cloud Sync: Timestamp für Conflict Resolution
  updatedAt?: number; // Timestamp in milliseconds (Date.now())
};

// ===== Daily Streak System =====

// Monatliche Play-History für Kalender
export type MonthlyPlayData = {
  days: number[];                       // Array von gespielten Tagen [1, 3, 5, ...]
  shieldDays: number[];                 // Tage an denen Schutzschild eingesetzt wurde
};

// Daily Streak Datenstruktur
export type DailyStreakData = {
  // Streak Status
  currentStreak: number;                // Aktueller Streak-Counter
  longestDailyStreak: number;           // Historischer Rekord (Daily Streak)
  lastPlayedDate: string;               // ISO date (YYYY-MM-DD)
  firstLaunchDate: string;              // Erstes App-Start-Datum (ISO date YYYY-MM-DD)

  // Schutzschild (Streak Freeze) Management
  shieldsAvailable: number;             // Verfügbare reguläre Schutzschilder (2/3)
  shieldsUsedThisWeek: number;          // Verbrauchte Schutzschilder diese Woche
  lastShieldResetDate: string;          // Letzter Montag (wöchentlicher Reset)
  bonusShields: number;                 // Lifetime Bonus-Schutzschilder (aus Rewards)
  totalShieldsUsed: number;             // Gesamt eingesetzte Schutzschilder (Statistik)

  // Kalender-Daten (letzte 12 Monate werden gespeichert)
  playHistory: {
    [yearMonth: string]: MonthlyPlayData; // Format: "2025-01"
  };

  // Statistiken
  totalDaysPlayed: number;              // Gesamt gespielte Tage
  completedMonths: string[];            // Vollständig abgeschlossene Monate ["2024-12", "2025-01"]

  // Cloud Sync: Timestamp für Conflict Resolution (Cloud-Wins Strategy)
  updatedAt?: number;                   // Timestamp in milliseconds (Date.now())
};

// Standard-Statistiken
const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  bestTimeEasy: Infinity,
  bestTimeMedium: Infinity,
  bestTimeHard: Infinity,
  bestTimeExpert: Infinity,
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  reachedMilestones: [],
  // NEU: Standardwerte für die gelösten Sudokus
  completedEasy: 0,
  completedMedium: 0,
  completedHard: 0,
  completedExpert: 0,
};

// Standard-Einstellungen
export const DEFAULT_SETTINGS: GameSettings = {
  highlightRelatedCells: true,
  showMistakes: true,
  highlightSameValues: true,
  autoNotes: false,
  darkMode: "dark",
  vibration: true,
  soundEffects: true,
  backgroundMusic: false,
  language: "de",
};

// Speichere den aktuellen Spielstand
export const saveGameState = async (gameState: GameState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.GAME_STATE, JSON.stringify(gameState));
  } catch (error) {
    console.error("Error saving game state:", error);
  }
};

// Lade den gespeicherten Spielstand
export const loadGameState = async (): Promise<GameState | null> => {
  try {
    const savedState = await AsyncStorage.getItem(KEYS.GAME_STATE);
    return savedState ? JSON.parse(savedState) : null;
  } catch (error) {
    console.error("Error loading game state:", error);
    return null;
  }
};

// Lösche den gespeicherten Spielstand
export const clearGameState = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.GAME_STATE);
  } catch (error) {
    console.error("Error clearing game state:", error);
  }
};

// Speichere Statistiken
export const saveStats = async (stats: GameStats): Promise<void> => {
  try {
    // Cloud Sync: Setze updatedAt timestamp
    const statsWithTimestamp: GameStats = {
      ...stats,
      updatedAt: Date.now(),
    };

    await AsyncStorage.setItem(KEYS.STATISTICS, JSON.stringify(statsWithTimestamp));

    // PERFORMANCE: Invalidiere Cache nach dem Speichern
    storageCache.delete(KEYS.STATISTICS);

    // Cloud Sync: Markiere als dirty für nächsten Sync
    setDirty('stats').catch(err => console.error('[Storage] Error setting dirty flag:', err));
  } catch (error) {
    console.error("Error saving statistics:", error);
  }
};

// Lade Statistiken
// PERFORMANCE: Mit Cache-Unterstützung für häufige Zugriffe
export const loadStats = async (): Promise<GameStats> => {
  try {
    // Prüfe Cache zuerst (TTL: 3 Sekunden)
    const cached = storageCache.get<GameStats>(KEYS.STATISTICS, 3000);
    if (cached) {
      return cached;
    }

    const savedStats = await AsyncStorage.getItem(KEYS.STATISTICS);
    if (savedStats) {
      let parsedStats = JSON.parse(savedStats);

      // Kompatibilität mit älteren Versionen
      if (parsedStats.totalXP === undefined) {
        parsedStats.totalXP = 0;
      }
      if (parsedStats.reachedMilestones === undefined) {
        parsedStats.reachedMilestones = [];
      }

      // NEU: Kompatibilität mit älteren Versionen für gelöste Sudokus
      if (parsedStats.completedEasy === undefined) {
        parsedStats.completedEasy = 0;
      }
      if (parsedStats.completedMedium === undefined) {
        parsedStats.completedMedium = 0;
      }
      if (parsedStats.completedHard === undefined) {
        parsedStats.completedHard = 0;
      }
      if (parsedStats.completedExpert === undefined) {
        parsedStats.completedExpert = 0;
      }

      // NEU: Migration zu Daily Streak System
      if (parsedStats.dailyStreak === undefined) {
        parsedStats = await migrateToDailyStreak(parsedStats);
      }

      // MIGRATION: firstLaunchDate für bestehende User hinzufügen
      if (parsedStats.dailyStreak && !parsedStats.dailyStreak.firstLaunchDate) {
        console.log('[loadStats] Adding firstLaunchDate to existing dailyStreak data');

        // Versuche das früheste gespielte Datum zu finden
        let earliestDate = getTodayDate();
        if (parsedStats.dailyStreak.playHistory) {
          const allDates: Date[] = [];

          // Sammle alle gespielten Tage aus der History
          Object.entries(parsedStats.dailyStreak.playHistory).forEach(([yearMonth, monthData]) => {
            const typedMonthData = monthData as MonthlyPlayData;
            typedMonthData.days.forEach((day: number) => {
              const [year, month] = yearMonth.split('-').map(Number);
              const date = new Date(year, month - 1, day);
              allDates.push(date);
            });
          });

          // Finde das früheste Datum
          if (allDates.length > 0) {
            const earliest = new Date(Math.min(...allDates.map(d => d.getTime())));
            earliestDate = earliest.toISOString().split('T')[0];
            console.log('[loadStats] Found earliest play date:', earliestDate);
          }
        }

        parsedStats.dailyStreak.firstLaunchDate = earliestDate;
        await saveStats(parsedStats);
      }

      // PERFORMANCE: Speichere im Cache
      storageCache.set(KEYS.STATISTICS, parsedStats);
      return parsedStats;
    }

    // Wenn keine Stats vorhanden, migriere DEFAULT_STATS auch (für neue User)
    console.log('[loadStats] No saved stats found, initializing with DEFAULT_STATS and migrating...');
    const migratedDefaultStats = await migrateToDailyStreak(DEFAULT_STATS);
    // PERFORMANCE: Speichere im Cache
    storageCache.set(KEYS.STATISTICS, migratedDefaultStats);
    return migratedDefaultStats;
  } catch (error) {
    console.error("Error loading statistics:", error);
    // Auch bei Error: Gib migrierte DEFAULT_STATS zurück
    try {
      return await migrateToDailyStreak(DEFAULT_STATS);
    } catch (migrationError) {
      console.error('[loadStats] Migration failed for DEFAULT_STATS:', migrationError);
      return DEFAULT_STATS;
    }
  }
};

// AKTUALISIERT: Fügt gewonnene XP direkt hinzu und verarbeitet Landschaftsfortschritt
// UND aktualisiert die Anzahl der gelösten Sudokus pro Schwierigkeitsgrad
export const updateStatsAfterGame = async (
  won: boolean,
  difficulty: Difficulty,
  timeElapsed: number,
  autoNotesUsed: boolean = false
): Promise<void> => {
  try {
    // Wenn automatische Notizen verwendet wurden, aktualisieren wir die Statistiken nicht
    if (autoNotesUsed) {
      console.log("Auto notes were used - not updating statistics");
      return;
    }

    // Zeit muss größer als 0 sein, um gültig zu sein
    if (timeElapsed <= 0) {
      console.log("Invalid time (0 or negative), not updating statistics");
      return;
    }

    const currentStats = await loadStats();

    // NEU: XP-Gewinn berechnen MIT Supporter-Bonus
    let xpGain = 0;
    if (won) {
      const baseXp = calculateXpGain(difficulty, timeElapsed, autoNotesUsed);
      xpGain = await calculateEpWithBonus(baseXp);
      console.log(
        `XP gained: ${xpGain} (base: ${baseXp}, won: ${won}, difficulty: ${difficulty})`
      );
    }

    // NEU: Inkrementiere den passenden Zähler für gelöste Sudokus, wenn gewonnen
    let updatedCompletedEasy = currentStats.completedEasy || 0;
    let updatedCompletedMedium = currentStats.completedMedium || 0;
    let updatedCompletedHard = currentStats.completedHard || 0;
    let updatedCompletedExpert = currentStats.completedExpert || 0;

    if (won) {
      switch (difficulty) {
        case "easy":
          updatedCompletedEasy++;
          break;
        case "medium":
          updatedCompletedMedium++;
          break;
        case "hard":
          updatedCompletedHard++;
          break;
        case "expert":
          updatedCompletedExpert++;
          break;
      }
    }

    const updatedStats: GameStats = {
      ...currentStats,
      gamesPlayed: currentStats.gamesPlayed + 1,
      gamesWon: won ? currentStats.gamesWon + 1 : currentStats.gamesWon,
      // Streak nur erhöhen, wenn Spiel gewonnen, sonst auf 0 zurücksetzen
      currentStreak: won ? currentStats.currentStreak + 1 : 0,
      longestStreak: won
        ? Math.max(currentStats.longestStreak, currentStats.currentStreak + 1)
        : currentStats.longestStreak,
      // NEU: XP direkt addieren
      totalXP: currentStats.totalXP + xpGain,
      // Behalte die erreichten Meilensteine (werden in LevelProgress aktualisiert)
      reachedMilestones: currentStats.reachedMilestones || [],
      // NEU: Aktualisierte Werte für gelöste Sudokus pro Schwierigkeitsgrad
      completedEasy: updatedCompletedEasy,
      completedMedium: updatedCompletedMedium,
      completedHard: updatedCompletedHard,
      completedExpert: updatedCompletedExpert,
    };

    // Aktualisiere Bestzeit nur wenn das Spiel gewonnen wurde
    if (won) {
      // Behandle alle Schwierigkeitsgrade gleich mit konsistenter Logik
      if (
        difficulty === "easy" &&
        (currentStats.bestTimeEasy <= 0 ||
          currentStats.bestTimeEasy === Infinity ||
          timeElapsed < currentStats.bestTimeEasy)
      ) {
        updatedStats.bestTimeEasy = timeElapsed;
      } else if (
        difficulty === "medium" &&
        (currentStats.bestTimeMedium <= 0 ||
          currentStats.bestTimeMedium === Infinity ||
          timeElapsed < currentStats.bestTimeMedium)
      ) {
        updatedStats.bestTimeMedium = timeElapsed;
      } else if (
        difficulty === "hard" &&
        (currentStats.bestTimeHard <= 0 ||
          currentStats.bestTimeHard === Infinity ||
          timeElapsed < currentStats.bestTimeHard)
      ) {
        updatedStats.bestTimeHard = timeElapsed;
      } else if (
        difficulty === "expert" &&
        (currentStats.bestTimeExpert <= 0 ||
          currentStats.bestTimeExpert === Infinity ||
          timeElapsed < currentStats.bestTimeExpert)
      ) {
        updatedStats.bestTimeExpert = timeElapsed;
      }

      // NEU: Landschafts-Feature - schalte das nächste Segment frei wenn gewonnen
      try {
        // Hier wird das nächste Segment freigeschaltet
        // Dies passiert asynchron im Hintergrund, aber wir warten nicht auf das Ergebnis
        const unlockResult = await unlockNextSegment();
        if (unlockResult) {
          console.log("Unlocked new landscape segment:", unlockResult.landscapeId, "segment", unlockResult.segmentIndex);
        }
      } catch (err) {
        console.error("Error unlocking landscape segment:", err);
      }
    }

    console.log("Saving updated stats:", updatedStats);
    await saveStats(updatedStats);
  } catch (error) {
    console.error("Error updating statistics:", error);
  }
};

// Meilenstein als erreicht markieren
export const markMilestoneReached = async (
  milestoneLevel: number
): Promise<void> => {
  try {
    const stats = await loadStats();

    // Prüfen, ob dieser Meilenstein bereits erreicht wurde
    if (!stats.reachedMilestones.includes(milestoneLevel)) {
      stats.reachedMilestones.push(milestoneLevel);
      await saveStats(stats);
      console.log(`Milestone at level ${milestoneLevel} marked as reached`);
    }
  } catch (error) {
    console.error("Error updating milestone:", error);
  }
};

// Speichere Einstellungen
// isAutomatic: wenn true, werden Tracking-Flags NICHT gesetzt (für automatische Anpassungen)
export const saveSettings = async (settings: GameSettings, isAutomatic: boolean = false): Promise<void> => {
  try {
    // Nur Tracking aktualisieren wenn dies eine manuelle Änderung ist
    if (!isAutomatic) {
      // Lade vorherige Settings um zu prüfen ob sich relevante Werte geändert haben
      const previousSettings = await loadSettings();
      const tracking = await loadSettingsTracking();

      // Prüfe ob User Settings manuell verändert hat (nur wenn vorherige Settings existieren)
      if (previousSettings) {
        const updatedTracking = { ...tracking };

        // Markiere als modifiziert wenn sich der Wert geändert hat
        if (previousSettings.highlightSameValues !== settings.highlightSameValues) {
          updatedTracking.highlightSameValuesModified = true;
        }
        if (previousSettings.highlightRelatedCells !== settings.highlightRelatedCells) {
          updatedTracking.highlightRelatedCellsModified = true;
        }
        if (previousSettings.showMistakes !== settings.showMistakes) {
          updatedTracking.showMistakesModified = true;
        }

        // Speichere Tracking nur wenn sich etwas geändert hat
        if (
          updatedTracking.highlightSameValuesModified !== tracking.highlightSameValuesModified ||
          updatedTracking.highlightRelatedCellsModified !== tracking.highlightRelatedCellsModified ||
          updatedTracking.showMistakesModified !== tracking.showMistakesModified
        ) {
          await saveSettingsTracking(updatedTracking);
          console.log("[saveSettings] Updated modification tracking (manual change):", updatedTracking);
        }
      }
    } else {
      console.log("[saveSettings] Automatic save - not updating tracking");
    }

    // Cloud Sync: Setze updatedAt timestamp
    const settingsWithTimestamp: GameSettings = {
      ...settings,
      updatedAt: Date.now(),
    };

    // Speichere die Settings selbst
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settingsWithTimestamp));

    // NEU: Feuere Event wenn Settings automatisch geändert wurden
    // Damit useGameSettings die Settings neu laden kann
    // WICHTIG: Event mit Delay feuern um AsyncStorage-Commit abzuwarten
    if (isAutomatic && typeof window !== 'undefined') {
      // Warte 10ms um sicherzustellen dass AsyncStorage commit fertig ist
      setTimeout(() => {
        // @ts-ignore - Custom Event für Settings-Änderungen
        window.dispatchEvent?.(new Event('settingsChanged'));
        console.log("[saveSettings] Dispatched settingsChanged event (with 10ms delay for AsyncStorage commit)");
      }, 10);
    }

    // Cloud Sync: Markiere als dirty für nächsten Sync
    setDirty('settings').catch(err => console.error('[Storage] Error setting dirty flag:', err));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Lade Einstellungen
export const loadSettings = async (): Promise<GameSettings | null> => {
  try {
    const savedSettings = await AsyncStorage.getItem(KEYS.SETTINGS);
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      // Kompatibilität mit älteren Versionen
      if (parsedSettings.language === undefined) {
        parsedSettings.language = "de";
      }
      if (parsedSettings.backgroundMusic === undefined) {
        parsedSettings.backgroundMusic = false;
      }

      return parsedSettings;
    }
    // Kein gespeicherter Wert → Erster Start → null zurückgeben
    return null;
  } catch (error) {
    console.error("Error loading settings:", error);
    return DEFAULT_SETTINGS;
  }
};

// NEU: Utility-Funktionen für Difficulty-Modal

// Bestimme die freigeschalteten Schwierigkeitsgrade - ZURÜCKGESETZT
export const getUnlockedDifficulties = (stats: GameStats): Difficulty[] => {
  const unlocked: Difficulty[] = ["easy"]; // Leicht ist immer verfügbar
  
  // Medium wird freigeschaltet, wenn 1 Leicht gelöst wurde
  if ((stats.completedEasy || 0) >= 1) {
    unlocked.push("medium");
  }
  
  // Schwer wird freigeschaltet, wenn 3 Medium gelöst wurden
  if ((stats.completedMedium || 0) >= 3) {
    unlocked.push("hard");
  }
  
  // Experte wird freigeschaltet, wenn 9 Schwer gelöst wurden
  if ((stats.completedHard || 0) >= 9) {
    unlocked.push("expert");
  }
  
  return unlocked;
};

// Berechne die Fortschrittsnachricht für das Freischalten - ZURÜCKGESETZT
export const getProgressMessage = (stats: GameStats): string => {
  if ((stats.completedHard || 0) >= 9) {
    return "Alle Schwierigkeitsgrade sind freigeschaltet!";
  } else if ((stats.completedMedium || 0) >= 3) {
    const remaining = 9 - (stats.completedHard || 0);
    return `Löse noch ${remaining} Sudoku auf Schwer, um Experte freizuschalten.`;
  } else if ((stats.completedEasy || 0) >= 1) {
    const remaining = 3 - (stats.completedMedium || 0);
    return `Löse noch ${remaining} Sudoku auf Mittel, um Schwer freizuschalten.`;
  } else {
    const remaining = 1 - (stats.completedEasy || 0);
    return `Löse noch ${remaining} Sudoku auf Leicht, um Mittel freizuschalten.`;
  }
};

// Berechne den Fortschrittswert (0-100%) für den Fortschrittsbalken - ZURÜCKGESETZT
export const getProgressValue = (stats: GameStats): number => {
  if ((stats.completedHard || 0) >= 9) {
    return 100; // Alles freigeschaltet
  } else if ((stats.completedMedium || 0) >= 3) {
    return Math.min(100, ((stats.completedHard || 0) / 9) * 100); // Fortschritt zu Experte
  } else if ((stats.completedEasy || 0) >= 1) {
    return Math.min(100, ((stats.completedMedium || 0) / 3) * 100); // Fortschritt zu Schwer
  } else {
    return Math.min(100, ((stats.completedEasy || 0) / 1) * 100); // Fortschritt zu Medium
  }
};

// ===== Settings Modification Tracking =====

// Standard Tracking-Werte: Alle Settings sind initial nicht verändert
const DEFAULT_SETTINGS_TRACKING: SettingsModificationTracking = {
  highlightSameValuesModified: false,
  highlightRelatedCellsModified: false,
  showMistakesModified: false,
};

// Lade Settings Tracking
export const loadSettingsTracking = async (): Promise<SettingsModificationTracking> => {
  try {
    const savedTracking = await AsyncStorage.getItem(KEYS.SETTINGS_TRACKING);
    return savedTracking ? JSON.parse(savedTracking) : DEFAULT_SETTINGS_TRACKING;
  } catch (error) {
    console.error("Error loading settings tracking:", error);
    return DEFAULT_SETTINGS_TRACKING;
  }
};

// Speichere Settings Tracking
export const saveSettingsTracking = async (tracking: SettingsModificationTracking): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS_TRACKING, JSON.stringify(tracking));

    // Cloud Sync: Markiere als dirty für nächsten Sync (Tracking ist Teil von Settings)
    setDirty('settings').catch(err => console.error('[Storage] Error setting dirty flag:', err));
  } catch (error) {
    console.error("Error saving settings tracking:", error);
  }
};

// Wendet Schwierigkeitsgrad-basierte Settings an (ohne zu speichern)
// Respektiert vom User manuell geänderte Settings
export const applyDifficultyBasedSettings = async (
  difficulty: Difficulty,
  currentSettings: GameSettings
): Promise<GameSettings> => {
  try {
    const tracking = await loadSettingsTracking();
    const adjustedSettings = { ...currentSettings };

    // Leicht: Alle Hilfen aktiviert
    if (difficulty === "easy") {
      if (!tracking.highlightSameValuesModified) {
        adjustedSettings.highlightSameValues = true;
      }
      if (!tracking.highlightRelatedCellsModified) {
        adjustedSettings.highlightRelatedCells = true;
      }
      if (!tracking.showMistakesModified) {
        adjustedSettings.showMistakes = true;
      }
    }
    // Mittel: highlightSameValues deaktiviert
    else if (difficulty === "medium") {
      if (!tracking.highlightSameValuesModified) {
        adjustedSettings.highlightSameValues = false;
      }
      if (!tracking.highlightRelatedCellsModified) {
        adjustedSettings.highlightRelatedCells = true;
      }
      if (!tracking.showMistakesModified) {
        adjustedSettings.showMistakes = true;
      }
    }
    // Schwer: highlightSameValues + highlightRelatedCells deaktiviert
    else if (difficulty === "hard") {
      if (!tracking.highlightSameValuesModified) {
        adjustedSettings.highlightSameValues = false;
      }
      if (!tracking.highlightRelatedCellsModified) {
        adjustedSettings.highlightRelatedCells = false;
      }
      if (!tracking.showMistakesModified) {
        adjustedSettings.showMistakes = true;
      }
    }
    // Experte: Alle Hilfen deaktiviert
    else if (difficulty === "expert") {
      if (!tracking.highlightSameValuesModified) {
        adjustedSettings.highlightSameValues = false;
      }
      if (!tracking.highlightRelatedCellsModified) {
        adjustedSettings.highlightRelatedCells = false;
      }
      if (!tracking.showMistakesModified) {
        adjustedSettings.showMistakes = false;
      }
    }

    console.log(`[applyDifficultyBasedSettings] Applied settings for ${difficulty}:`, adjustedSettings);
    return adjustedSettings;
  } catch (error) {
    console.error("[applyDifficultyBasedSettings] Error:", error);
    return currentSettings; // Fallback to current settings on error
  }
};

// ===== Pausiertes Spiel Management =====

// Speichere pausiertes Spiel
export const savePausedGame = async (pausedGame: PausedGameState): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.PAUSED_GAME, JSON.stringify(pausedGame));
  } catch (error) {
    console.error("Error saving paused game:", error);
  }
};

// Lade pausiertes Spiel
export const loadPausedGame = async (): Promise<PausedGameState | null> => {
  try {
    const savedGame = await AsyncStorage.getItem(KEYS.PAUSED_GAME);
    return savedGame ? JSON.parse(savedGame) : null;
  } catch (error) {
    console.error("Error loading paused game:", error);
    return null;
  }
};

// Lösche pausiertes Spiel
export const clearPausedGame = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(KEYS.PAUSED_GAME);
  } catch (error) {
    console.error("Error clearing paused game:", error);
  }
};

// ===== Farbauswahl Management =====

// Standardfarbe (Blau - Fundamentals)
const DEFAULT_COLOR = "#4285F4";

// Standard-Farbauswahl (nur Blau ist initial freigeschaltet)
const DEFAULT_COLOR_UNLOCK: ColorUnlockData = {
  selectedColor: DEFAULT_COLOR,
  unlockedColors: [DEFAULT_COLOR],
};

// Speichere Farbauswahl
export const saveColorUnlock = async (colorData: ColorUnlockData): Promise<void> => {
  try {
    // Cloud Sync: Setze updatedAt timestamp
    const colorDataWithTimestamp: ColorUnlockData = {
      ...colorData,
      updatedAt: Date.now(),
    };

    await AsyncStorage.setItem(KEYS.COLOR_UNLOCK, JSON.stringify(colorDataWithTimestamp));

    // Cloud Sync: Markiere als dirty für nächsten Sync
    setDirty('colorUnlock').catch(err => console.error('[Storage] Error setting dirty flag:', err));
  } catch (error) {
    console.error("Error saving color unlock:", error);
  }
};

// Lade Farbauswahl
export const loadColorUnlock = async (): Promise<ColorUnlockData> => {
  try {
    const savedData = await AsyncStorage.getItem(KEYS.COLOR_UNLOCK);
    return savedData ? JSON.parse(savedData) : DEFAULT_COLOR_UNLOCK;
  } catch (error) {
    console.error("Error loading color unlock:", error);
    return DEFAULT_COLOR_UNLOCK;
  }
};

// Aktualisiere ausgewählte Farbe
export const updateSelectedColor = async (color: string): Promise<void> => {
  try {
    const currentData = await loadColorUnlock();
    await saveColorUnlock({
      ...currentData,
      selectedColor: color,
    });
  } catch (error) {
    console.error("Error updating selected color:", error);
  }
};

// Schalte neue Farbe frei
export const unlockColor = async (color: string): Promise<void> => {
  try {
    const currentData = await loadColorUnlock();
    if (!currentData.unlockedColors.includes(color)) {
      await saveColorUnlock({
        ...currentData,
        unlockedColors: [...currentData.unlockedColors, color],
      });
      console.log(`Color ${color} unlocked`);
    }
  } catch (error) {
    console.error("Error unlocking color:", error);
  }
};

// 🔧 DEV MODE: Setze auf true um alle Farben für Testing freizuschalten
const DEV_UNLOCK_ALL_COLORS = false;

// Ermittle freigeschaltete Farben basierend auf Level
// Verwendet aktualisierte Farbwerte (Light Mode Varianten für Storage)
export const getUnlockedColorsForLevel = (level: number): string[] => {
  // DEV MODE: Alle Farben zum Testen freigeschaltet
  if (DEV_UNLOCK_ALL_COLORS) {
    return [
      "#4285F4", // Blau - Fundamentals
      "#34A853", // Grün - Insight
      "#F9AB00", // Gelb - Mastery
      "#EA4335", // Rot - Wisdom
      "#7C4DFF", // Violett - Transcendence
    ];
  }

  // PRODUCTION: Level-basiertes Freischalten
  const colors = ["#4285F4"]; // Blau - immer verfügbar
  if (level >= 5) colors.push("#34A853"); // Grün - ab Level 5
  if (level >= 10) colors.push("#F9AB00"); // Gelb - ab Level 10
  if (level >= 15) colors.push("#EA4335"); // Rot - ab Level 15
  if (level >= 20) colors.push("#7C4DFF"); // Violett - ab Level 20
  return colors;
};

// Synchronisiere freigeschaltete Farben mit aktuellem Level
export const syncUnlockedColors = async (currentLevel: number): Promise<void> => {
  try {
    const currentData = await loadColorUnlock();
    const shouldBeUnlocked = getUnlockedColorsForLevel(currentLevel);

    // Füge neue Farben hinzu, die freigeschaltet sein sollten
    const newUnlocked = [...new Set([...currentData.unlockedColors, ...shouldBeUnlocked])];

    if (newUnlocked.length !== currentData.unlockedColors.length) {
      // Finde die neu freigeschaltete Farbe
      const newlyUnlockedColors = newUnlocked.filter(
        color => !currentData.unlockedColors.includes(color)
      );

      // Automatisch die neueste freigeschaltete Farbe aktivieren
      const colorToActivate = newlyUnlockedColors.length > 0
        ? newlyUnlockedColors[newlyUnlockedColors.length - 1] // Letzte neue Farbe (höchstes Level)
        : currentData.selectedColor;

      await saveColorUnlock({
        ...currentData,
        unlockedColors: newUnlocked,
        selectedColor: colorToActivate,
      });

      if (newlyUnlockedColors.length > 0) {
        console.log(`Colors synced for level ${currentLevel}. New path color activated: ${colorToActivate}`);
      }
    }
  } catch (error) {
    console.error("Error syncing unlocked colors:", error);
  }
};

// ===== Daily Streak System - Migration & Helpers =====

/**
 * Helper: Gibt den letzten Montag als ISO-Date-String zurück
 */
function getLastMonday(): string {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sonntag, 1 = Montag, ...
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Montag = 0 Tage, Sonntag = 6 Tage
  const lastMonday = new Date(today);
  lastMonday.setDate(today.getDate() - daysToSubtract);
  lastMonday.setHours(0, 0, 0, 0);
  return lastMonday.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Helper: Gibt heutiges Datum als ISO-Date-String zurück (YYYY-MM-DD)
 */
export function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD
}

/**
 * Migration von altem Win-Streak zu Daily Streak System
 * Wird automatisch beim ersten Laden nach Update ausgeführt
 */
async function migrateToDailyStreak(stats: GameStats): Promise<GameStats> {
  console.log('[Daily Streak] Migrating to new Daily Streak System...');

  // Check ob Premium Subscriber für Shield-Count
  let initialShields = 2; // Default für Free User
  try {
    const { getSupporterStatus } = await import('@/modules/subscriptions/entitlements');
    const supporterStatus = await getSupporterStatus();
    if (supporterStatus.isPremiumSubscriber) {
      initialShields = 3;
    }
  } catch (error) {
    console.warn('[Daily Streak] Could not check premium status, using free tier shields (2)');
  }

  const migratedStats: GameStats = {
    ...stats,
    dailyStreak: {
      // Streak Status
      currentStreak: 0, // Neues System startet bei 0
      longestDailyStreak: stats.longestStreak || 0, // Historischer Win-Streak als Basis
      lastPlayedDate: '', // Leer, damit erstes Spiel gezählt wird
      firstLaunchDate: getTodayDate(), // Setze heutiges Datum als ersten App-Start

      // Schutzschild Management
      shieldsAvailable: initialShields,
      shieldsUsedThisWeek: 0,
      lastShieldResetDate: getLastMonday(),
      bonusShields: 0,
      totalShieldsUsed: 0,

      // Kalender-Daten
      playHistory: {},

      // Statistiken
      totalDaysPlayed: 0,
      completedMonths: [],

      // Cloud Sync: Timestamp
      updatedAt: Date.now(),
    },
  };

  // Speichere migrierten State
  await saveStats(migratedStats);
  console.log('[Daily Streak] Migration completed successfully');

  return migratedStats;
}