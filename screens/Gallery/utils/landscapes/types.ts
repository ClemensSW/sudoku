// screens/GalleryScreen/utils/landscapes/types.ts

// Export the category type from data.ts
export type LandscapeCategory = 
  | "cities"
  | "architecture"
  | "animals"
  | "plants"
  | "landscapes"
  | "water"
  | "sky"
  | "path";

// Segment-Typ für die einzelnen Teile eines Bildes
export interface LandscapeSegment {
  id: number;
  isUnlocked: boolean;
  unlockedAt?: string; // ISO-String des Freischaltungszeitpunkts
}

// Haupttyp für Landschaftsbilder
export interface Landscape {
  id: string;
  name: string;
  description: string;
  previewSource: any; // Image source type
  fullSource: any; // Image source type
  segments: LandscapeSegment[];
  progress: number; // Anzahl freigeschalteter Segmente (0-9)
  isComplete: boolean;
  isFavorite: boolean;
  category: LandscapeCategory;
  completedAt?: string; // ISO-String des Abschlusszeitpunkts
}

// Collection-Typ für die gesamte Sammlung
export interface LandscapeCollection {
  landscapes: Record<string, Landscape>;
  favorites: string[]; // Array von Landschafts-IDs
  currentImageId: string | null; // ID des aktuell freigeschalteten Bildes
  lastUsedFavoriteIndex: number;
  lastChangedDate: string; // ISO-String
  version: number; // Versionsnummer der Collection
}

// Filter-Typ für die Galerie-Tabs
export type LandscapeFilter = "all" | "inProgress" | "completed" | "favorites";

// Unlock-Event für die Historie
export interface UnlockEvent {
  landscapeId: string;
  segmentIndex: number;
  unlockedAt: string; // ISO-String
  sudokuDifficulty?: "easy" | "medium" | "hard" | "expert";
  sudokuTime?: number; // Zeit in Sekunden
}