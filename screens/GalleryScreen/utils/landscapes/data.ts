// screens/GalleryScreen/utils/landscapes/data.ts
import { Landscape, LandscapeSegment } from "./types";

// Aktuelle Version der Landschaftssammlung
// WICHTIG: Erhöhen, wenn neue Bilder hinzugefügt werden!
export const CURRENT_COLLECTION_VERSION = 2;

/**
 * KATEGORIEN DEFINITION UND ÜBERSETZUNG
 * Hier neue Kategorien hinzufügen - automatisch überall verfügbar!
 */
export const LANDSCAPE_CATEGORIES = {
  cities: "Städte",
  architecture: "Architektur",
  animals: "Tiere",
  plants: "Pflanzen",
  landscapes: "Landschaften",
  water: "Wasser",
  sky: "Himmel",
  path: "Deine Reise",
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
    name: "Sudoku Duo",
    description:
      "Ein Sudoku-Heft mit Bleistift auf der Fensterbank. Eine Einladung für deine Rätselreise.",
    previewSource: require("@/assets/imageCollection/sudoku-duo_640.jpg"),
    fullSource: require("@/assets/imageCollection/sudoku-duo_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "path",
  },
  {
    id: "gardens-japanese",
    name: "Teegarten",
    description:
      "Traditionelles japanisches Teehaus unter leuchtend roten Ahornbäumen",
    previewSource: require("@/assets/imageCollection/architecture/gardens-japanese_640.jpg"),
    fullSource: require("@/assets/imageCollection/architecture/gardens-japanese_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "architecture",
  },
  {
    id: "night-skies-1",
    name: "Milchstraße",
    description:
      "Spektakulärer Blick auf die funkelnde Milchstraße über dunklen Hügeln",
    previewSource: require("@/assets/imageCollection/sky/milky-way_640.jpg"),
    fullSource: require("@/assets/imageCollection/sky/milky-way_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sky",
  },
  {
    id: "rainforest-toucan",
    name: "Regenbogentukan",
    description:
      "Ein farbenprächtiger Regenbogentukan sitzt im Regen auf einem Ast mitten im üppigen Regenwald",
    previewSource: require("@/assets/imageCollection/animals/costa-rica-9301364_640.jpg"),
    fullSource: require("@/assets/imageCollection/animals/costa-rica-9301364_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "animals",
  },
  {
    id: "waterfalls-1",
    name: "Wasserfall",
    description:
      "Sanft herabstürzender Wasserfall inmitten eines üppigen Waldes",
    previewSource: require("@/assets/imageCollection/water/waterfall-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/waterfall-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "lakes-1",
    name: "Waldsee",
    description:
      "Ruhiger See umgeben von dicht bewaldeten Bergen und einem kleinen Bootssteg",
    previewSource: require("@/assets/imageCollection/water/lake-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/lake-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "forests-1",
    name: "Bambuswald",
    description: "Dichter Bambuswald mit hoch aufragenden, grünen Halmen",
    previewSource: require("@/assets/imageCollection/plants/bamboo-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/plants/bamboo-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "plants",
  },
  {
    id: "beaches-1",
    name: "Tropenstrand",
    description:
      "Schneeweißer Sandstrand mit türkisblauem Wasser und schattenspendenden Palmen",
    previewSource: require("@/assets/imageCollection/water/beach-1_640.jpg"),
    fullSource: require("@/assets/imageCollection/water/beach-1_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "water",
  },
  {
    id: "valley-mist-sunrise",
    name: "Nebel im Tal",
    description:
      "Morgennebel, der sanft ein grünes Tal umhüllt, mit pastellfarbenem Sonnenaufgangshimmel",
    previewSource: require("@/assets/imageCollection/landscapes/fog-7440132_640.jpg"),
    fullSource: require("@/assets/imageCollection/landscapes/fog-7440132_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "landscapes",
  },
  {
    id: "cities-kyoto-temple",
    name: "Pagode",
    description:
      "Eine stille Gasse führt dich zu einer leuchtenden Pagode im Abendlicht – ein Tor zu neuen Rätseln.",
    previewSource: require("@/assets/imageCollection/cities/cities-kyoto-temple_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-kyoto-temple_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-tokyo-alley",
    name: "Tokio",
    description:
      "Enge Gassen voller Laternen und Kirschblüten – ein lebendiges Labyrinth, das neue Geheimnisse birgt.",
    previewSource: require("@/assets/imageCollection/cities/cities-tokyo-alley_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-tokyo-alley_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-shanghai-skyline",
    name: "Shanghai",
    description:
      "Glitzernde Wolkenkratzer im Mondlicht – eine Metropole, die niemals schläft und voller Rätsel steckt.",
    previewSource: require("@/assets/imageCollection/cities/cities-shanghai-skyline_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-shanghai-skyline_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-dubai-burj",
    name: "Dubai",
    description:
      "Zwischen endlosen Straßen und funkelnden Türmen ragt ein Bauwerk bis in den Himmel – ein Rätsel der Superlative.",
    previewSource: require("@/assets/imageCollection/cities/cities-dubai-burj_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-dubai-burj_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
    id: "cities-venice-gondola",
    name: "Venedig",
    description:
      "Ein stilles Café mit Blick auf Gondeln im Wasser – ein Ort, an dem Geschichten und Rätsel beginnen.",
    previewSource: require("@/assets/imageCollection/cities/cities-venice-gondola_640.jpg"),
    fullSource: require("@/assets/imageCollection/cities/cities-venice-gondola_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "cities",
  },
  {
  id: "architecture-rome-colosseum",
  name: "Kolosseum",
  description: "Mächtige Mauern voller Geschichte – ein Monument, das seine Geheimnisse wie ein uraltes Rätsel bewahrt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-rome-colosseum_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-rome-colosseum_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-singapore-green",
  name: "Vertikale Gärten",
  description: "Moderne Glasfassaden verschmelzen mit üppigem Grün – ein Bauwerk, das wie ein lebendes Rätsel wirkt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-singapore-green_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-singapore-green_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-singapore-jewel",
  name: "Jewel Wasserfall",
  description: "Ein Wasserfall stürzt mitten in eine gläserne Kuppel – futurale Architektur, die wie ein Tor zu neuen Welten wirkt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-singapore-jewel_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-singapore-jewel_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-germany-castle",
  name: "Burg im Nebel",
  description: "Eine geheimnisvolle Burg erhebt sich aus dem Morgennebel – ein Tor in die Vergangenheit voller ungelöster Rätsel.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-germany-castle_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-germany-castle_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-abu-dhabi-mosque",
  name: "Weiße Moschee",
  description: "Strahlend weiße Kuppeln und goldene Verzierungen – ein Ort der Stille, der wie ein heiliges Rätsel wirkt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-abu-dhabi-mosque_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-abu-dhabi-mosque_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-hobbiton-house",
  name: "Hobbithaus",
  description: "Versteckt im grünen Hügel liegt eine runde Tür – ein märchenhaftes Rätsel, das dich in eine andere Welt einlädt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-hobbiton-house_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-hobbiton-house_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-dubai-burj-night",
  name: "Burj Khalifa",
  description: "Ein Turm aus Glas und Licht ragt in die Wolken – wie ein endloses Rätsel, das den Himmel herausfordert.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-dubai-burj-night_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-dubai-burj-night_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-egypt-pyramid",
  name: "Pyramide von Gizeh",
  description: "Ein uraltes Bauwerk erhebt sich aus der Wüste – ein Rätsel der Menschheit, das bis heute ungelöst scheint.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-egypt-pyramid_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-egypt-pyramid_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
},
{
  id: "architecture-mexico-chichenitza",
  name: "Chichén Itzá",
  description: "Eine gewaltige Stufenpyramide erhebt sich majestätisch – ein Relikt der Maya, das noch immer Rätsel birgt.",
  previewSource: require("@/assets/imageCollection/architecture/architecture-mexico-chichenitza_640.jpg"),
  fullSource: require("@/assets/imageCollection/architecture/architecture-mexico-chichenitza_1920.jpg"),
  segments: createEmptySegments(),
  progress: 0,
  isComplete: false,
  isFavorite: false,
  category: "architecture"
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
