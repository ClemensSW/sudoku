// components/GameCompletionModal/components/LevelProgress/utils/index.ts

// Exportiere alle benötigten Funktionen
export { 
  useLevelInfo, 
  formatXPGain, 
  hasLeveledUp, 
  hasPathTransition 
} from './useLevelInfo';

export { 
  getLevel, 
  getPathForLevel, 
  getLevelProgress,
  calculateXpGain, // Behalte diesen Export
  levels,
  paths,
  milestones
} from './levelData';

// Exportiere Typen
export type { 
  LevelInfo, 
  PathInfo as PathInfoType, 
  LevelThreshold, 
  LevelProgressOptions 
} from './types';