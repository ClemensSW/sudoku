import { ImageSourcePropType } from "react-native";

/**
 * Repräsentiert ein einzelnes Segment eines Landschaftsbildes
 */
export interface LandscapeSegment {
  id: number;         // Index des Segments (0-8)
  isUnlocked: boolean; // Ob das Segment freigeschaltet ist
  unlockedAt?: string; // Wann das Segment freigeschaltet wurde
}

/**
 * Repräsentiert ein einzelnes Landschaftsbild in der Sammlung
 */
export interface Landscape {
  id: string;           // Eindeutige ID
  name: string;         // Name der Landschaft
  description: string;  // Kurze Beschreibung
  previewSource: ImageSourcePropType; // Vorschaubild (komplett)
  fullSource: ImageSourcePropType;    // Vollbild für Hintergrund
  segments: LandscapeSegment[];       // Die 9 Segmente des Bildes
  progress: number;                   // Anzahl freigeschalteter Segmente (0-9)
  isComplete: boolean;                // Ob alle Segmente freigeschaltet sind
  isFavorite: boolean;                // Ob als Favorit markiert
  completedAt?: string;               // Wann komplett freigeschaltet
  category: LandscapeCategory;        // Kategorie des Bildes
}

/**
 * Kategorien für Landschaftsbilder
 */
export type LandscapeCategory = 
  | "mountains" 
  | "forests" 
  | "lakes" 
  | "beaches" 
  | "winter"
  | "sunsets"
  | "gardens"
  | "sky"
  | "waterfalls"
  | "valleys"
  | "birds";

/**
 * Status der Sammlung im Storage
 */
export interface LandscapeCollection {
  landscapes: Record<string, Landscape>;   // Alle Landschaften
  favorites: string[];                      // IDs der Favoriten
  currentImageId: string;                   // Aktuell in Arbeit
  lastUsedFavoriteIndex: number;            // Für Rotation
  lastChangedDate: string;                  // Für täglichen Wechsel
}

/**
 * Filter-Optionen für die Galerie
 */
export type LandscapeFilter = "all" | "inProgress" | "completed" | "favorites";

/**
 * Event-Typ beim Freischalten eines neuen Segments oder kompletten Bildes
 */
export interface UnlockEvent {
  type: "segment" | "complete"; // Segment oder komplettes Bild
  landscapeId: string;         // ID der betroffenen Landschaft
  segmentId?: number;          // ID des Segments (bei segment-Typ)
}