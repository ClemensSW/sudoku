// components/GameCompletionModal/components/LevelProgress/utils/levelData.ts
import { GameStats } from '@/utils/storage';
import { Difficulty } from '@/utils/sudoku';
import { LevelInfo, PathInfo, LevelThreshold } from './types';

// Definition der Pfade
export const paths: PathInfo[] = [
  {
    id: "fundamentals",
    name: "Pfad der Grundlagen",
    description: "Entdecke die Muster, die das Fundament des Sudoku bilden.",
    levelRange: [0, 4],
    color: "#4A7D78", // Primäre Teal-Farbe
    completionMessage: "Du hast die Grundlagen gemeistert. Die tieferen Muster des Sudoku erwarten deine Entdeckung."
  },
  {
    id: "insight",
    name: "Pfad der Erkenntnis",
    description: "Vertiefe dein Verständnis für die Beziehungen zwischen den Zahlen.",
    levelRange: [5, 9],
    color: "#6CACA6", // Helleres Teal
    completionMessage: "Deine Erkenntnisse haben sich vertieft. Nun beginnt die Reise zur wahren Meisterschaft."
  },
  {
    id: "mastery",
    name: "Pfad der Meisterschaft",
    description: "Verfeinere deine Techniken und entwickle deine eigene Intuition.",
    levelRange: [10, 14],
    color: "#F6AD37", // Warmes Orange
    completionMessage: "Du beherrschst nun die Kunst des Sudoku. Der Weg zur Weisheit liegt vor dir."
  },
  {
    id: "wisdom",
    name: "Pfad der Weisheit",
    description: "Erkenne die tieferen Zusammenhänge und erreiche eine neue Ebene des Verständnisses.",
    levelRange: [15, 19],
    color: "#9333EA", // Tiefes Lila
    completionMessage: "Deine Weisheit leuchtet. Der Pfad der Transzendenz erwartet dich."
  },
  {
    id: "transcendence",
    name: "Pfad der Transzendenz",
    description: "Erlebe den Fluss des Spiels, wo Intuition und Logik eins werden.",
    levelRange: [20, 50],
    color: "#2563EB", // Tiefes Blau
    completionMessage: "Du hast die höchste Ebene erreicht. Das Rätsel und du seid eins geworden."
  }
];

// Erfahrungspunkte für jedes Level
export const levels: LevelThreshold[] = [
  // Pfad der Grundlagen
  {
    xp: 0,
    name: "Neugieriger Geist",
    message: "Jede Reise beginnt mit Neugier und Offenheit.",
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 5,
    name: "Mustersucher",
    message: "Erkenne, wie Zahlen ihre Geheimnisse durch Muster offenbaren.",
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 15,
    name: "Aufmerksamer Schüler",
    message: "Deine Aufmerksamkeit für Details wächst mit jedem Rätsel.",
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 30,
    name: "Geduldiger Betrachter",
    message: "In der Ruhe und Geduld liegt der Schlüssel zum Rätsel.",
    path: "fundamentals",
    pathIndex: 0
  },
  {
    xp: 50,
    name: "Grundlagenfinder",
    message: "Du siehst nun deutlich das Fundament, auf dem jedes Sudoku aufbaut.",
    path: "fundamentals",
    pathIndex: 0
  },
  
  // Pfad der Erkenntnis
  {
    xp: 75,
    name: "Klarheitssucher",
    message: "Mit jedem gelösten Rätsel wird dein Blick klarer.",
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 105,
    name: "Möglichkeitswäger",
    message: "Du lernst, die vielen Möglichkeiten zu sehen und abzuwägen.",
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 140,
    name: "Beziehungserkenner",
    message: "Die Verbindungen zwischen den Zahlen enthüllen sich deinem Geist.",
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 180,
    name: "Musterverflechter",
    message: "Du verbindest Muster zu einem größeren Ganzen.",
    path: "insight",
    pathIndex: 1
  },
  {
    xp: 225,
    name: "Einsichtsvoller Denker",
    message: "Deine Einsichten verschmelzen zu einem tieferen Verständnis.",
    path: "insight",
    pathIndex: 1
  },
  
  // Pfad der Meisterschaft
  {
    xp: 275,
    name: "Geschickter Anwender",
    message: "Techniken und Strategien werden zu deinen Werkzeugen.",
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 330,
    name: "Präziser Praktiker",
    message: "Deine Herangehensweise wird immer präziser und effizienter.",
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 390,
    name: "Fließender Löser",
    message: "Deine Lösungswege werden fließender und natürlicher.",
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 455,
    name: "Intuitiver Denker",
    message: "Intuition beginnt, deine Logik zu ergänzen.",
    path: "mastery",
    pathIndex: 2
  },
  {
    xp: 525,
    name: "Ausgeglichener Meister",
    message: "Logik und Intuition sind nun in deinem Geist im Gleichgewicht.",
    path: "mastery",
    pathIndex: 2
  },
  
  // Pfad der Weisheit
  {
    xp: 600,
    name: "Ruhiger Beobachter",
    message: "In der Stille des Geistes siehst du die Lösung am klarsten.",
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 680,
    name: "Tiefgründiger Ergründer",
    message: "Dein Verständnis reicht nun bis in die Tiefe des Rätsels.",
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 765,
    name: "Gelassener Denker",
    message: "Komplexität verliert ihren Schrecken in deiner Gelassenheit.",
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 855,
    name: "Weiser Betrachter",
    message: "Du siehst über das Rätsel hinaus und erkennst seine Harmonie.",
    path: "wisdom",
    pathIndex: 3
  },
  {
    xp: 950,
    name: "Philosophischer Geist",
    message: "Das Sudoku wird zum Spiegel deines klarsten Denkens.",
    path: "wisdom",
    pathIndex: 3
  },
  
  // Pfad der Transzendenz
  {
    xp: 1050,
    name: "Fließender Geist",
    message: "Du löst nicht länger Rätsel - du tanzt mit ihnen.",
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1200,
    name: "Grenzenloser Denker",
    message: "Die Grenzen zwischen Rätsel und Lösung verschwimmen.",
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1350,
    name: "Harmoniegestalter",
    message: "Du erschaffst Harmonie, wo zuvor nur Chaos war.",
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1500,
    name: "Erleuchteter Spieler",
    message: "Das Rätsel ist nicht länger außerhalb, sondern Teil von dir.",
    path: "transcendence",
    pathIndex: 4
  },
  {
    xp: 1750,
    name: "Zen-Meister",
    message: "Rätsel und Lösender sind nicht länger getrennt.",
    path: "transcendence",
    pathIndex: 4
  }
];

// Meilenstein-Nachrichten bei Erreichen bedeutender Level
export const milestones: Record<number, string> = {
  5: "Du hast den Pfad der Erkenntnis betreten. Dein Verständnis vertieft sich mit jedem Rätsel.",
  10: "Der Pfad der Meisterschaft heißt dich willkommen. Deine Übung beginnt, sich in Intuition zu verwandeln.",
  15: "Auf dem Pfad der Weisheit erkennst du nun die tieferen Zusammenhänge des Sudoku.",
  20: "Der Pfad der Transzendenz liegt nun vor dir. Die höchste Stufe der Sudoku-Kunst ist in Reichweite."
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