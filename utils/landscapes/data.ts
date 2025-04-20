import { Landscape, LandscapeSegment } from "./types";

/**
 * Erzeugt ein Array von 9 leeren Segmenten für ein neues Landschaftsbild
 */
const createEmptySegments = (): LandscapeSegment[] => {
  return Array.from({ length: 9 }, (_, index) => ({
    id: index,
    isUnlocked: false
  }));
};

/**
 * Initiale Sammlung von Landschaftsbildern
 * Hinweis: Die tatsächlichen Bildpfade müssen angepasst werden
 */
export const initialLandscapes: Landscape[] = [
  {
    id: "mountains-1",
    name: "Alpenpanorama",
    description: "Majestätische Berggipfel im Morgenlicht",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "mountains"
  },
  {
    id: "lakes-1",
    name: "Bergsee",
    description: "Kristallklarer See umgeben von Nadelwäldern",
    previewSource: require("@/assets/landscapes/travel-4959716_1280.jpg"),
    fullSource: require("@/assets/landscapes/travel-4959716_1280.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "lakes"
  },
  {
    id: "forests-1",
    name: "Nebelwald",
    description: "Mystischer Wald im Morgennebel",
    previewSource: require("@/assets/landscapes/landscape-4484408_1920.jpg"),
    fullSource: require("@/assets/landscapes/landscape-4484408_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "forests"
  },
  {
    id: "beaches-1",
    name: "Tropischer Strand",
    description: "Palmengesäumter Sandstrand mit türkisblauem Wasser",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "beaches"
  },
  {
    id: "sunsets-1",
    name: "Sonnenuntergang am Meer",
    description: "Spektakulärer Sonnenuntergang über dem Horizont",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "sunsets"
  },
  {
    id: "winter-1",
    name: "Winterwunderland",
    description: "Verschneite Landschaft mit zugefrorenen See",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "winter"
  },
  {
    id: "mountains-2",
    name: "Bergdorf",
    description: "Idyllisches Dorf inmitten majestätischer Berge",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "mountains"
  },
  {
    id: "lakes-2",
    name: "Seerosenteich",
    description: "Teich mit Seerosen im warmen Abendlicht",
    previewSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    fullSource: require("@/assets/landscapes/kenrokuen-garden-9511300_1920.jpg"),
    segments: createEmptySegments(),
    progress: 0,
    isComplete: false,
    isFavorite: false,
    category: "lakes"
  }
];

/**
 * Standard-Initialzustand der Landschaftssammlung
 * Das erste Bild wird automatisch zum aktuellen Bild
 */
export const getDefaultCollectionState = () => {
  const landscapes: Record<string, Landscape> = {};
  
  // Konvertiere Array in ein Record-Objekt
  initialLandscapes.forEach(landscape => {
    landscapes[landscape.id] = landscape;
  });
  
  return {
    landscapes,
    favorites: [],
    currentImageId: initialLandscapes[0].id,
    lastUsedFavoriteIndex: 0,
    lastChangedDate: new Date().toISOString()
  };
};