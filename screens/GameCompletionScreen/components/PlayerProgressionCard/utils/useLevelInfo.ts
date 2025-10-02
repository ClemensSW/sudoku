// components/LevelProgress/utils/useLevelInfo.ts
import { useMemo } from 'react';
import { LevelInfo } from './types';
import { 
  levels, 
  paths, 
  getLevel, 
  getPathForLevel, 
  getNextLevelThreshold,
  milestones 
} from './levelData';

/**
 * Custom Hook, der alle relevanten Level-Informationen für die gegebene XP berechnet
 * @param xp Die aktuellen Erfahrungspunkte des Spielers
 * @returns Objekt mit umfassenden Level-Informationen
 */
export function useLevelInfo(xp: number): LevelInfo {
  return useMemo(() => {
    // Aktuelles Level ermitteln
    const currentLevel = getLevel(xp);
    const levelData = levels[currentLevel];
    
    // Nächstes Level ermitteln (wenn nicht bereits maximales Level erreicht)
    const nextLevelData = currentLevel < levels.length - 1 ? levels[currentLevel + 1] : null;
    
    // Informationen zum aktuellen Pfad
    const currentPath = getPathForLevel(currentLevel);
    
    // Prüfen, ob dies das letzte Level im aktuellen Pfad ist
    const isLastInPath = currentPath.levelRange[1] === currentLevel;
    
    // XP-Fortschritt zum nächsten Level berechnen
    const currentLevelXP = levelData.xp;
    const nextLevelXP = nextLevelData ? nextLevelData.xp : currentLevelXP + 1000; // Fallback für max Level
    const xpForNextLevel = nextLevelXP - xp;
    const levelXPRange = nextLevelXP - currentLevelXP;
    const progressPercentage = Math.min(100, Math.round(((xp - currentLevelXP) / levelXPRange) * 100));

    // Meilenstein-Nachricht ermitteln (falls vorhanden)
    const milestoneMessage = nextLevelData && milestones[nextLevelData.pathIndex === 0 ? currentLevel + 1 : 0] || null;
    
    // Pfad-Abschlussnachricht ermitteln (falls vorhanden und letztes Level im Pfad)
    const pathCompletionMessage = isLastInPath ? currentPath.completionMessage : null;
    
    // Formatierte Anzeigewerte für die UI generieren
    const displayName = `Level ${currentLevel + 1}: ${levelData.name}`;
    
    // Berechne Pfad-Fortschritt (z.B. 2/5)
    const pathProgress = levelData.pathIndex + 1;
    const pathTotal = currentPath.levelRange[1] - currentPath.levelRange[0] + 1;
    const displayPath = `${currentPath.name} (${pathProgress}/${pathTotal})`;
    
    return {
      xp,
      currentLevel,
      levelData,
      nextLevelData,
      currentPath,
      isLastInPath,
      progressPercentage,
      xpForNextLevel,
      milestoneMessage,
      pathCompletionMessage,
      displayName,
      displayPath
    };
  }, [xp]);
}

/**
 * Berechnet die XP-Differenz und gibt eine formatierte Zeichenkette zurück
 * @param newXP Die neuen XP nach einer Aktion
 * @param oldXP Die vorherigen XP
 * @returns Formatierte XP-Differenz (z.B. "+5 XP")
 */
export function formatXPGain(newXP: number, oldXP: number): string {
  const gain = newXP - oldXP;
  return gain > 0 ? `+${gain} XP` : `${gain} XP`;
}

/**
 * Prüft, ob ein Level-Up stattgefunden hat
 * @param newXP Die neuen XP
 * @param oldXP Die vorherigen XP
 * @returns True, wenn ein Level-Up stattgefunden hat
 */
export function hasLeveledUp(newXP: number, oldXP: number): boolean {
  return getLevel(newXP) > getLevel(oldXP);
}

/**
 * Prüft, ob ein Pfad-Übergang stattgefunden hat
 * @param newXP Die neuen XP
 * @param oldXP Die vorherigen XP
 * @returns True, wenn ein Pfad-Übergang stattgefunden hat
 */
export function hasPathTransition(newXP: number, oldXP: number): boolean {
  const oldLevel = getLevel(oldXP);
  const newLevel = getLevel(newXP);
  
  if (oldLevel === newLevel) return false;
  
  const oldPath = getPathForLevel(oldLevel);
  const newPath = getPathForLevel(newLevel);
  
  return oldPath.id !== newPath.id;
}