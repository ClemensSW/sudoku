// components/GameCompletionModal/components/LevelProgress/utils/levelData.ts
import { GameStats } from '@/utils/storage';
import { Difficulty } from '@/utils/sudoku';
import { LevelInfo, PathInfo, LevelThreshold } from './types';
import i18next from '@/locales/i18n';

export const paths: PathInfo[] = [
  {
    id: "fundamentals",
    name: i18next.t('levels:paths.fundamentals.name'),
    description: i18next.t('levels:paths.fundamentals.description'),
    levelRange: [0, 4],
    color: "#4285F4", // Google-Blau - Basis und Vertrauen
    completionMessage: i18next.t('levels:paths.fundamentals.completionMessage')
  },
  {
    id: "insight",
    name: i18next.t('levels:paths.insight.name'),
    description: i18next.t('levels:paths.insight.description'),
    levelRange: [5, 9],
    color: "#34A853", // Google-Grün - Wachstum und Erkenntnis
    completionMessage: i18next.t('levels:paths.insight.completionMessage')
  },
  {
    id: "mastery",
    name: i18next.t('levels:paths.mastery.name'),
    description: i18next.t('levels:paths.mastery.description'),
    levelRange: [10, 14],
    color: "#FBBC05", // Google-Gelb - Optimismus und Meisterschaft
    completionMessage: i18next.t('levels:paths.mastery.completionMessage')
  },
  {
    id: "wisdom",
    name: i18next.t('levels:paths.wisdom.name'),
    description: i18next.t('levels:paths.wisdom.description'),
    levelRange: [15, 19],
    color: "#EA4335", // Google-Rot - Kraft und Weisheit
    completionMessage: i18next.t('levels:paths.wisdom.completionMessage')
  },
  {
    id: "transcendence",
    name: i18next.t('levels:paths.transcendence.name'),
    description: i18next.t('levels:paths.transcendence.description'),
    levelRange: [20, 50],
    color: "#673AB7", // Tiefes Violett - Spiritualität und Transzendenz
    completionMessage: i18next.t('levels:paths.transcendence.completionMessage')
  }
];

// Erfahrungspunkte für jedes Level
export const levels: LevelThreshold[] = [
  // Pfad der Grundlagen
  {
    xp: 0,
    name: i18next.t('levels:levels.0.name'),
    message: i18next.t('levels:levels.0.message'),
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 5,
    name: i18next.t('levels:levels.1.name'),
    message: i18next.t('levels:levels.1.message'),
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 15,
    name: i18next.t('levels:levels.2.name'),
    message: i18next.t('levels:levels.2.message'),
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 30,
    name: i18next.t('levels:levels.3.name'),
    message: i18next.t('levels:levels.3.message'),
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 50,
    name: i18next.t('levels:levels.4.name'),
    message: i18next.t('levels:levels.4.message'),
    path: "fundamentals",
    pathIndex: 0
  },

  // Pfad der Erkenntnis
  {
    xp: 75,
    name: i18next.t('levels:levels.5.name'),
    message: i18next.t('levels:levels.5.message'),
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 105,
    name: i18next.t('levels:levels.6.name'),
    message: i18next.t('levels:levels.6.message'),
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 140,
    name: i18next.t('levels:levels.7.name'),
    message: i18next.t('levels:levels.7.message'),
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 180,
    name: i18next.t('levels:levels.8.name'),
    message: i18next.t('levels:levels.8.message'),
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 225,
    name: i18next.t('levels:levels.9.name'),
    message: i18next.t('levels:levels.9.message'),
    path: "insight",
    pathIndex: 1
  },

  // Pfad der Meisterschaft
  {
    xp: 275,
    name: i18next.t('levels:levels.10.name'),
    message: i18next.t('levels:levels.10.message'),
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 330,
    name: i18next.t('levels:levels.11.name'),
    message: i18next.t('levels:levels.11.message'),
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 390,
    name: i18next.t('levels:levels.12.name'),
    message: i18next.t('levels:levels.12.message'),
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 455,
    name: i18next.t('levels:levels.13.name'),
    message: i18next.t('levels:levels.13.message'),
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 525,
    name: i18next.t('levels:levels.14.name'),
    message: i18next.t('levels:levels.14.message'),
    path: "mastery",
    pathIndex: 2
  },

  // Pfad der Weisheit
  {
    xp: 600,
    name: i18next.t('levels:levels.15.name'),
    message: i18next.t('levels:levels.15.message'),
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 680,
    name: i18next.t('levels:levels.16.name'),
    message: i18next.t('levels:levels.16.message'),
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 765,
    name: i18next.t('levels:levels.17.name'),
    message: i18next.t('levels:levels.17.message'),
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 855,
    name: i18next.t('levels:levels.18.name'),
    message: i18next.t('levels:levels.18.message'),
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 950,
    name: i18next.t('levels:levels.19.name'),
    message: i18next.t('levels:levels.19.message'),
    path: "wisdom",
    pathIndex: 3
  },

  // Pfad der Transzendenz
  {
    xp: 1050,
    name: i18next.t('levels:levels.20.name'),
    message: i18next.t('levels:levels.20.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1200,
    name: i18next.t('levels:levels.21.name'),
    message: i18next.t('levels:levels.21.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1350,
    name: i18next.t('levels:levels.22.name'),
    message: i18next.t('levels:levels.22.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1500,
    name: i18next.t('levels:levels.23.name'),
    message: i18next.t('levels:levels.23.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1750,
    name: i18next.t('levels:levels.24.name'),
    message: i18next.t('levels:levels.24.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1925,
    name: i18next.t('levels:levels.25.name'),
    message: i18next.t('levels:levels.25.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 2118,
    name: i18next.t('levels:levels.26.name'),
    message: i18next.t('levels:levels.26.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 2329,
    name: i18next.t('levels:levels.27.name'),
    message: i18next.t('levels:levels.27.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 2562,
    name: i18next.t('levels:levels.28.name'),
    message: i18next.t('levels:levels.28.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 2818,
    name: i18next.t('levels:levels.29.name'),
    message: i18next.t('levels:levels.29.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 3100,
    name: i18next.t('levels:levels.30.name'),
    message: i18next.t('levels:levels.30.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 3410,
    name: i18next.t('levels:levels.31.name'),
    message: i18next.t('levels:levels.31.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 3751,
    name: i18next.t('levels:levels.32.name'),
    message: i18next.t('levels:levels.32.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 4126,
    name: i18next.t('levels:levels.33.name'),
    message: i18next.t('levels:levels.33.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 4538,
    name: i18next.t('levels:levels.34.name'),
    message: i18next.t('levels:levels.34.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 4992,
    name: i18next.t('levels:levels.35.name'),
    message: i18next.t('levels:levels.35.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 5491,
    name: i18next.t('levels:levels.36.name'),
    message: i18next.t('levels:levels.36.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 6039,
    name: i18next.t('levels:levels.37.name'),
    message: i18next.t('levels:levels.37.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 6643,
    name: i18next.t('levels:levels.38.name'),
    message: i18next.t('levels:levels.38.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 7307,
    name: i18next.t('levels:levels.39.name'),
    message: i18next.t('levels:levels.39.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 8038,
    name: i18next.t('levels:levels.40.name'),
    message: i18next.t('levels:levels.40.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 8842,
    name: i18next.t('levels:levels.41.name'),
    message: i18next.t('levels:levels.41.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 9726,
    name: i18next.t('levels:levels.42.name'),
    message: i18next.t('levels:levels.42.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 10698,
    name: i18next.t('levels:levels.43.name'),
    message: i18next.t('levels:levels.43.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 11768,
    name: i18next.t('levels:levels.44.name'),
    message: i18next.t('levels:levels.44.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 12945,
    name: i18next.t('levels:levels.45.name'),
    message: i18next.t('levels:levels.45.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 14239,
    name: i18next.t('levels:levels.46.name'),
    message: i18next.t('levels:levels.46.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 15663,
    name: i18next.t('levels:levels.47.name'),
    message: i18next.t('levels:levels.47.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 17229,
    name: i18next.t('levels:levels.48.name'),
    message: i18next.t('levels:levels.48.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 18952,
    name: i18next.t('levels:levels.49.name'),
    message: i18next.t('levels:levels.49.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 20847,
    name: i18next.t('levels:levels.50.name'),
    message: i18next.t('levels:levels.50.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 22932,
    name: i18next.t('levels:levels.51.name'),
    message: i18next.t('levels:levels.51.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 25225,
    name: i18next.t('levels:levels.52.name'),
    message: i18next.t('levels:levels.52.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 27748,
    name: i18next.t('levels:levels.53.name'),
    message: i18next.t('levels:levels.53.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 30522,
    name: i18next.t('levels:levels.54.name'),
    message: i18next.t('levels:levels.54.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 33574,
    name: i18next.t('levels:levels.55.name'),
    message: i18next.t('levels:levels.55.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 36932,
    name: i18next.t('levels:levels.56.name'),
    message: i18next.t('levels:levels.56.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 40625,
    name: i18next.t('levels:levels.57.name'),
    message: i18next.t('levels:levels.57.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 44687,
    name: i18next.t('levels:levels.58.name'),
    message: i18next.t('levels:levels.58.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 49155,
    name: i18next.t('levels:levels.59.name'),
    message: i18next.t('levels:levels.59.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 54070,
    name: i18next.t('levels:levels.60.name'),
    message: i18next.t('levels:levels.60.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 59477,
    name: i18next.t('levels:levels.61.name'),
    message: i18next.t('levels:levels.61.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 65425,
    name: i18next.t('levels:levels.62.name'),
    message: i18next.t('levels:levels.62.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 71967,
    name: i18next.t('levels:levels.63.name'),
    message: i18next.t('levels:levels.63.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 79163,
    name: i18next.t('levels:levels.64.name'),
    message: i18next.t('levels:levels.64.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 87079,
    name: i18next.t('levels:levels.65.name'),
    message: i18next.t('levels:levels.65.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 95787,
    name: i18next.t('levels:levels.66.name'),
    message: i18next.t('levels:levels.66.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 105366,
    name: i18next.t('levels:levels.67.name'),
    message: i18next.t('levels:levels.67.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 115902,
    name: i18next.t('levels:levels.68.name'),
    message: i18next.t('levels:levels.68.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 127492,
    name: i18next.t('levels:levels.69.name'),
    message: i18next.t('levels:levels.69.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 140241,
    name: i18next.t('levels:levels.70.name'),
    message: i18next.t('levels:levels.70.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 154346,
    name: i18next.t('levels:levels.71.name'),
    message: i18next.t('levels:levels.71.message'),
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 169780,
    name: i18next.t('levels:levels.72.name'),
    message: i18next.t('levels:levels.72.message'),
    path: "transcendence",
    pathIndex: 4
  },

];

// Meilenstein-Nachrichten bei Erreichen bedeutender Level
export const milestones: Record<number, string> = {
  5: i18next.t('levels:milestones.5'),
  10: i18next.t('levels:milestones.10'),
  15: i18next.t('levels:milestones.15'),
  20: i18next.t('levels:milestones.20')
};

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
  const levelInfo = levels[level];
  return paths.find(path => path.id === levelInfo.path)!;
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