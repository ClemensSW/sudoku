// components/LevelProgress/index.ts
// Exportiere die Hauptkomponente
export { default } from './LevelProgress';

// Exportiere Unterkomponenten
export { default as LevelBadge } from './components/LevelBadge';
export { default as PathInfo } from './components/PathInfo';

// Exportiere Hooks und Hilfsfunktionen
export { useLevelInfo, formatXPGain, hasLeveledUp, hasPathTransition } from './utils/useLevelInfo';
export { getLevel, getPathForLevel, getLevelProgress } from './utils/levelData';

// Exportiere Typen
export type { 
  LevelInfo, 
  PathInfo as PathInfoType, // Umbenennen um Kollision zu vermeiden 
  LevelThreshold, 
  LevelProgressOptions 
} from './utils/types';