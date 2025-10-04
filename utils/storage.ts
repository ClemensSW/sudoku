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

// Schlüssel für den Storage
const KEYS = {
  GAME_STATE: "@sudoku/game_state",
  STATISTICS: "@sudoku/statistics",
  SETTINGS: "@sudoku/settings",
  PAUSED_GAME: "@sudoku/paused_game",
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
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  reachedMilestones: number[]; 
  // NEU: Speicherung der gelösten Sudokus pro Schwierigkeitsgrad
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
  completedExpert: number;
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
const DEFAULT_SETTINGS: GameSettings = {
  highlightRelatedCells: true,
  showMistakes: true,
  highlightSameValues: true,
  autoNotes: false,
  darkMode: "dark",
  vibration: true,
  soundEffects: true,
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
    await AsyncStorage.setItem(KEYS.STATISTICS, JSON.stringify(stats));
  } catch (error) {
    console.error("Error saving statistics:", error);
  }
};

// Lade Statistiken
export const loadStats = async (): Promise<GameStats> => {
  try {
    const savedStats = await AsyncStorage.getItem(KEYS.STATISTICS);
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
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
      return parsedStats;
    }
    return DEFAULT_STATS;
  } catch (error) {
    console.error("Error loading statistics:", error);
    return DEFAULT_STATS;
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

    // NEU: XP-Gewinn berechnen
    const xpGain = won
      ? calculateXpGain(difficulty, timeElapsed, autoNotesUsed)
      : 0;
    console.log(
      `XP gained: ${xpGain} (won: ${won}, difficulty: ${difficulty})`
    );

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
          console.log("Unlocked new landscape segment:", unlockResult.type);
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
export const saveSettings = async (settings: GameSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// Lade Einstellungen
export const loadSettings = async (): Promise<GameSettings> => {
  try {
    const savedSettings = await AsyncStorage.getItem(KEYS.SETTINGS);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
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