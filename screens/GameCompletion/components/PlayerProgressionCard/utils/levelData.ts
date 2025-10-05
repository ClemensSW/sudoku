// components/GameCompletionModal/components/LevelProgress/utils/levelData.ts
import { GameStats } from '@/utils/storage';
import { Difficulty } from '@/utils/sudoku';
import { LevelInfo, PathInfo, LevelThreshold } from './types';
import i18next from '@/locales/i18n';

// Base path data without translations
const pathsBase = [
  {
    id: "fundamentals",
    levelRange: [0, 4] as [number, number],
    color: "#4285F4", // Google-Blau - Basis und Vertrauen
  },
  {
    id: "insight",
    levelRange: [5, 9] as [number, number],
    color: "#34A853", // Google-Grün - Wachstum und Erkenntnis
  },
  {
    id: "mastery",
    levelRange: [10, 14] as [number, number],
    color: "#FBBC05", // Google-Gelb - Optimismus und Meisterschaft
  },
  {
    id: "wisdom",
    levelRange: [15, 19] as [number, number],
    color: "#EA4335", // Google-Rot - Kraft und Weisheit
  },
  {
    id: "transcendence",
    levelRange: [20, 50] as [number, number],
    color: "#673AB7", // Tiefes Violett - Spiritualität und Transzendenz
  }
];

// Getter function that returns paths with current translations
export const getPaths = (): PathInfo[] => {
  return pathsBase.map(path => ({
    ...path,
    name: i18next.t(`levels:paths.${path.id}.name`),
    description: i18next.t(`levels:paths.${path.id}.description`),
    completionMessage: i18next.t(`levels:paths.${path.id}.completionMessage`)
  }));
};

// For backwards compatibility
export const paths = getPaths();

// Base level data without translations
const levelsBase: Array<{xp: number; path: string; pathIndex: number}> = [
  // Pfad der Grundlagen
  { xp: 0, path: "fundamentals", pathIndex: 0 },
  { xp: 5, path: "fundamentals", pathIndex: 0 },
  { xp: 15, path: "fundamentals", pathIndex: 0 },
  { xp: 30, path: "fundamentals", pathIndex: 0 },
  { xp: 50, path: "fundamentals", pathIndex: 0 },

  // Pfad der Erkenntnis
  { xp: 75, path: "insight", pathIndex: 1 },
  { xp: 105, path: "insight", pathIndex: 1 },
  { xp: 140, path: "insight", pathIndex: 1 },
  { xp: 180, path: "insight", pathIndex: 1 },
  { xp: 225, path: "insight", pathIndex: 1 },

  // Pfad der Meisterschaft
  { xp: 275, path: "mastery", pathIndex: 2 },
  { xp: 330, path: "mastery", pathIndex: 2 },
  { xp: 390, path: "mastery", pathIndex: 2 },
  { xp: 455, path: "mastery", pathIndex: 2 },
  { xp: 525, path: "mastery", pathIndex: 2 },

  // Pfad der Weisheit
  { xp: 600, path: "wisdom", pathIndex: 3 },
  { xp: 680, path: "wisdom", pathIndex: 3 },
  { xp: 765, path: "wisdom", pathIndex: 3 },
  { xp: 855, path: "wisdom", pathIndex: 3 },
  { xp: 950, path: "wisdom", pathIndex: 3 },

  // Pfad der Transzendenz
  { xp: 1050, path: "transcendence", pathIndex: 4 },
  { xp: 1200, path: "transcendence", pathIndex: 4 },
  { xp: 1350, path: "transcendence", pathIndex: 4 },
  { xp: 1500, path: "transcendence", pathIndex: 4 },
  { xp: 1750, path: "transcendence", pathIndex: 4 },
  { xp: 1925, path: "transcendence", pathIndex: 4 },
  { xp: 2118, path: "transcendence", pathIndex: 4 },
  { xp: 2329, path: "transcendence", pathIndex: 4 },
  { xp: 2562, path: "transcendence", pathIndex: 4 },
  { xp: 2818, path: "transcendence", pathIndex: 4 },
  { xp: 3100, path: "transcendence", pathIndex: 4 },
  { xp: 3410, path: "transcendence", pathIndex: 4 },
  { xp: 3751, path: "transcendence", pathIndex: 4 },
  { xp: 4126, path: "transcendence", pathIndex: 4 },
  { xp: 4538, path: "transcendence", pathIndex: 4 },
  { xp: 4992, path: "transcendence", pathIndex: 4 },
  { xp: 5491, path: "transcendence", pathIndex: 4 },
  { xp: 6039, path: "transcendence", pathIndex: 4 },
  { xp: 6643, path: "transcendence", pathIndex: 4 },
  { xp: 7307, path: "transcendence", pathIndex: 4 },
  { xp: 8038, path: "transcendence", pathIndex: 4 },
  { xp: 8842, path: "transcendence", pathIndex: 4 },
  { xp: 9726, path: "transcendence", pathIndex: 4 },
  { xp: 10698, path: "transcendence", pathIndex: 4 },
  { xp: 11768, path: "transcendence", pathIndex: 4 },
  { xp: 12945, path: "transcendence", pathIndex: 4 },
  { xp: 14239, path: "transcendence", pathIndex: 4 },
  { xp: 15663, path: "transcendence", pathIndex: 4 },
  { xp: 17229, path: "transcendence", pathIndex: 4 },
  { xp: 18952, path: "transcendence", pathIndex: 4 },
  { xp: 20847, path: "transcendence", pathIndex: 4 },
  { xp: 22932, path: "transcendence", pathIndex: 4 },
  { xp: 25225, path: "transcendence", pathIndex: 4 },
  { xp: 27748, path: "transcendence", pathIndex: 4 },
  { xp: 30522, path: "transcendence", pathIndex: 4 },
  { xp: 33574, path: "transcendence", pathIndex: 4 },
  { xp: 36932, path: "transcendence", pathIndex: 4 },
  { xp: 40625, path: "transcendence", pathIndex: 4 },
  { xp: 44687, path: "transcendence", pathIndex: 4 },
  { xp: 49155, path: "transcendence", pathIndex: 4 },
  { xp: 54070, path: "transcendence", pathIndex: 4 },
  { xp: 59477, path: "transcendence", pathIndex: 4 },
  { xp: 65425, path: "transcendence", pathIndex: 4 },
  { xp: 71967, path: "transcendence", pathIndex: 4 },
  { xp: 79163, path: "transcendence", pathIndex: 4 },
  { xp: 87079, path: "transcendence", pathIndex: 4 },
  { xp: 95787, path: "transcendence", pathIndex: 4 },
  { xp: 105366, path: "transcendence", pathIndex: 4 },
  { xp: 115902, path: "transcendence", pathIndex: 4 },
  { xp: 127492, path: "transcendence", pathIndex: 4 },
  { xp: 140241, path: "transcendence", pathIndex: 4 },
  { xp: 154346, path: "transcendence", pathIndex: 4 },
  { xp: 169780, path: "transcendence", pathIndex: 4 },
];

// Getter function that returns levels with current translations
export const getLevels = (): LevelThreshold[] => {
  return levelsBase.map((level, index) => ({
    ...level,
    name: i18next.t(`levels:levels.${index}.name`),
    message: i18next.t(`levels:levels.${index}.message`)
  }));
};

// For backwards compatibility
export const levels = getLevels();

// Getter for milestones with current translations
export const getMilestones = (): Record<number, string> => ({
  5: i18next.t('levels:milestones.5'),
  10: i18next.t('levels:milestones.10'),
  15: i18next.t('levels:milestones.15'),
  20: i18next.t('levels:milestones.20')
});

// For backwards compatibility
export const milestones = getMilestones();

/**
 * Findet das Level für eine bestimmte Anzahl an XP
 * @param xp Die Erfahrungspunkte
 * @returns Das Level-Index (0-basiert)
 */
export function getLevel(xp: number): number {
  let level = 0;
  for (let i = 0; i < levels.length; i++) {
    if (xp >= levels[i].xp) {
      level = i;
    } else {
      break;
    }
  }
  return level;
}

/**
 * Findet die Pfad-Informationen für ein bestimmtes Level
 * @param level Das Level-Index
 * @returns Pfad-Informationen
 */
export function getPathForLevel(level: number): PathInfo {
  const allLevels = getLevels();
  const levelInfo = allLevels[level];
  const allPaths = getPaths();
  return allPaths.find(path => path.id === levelInfo.path)!;
}

/**
 * Ermittelt den XP-Schwellenwert für das nächste Level
 * @param currentLevel Das aktuelle Level-Index
 * @returns XP-Schwelle für das nächste Level oder -1 wenn maximales Level erreicht
 */
export function getNextLevelThreshold(currentLevel: number): number {
  if (currentLevel >= levels.length - 1) {
    return -1; // Maximales Level erreicht
  }
  return levels[currentLevel + 1].xp;
}

/**
 * Berechnet den Fortschritt innerhalb eines Levels
 * @param xp Aktuelle Erfahrungspunkte
 * @returns Fortschrittsinformationen
 */
export function getLevelProgress(xp: number): {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  xpForNextLevel: number;
  progress: number;
} {
  const currentLevel = getLevel(xp);
  const currentXP = xp;
  
  // Wenn maximales Level erreicht
  if (currentLevel >= levels.length - 1) {
    return {
      currentLevel,
      currentXP,
      nextLevelXP: -1,
      xpForNextLevel: 0,
      progress: 100
    };
  }

  const nextLevelXP = levels[currentLevel + 1].xp;
  const levelStartXP = levels[currentLevel].xp;
  const xpForNextLevel = nextLevelXP - currentXP;
  const levelXPRange = nextLevelXP - levelStartXP;
  const progress = Math.min(100, Math.round(((currentXP - levelStartXP) / levelXPRange) * 100));

  return {
    currentLevel,
    currentXP,
    nextLevelXP,
    xpForNextLevel,
    progress
  };
}

/**
 * Einheitliche XP-Berechnung für das gesamte Spiel
 * @param difficulty Der Schwierigkeitsgrad des gelösten Sudokus
 * @param timeElapsed Die benötigte Zeit in Sekunden
 * @param autoNotesUsed Ob Auto-Notizen verwendet wurden
 * @returns Die gewonnenen XP
 */
export function calculateXpGain(
  difficulty: Difficulty,
  timeElapsed: number,
  autoNotesUsed: boolean
): number {
  // Wenn Auto-Notizen verwendet wurden, keine XP
  if (autoNotesUsed) return 0;
  
  // Basis-XP für das Lösen eines Puzzles
  let baseXp = 2;
  
  // Schwierigkeits-Multiplikatoren
  const difficultyMultipliers: Record<Difficulty, number> = {
    easy: 1,
    medium: 2,
    hard: 3,
    expert: 4
  };
  
  // Schwierigkeits-Multiplikator anwenden
  const difficultyMultiplier = difficultyMultipliers[difficulty] || 1;
  baseXp = baseXp * difficultyMultiplier;
  
  // Zeit-Bonus für schnelleres Lösen (maximal 3 zusätzliche XP)
  let timeBonus = 0;
  const minutes = timeElapsed / 60;
  
  // Unterschiedliche Zeit-Schwellenwerte je nach Schwierigkeit
  if (difficulty === 'easy' && minutes < 3) {
    timeBonus = 3;
  } else if (difficulty === 'easy' && minutes < 5) {
    timeBonus = 2;
  } else if (difficulty === 'easy' && minutes < 8) {
    timeBonus = 1;
  } else if (difficulty === 'medium' && minutes < 5) {
    timeBonus = 3;
  } else if (difficulty === 'medium' && minutes < 8) {
    timeBonus = 2;
  } else if (difficulty === 'medium' && minutes < 12) {
    timeBonus = 1;
  } else if (difficulty === 'hard' && minutes < 8) {
    timeBonus = 3;
  } else if (difficulty === 'hard' && minutes < 12) {
    timeBonus = 2;
  } else if (difficulty === 'hard' && minutes < 18) {
    timeBonus = 1;
  } else if (difficulty === 'expert' && minutes < 12) {
    timeBonus = 3;
  } else if (difficulty === 'expert' && minutes < 18) {
    timeBonus = 2;
  } else if (difficulty === 'expert' && minutes < 25) {
    timeBonus = 1;
  }
  
  // Gesamte XP-Erhöhung (gerundet auf ganze Zahl)
  return Math.round(baseXp + timeBonus);
}

// calculateExperience wurde entfernt, da wir jetzt stats.totalXP direkt verwenden