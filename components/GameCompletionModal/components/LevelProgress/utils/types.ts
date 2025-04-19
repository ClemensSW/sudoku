// components/LevelProgress/utils/types.ts

/**
 * Informationen zu einem einzelnen Pfad im Progressionssystem
 */
export interface PathInfo {
    /** Eindeutige ID des Pfades */
    id: string;
    
    /** Anzeigename des Pfades */
    name: string;
    
    /** Kurze Beschreibung des Pfades und seiner Bedeutung */
    description: string;
    
    /** Bereich der Level in diesem Pfad [min, max] */
    levelRange: [number, number];
    
    /** Themenfarbe für diesen Pfad (HEX oder RGB) */
    color: string;
    
    /** Nachricht, die angezeigt wird, wenn ein Spieler diesen Pfad abschließt */
    completionMessage: string;
  }
  
  /**
   * Definition eines einzelnen Levels mit seinen Eigenschaften
   */
  export interface LevelThreshold {
    /** Benötigte XP für dieses Level */
    xp: number;
    
    /** Name/Titel des Levels */
    name: string;
    
    /** Motivierende Botschaft für dieses Level */
    message: string;
    
    /** ID des Pfades, zu dem dieses Level gehört */
    path: string;
    
    /** Position innerhalb des Pfades (0-4 typischerweise) */
    pathIndex: number;
  }
  
  /**
   * Vollständige berechnete Informationen zu einem Level für die UI-Anzeige
   */
  export interface LevelInfo {
    /** Aktuelle XP des Spielers */
    xp: number;
    
    /** Aktuelles Level (Index) */
    currentLevel: number;
    
    /** Daten zum aktuellen Level */
    levelData: LevelThreshold;
    
    /** Daten zum nächsten Level (null, wenn max. Level erreicht) */
    nextLevelData: LevelThreshold | null;
    
    /** Informationen zum aktuellen Pfad */
    currentPath: PathInfo;
    
    /** Ist dies das letzte Level im aktuellen Pfad? */
    isLastInPath: boolean;
    
    /** Fortschrittsprozentwert zum nächsten Level (0-100) */
    progressPercentage: number;
    
    /** Benötigte XP bis zum nächsten Level */
    xpForNextLevel: number;
    
    /** Meilenstein-Nachricht (wenn vorhanden) */
    milestoneMessage: string | null;
    
    /** Pfad-Abschlussnachricht (wenn letzte Stufe abgeschlossen) */
    pathCompletionMessage: string | null;
    
    /** Formatierter Levelname für die Anzeige */
    displayName: string;
    
    /** Formatierter Pfadname mit Fortschritt für die Anzeige */
    displayPath: string;
  }
  
  /**
   * Optionen für LevelProgress-Komponenten
   */
  export interface LevelProgressOptions {
    /** Animation für Level-Up aktivieren */
    enableLevelUpAnimation?: boolean;
    
    /** Pfad-Farben für Fortschrittsbalken verwenden */
    usePathColors?: boolean;
    
    /** Pfad-Beschreibungen anzeigen */
    showPathDescription?: boolean;
    
    /** Meilenstein-Nachrichten anzeigen */
    showMilestones?: boolean;
  }