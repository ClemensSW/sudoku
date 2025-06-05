// screens/GalleryScreen/utils/landscapes/data.ts
import { Landscape, LandscapeSegment } from "./types";

// Aktuelle Version der Landschaftssammlung
// WICHTIG: Erhöhen, wenn neue Bilder hinzugefügt werden!
export const CURRENT_COLLECTION_VERSION = 1;

/**
 * KATEGORIEN DEFINITION UND ÜBERSETZUNG
 * Hier neue Kategorien hinzufügen - automatisch überall verfügbar!
 */
export const LANDSCAPE_CATEGORIES = {
  mountains: "Berge",
  forests: "Wälder", 
  lakes: "Seen",
  beaches: "Strände",
  winter: "Winter",
  sunsets: "Sonnenuntergänge",
  gardens: "Gärten",
  sky: "Himmel",
  waterfalls: "Wasserfälle",
  valleys: "Täler",
  birds: "Vögel",
  // Neue Kategorien einfach hier hinzufügen:
  // deserts: "Wüsten",
  // cities: "Städte",
} as const;

// Typ für Kategorien (wird automatisch aus dem Objekt generiert)
export type LandscapeCategory = keyof typeof LANDSCAPE_CATEGORIES;

// Helper-Funktion für Kategorie-Namen
export const getCategoryName = (category: string): string => {
  return LANDSCAPE_CATEGORIES[category as LandscapeCategory] || category;
};

/**
 * Erzeugt ein Array von 9 leeren Segmenten für ein neues Landschaftsbild
 */
const createEmptySegments = (): LandscapeSegment[] => {
  return Array.from({ length: 9 }, (_, index) => ({
    id: index,
    isUnlocked: false,
  }));
};

/**
 * BILDSAMMLUNG
 * Hier neue Bilder hinzufügen - einfach das Schema kopieren!
 * 
 * Anleitung:
 * 1. Bilder in assets/imageCollection/[kategorie]/ ablegen
 *    - [name]_640.jpg (Preview)
 *    - [name]_1920.jpg (Vollbild)
 * 2. Neuen Eintrag hier hinzufügen
 * 3. CURRENT_COLLECTION_VERSION erhöhen
 * 4. Fertig!
 */
export const initialLandscapes: Landscape[] = [
  {
    id: "mountains-fuji",
    name: "Fujisan",
    description:
      "Der majestätische Mount Fuji mit schneebedecktem Gipfel über einem stillen See",
    previewSource: require("@/assets/imageCollection/mountains/mountains-fuji_640.jpg"),
    fullSource: require("@/assets/imageCollection/mountains/mountains-fuji_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "mountains",
  },
  {
    id: "gardens-japanese",
    name: "Teegarten",
    description:
      "Traditionelles japanisches Teehaus unter leuchtend roten Ahornbäumen",
    previewSource: require("@/assets/imageCollection/gardens/gardens-japanese_640.jpg"),
    fullSource: require("@/assets/imageCollection/gardens/gardens-japanese_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "gardens",
  },
  {
    id: "night-skies-1",
    name: "Milchstraße",
    description: "Spektakulärer Blick auf die funkelnde Milchstraße über dunklen Hügeln",
    previewSource: require("@/assets/imageCollection/sky/milky-way_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/milky-way_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "waterfalls-1",
    name: "Wasserfall im Wald",
    description: "Sanft herabstürzender Wasserfall inmitten eines üppigen Waldes",
    previewSource: require("@/assets/imageCollection/waterfalls/waterfall-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/waterfalls/waterfall-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "waterfalls",
  },
  {
    id: "lakes-1",
    name: "Waldsee",
    description: "Ruhiger See umgeben von dicht bewaldeten Bergen und einem kleinen Bootssteg",
    previewSource: require("@/assets/imageCollection/lakes/lake-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/lakes/lake-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "lakes",
  },
  {
    id: "rainforest-toucan",
    name: "Regenbogentukan",
    description: "Ein farbenprächtiger Regenbogentukan sitzt im Regen auf einem Ast mitten im üppigen Regenwald",
    previewSource: require("@/assets/imageCollection/birds/costa-rica-9301364_640.jpg"),
    fullSource: require("@/assets/imageCollection/birds/costa-rica-9301364_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "birds",
  },
  {
    id: "forests-1",
    name: "Bambuswald",
    description: "Dichter Bambuswald mit hoch aufragenden, grünen Halmen",
    previewSource: require("@/assets/imageCollection/forests/bamboo-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/forests/bamboo-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "forests",
  },
  {
    id: "beaches-1",
    name: "Tropenstrand",
    description: "Schneeweißer Sandstrand mit türkisblauem Wasser und schattenspendenden Palmen",
    previewSource: require("@/assets/imageCollection/beaches/beach-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/beaches/beach-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "beaches",
  },
  {
    id: "valley-mist-sunrise",
    name: "Nebel im Tal",
    description: "Morgennebel, der sanft ein grünes Tal umhüllt, mit pastellfarbenem Sonnenaufgangshimmel",
    previewSource: require("@/assets/imageCollection/valleys/fog-7440132_640.jpg"),
    fullSource: require("@/assets/imageCollection/valleys/fog-7440132_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "valleys",
  },
  
  /* 
   * 🎨 NEUE BILDER HIER HINZUFÜGEN 🎨
   * 
   * Beispiel:
   * {
   *   id: "sunset-tropical",
   *   name: "Tropischer Sonnenuntergang",
   *   description: "Palmen silhouettiert vor einem feurigen Abendhimmel",
   *   previewSource: require("@/assets/imageCollection/sunsets/sunset-tropical_640.jpg"),
   *   fullSource: require("@/assets/imageCollection/sunsets/sunset-tropical_1920.jpg"),
   *   segments: createEmptySegments(),
   *   progress: 0,
   *   isComplete: false,
   *   isFavorite: false,
   *   category: "sunsets",
   * },
   */
];

/**
 * Standard-Initialzustand der Landschaftssammlung
 * Das erste Bild wird automatisch vollständig freigeschaltet und als Favorit markiert
 * Das zweite Bild wird zum aktuellen Bild für die weitere Freischaltung
 * und hat bereits 8 von 9 Segmenten freigeschaltet
 */
export const getDefaultCollectionState = () => {
  const landscapes: Record<string, Landscape> = {};

  // Konvertiere Array in ein Record-Objekt und markiere das erste Bild als freigeschaltet
  initialLandscapes.forEach((landscape, index) => {
    if (index === 0) {
      // Das erste Bild vollständig freischalten
      const now = new Date().toISOString();

      // Alle Segmente als freigeschaltet markieren
      const unlockedSegments = Array.from({ length: 9 }, (_, segmentIndex) => ({
        id: segmentIndex,
        isUnlocked: true,
        unlockedAt: now,
      }));

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: unlockedSegments,
        progress: 9,
        isComplete: true,
        isFavorite: true, // Als Favorit markieren
        completedAt: now,
      };
    } else if (index === 1) {
      // Das ZWEITE Bild fast vollständig freischalten - nur ein Segment bleibt übrig
      const now = new Date().toISOString();

      // Alle Segmente außer einem als freigeschaltet markieren
      // Wir lassen nur das letzte Segment (Index 8) unfreigeschaltet
      const almostUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 8, // Die ersten 8 Segmente freischalten
          unlockedAt: segmentIndex < 8 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: almostUnlockedSegments,
        progress: 8, // 8 von 9 Segmenten sind bereits freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else if (index === 2) {
      // Das DRITTE Bild teilweise freischalten - nur 3 Segmente müssen noch freigeschaltet werden
      const now = new Date().toISOString();

      // Die ersten 6 Segmente als freigeschaltet markieren
      const partiallyUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 6, // Die ersten 6 Segmente freischalten
          unlockedAt: segmentIndex < 6 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: partiallyUnlockedSegments,
        progress: 6, // 6 von 9 Segmenten sind bereits freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else if (index === 3) {
      // Das VIERTE Bild teilweise freischalten - nur 6 Segmente müssen noch freigeschaltet werden
      const now = new Date().toISOString();

      // Die ersten 3 Segmente als freigeschaltet markieren
      const barelyUnlockedSegments = Array.from(
        { length: 9 },
        (_, segmentIndex) => ({
          id: segmentIndex,
          isUnlocked: segmentIndex < 3, // Die ersten 3 Segmente freischalten
          unlockedAt: segmentIndex < 3 ? now : undefined,
        })
      );

      // Kopiere das Landschaftsobjekt und aktualisiere die Eigenschaften
      landscapes[landscape.id] = {
        ...landscape,
        segments: barelyUnlockedSegments,
        progress: 3, // 3 von 9 Segmenten sind bereits freigeschaltet
        isComplete: false,
        isFavorite: false,
      };
    } else {
      // Alle anderen Bilder bleiben unverändert
      landscapes[landscape.id] = landscape;
    }
  });

  // Als aktuelles Bild das ZWEITE Bild setzen (Index 1)
  // So beginnt der Nutzer mit der Freischaltung des zweiten Bildes
  const currentImageId =
    initialLandscapes.length > 1
      ? initialLandscapes[1].id
      : initialLandscapes[0].id;

  return {
    landscapes,
    favorites: [initialLandscapes[0].id], // Das erste Bild als Favorit hinzufügen
    currentImageId, // Das zweite Bild als aktuelles Bild setzen
    lastUsedFavoriteIndex: 0,
    lastChangedDate: new Date().toISOString(),
    version: CURRENT_COLLECTION_VERSION, // Aktuelle Versionsnummer
  };
};