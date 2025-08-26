// screens/GalleryScreen/utils/landscapes/sorting.ts
import { Landscape } from "./types";

/**
 * Sortiert die Landschaftsbilder nach folgender Logik:
 * 1. Aktuell aktives Bild (das gerade freigeschaltet wird)
 * 2. Die ersten 4 Bilder in fester Reihenfolge
 * 3. Vollständig freigeschaltete Bilder
 * 4. Restliche Bilder in zufälliger (aber konsistenter) Reihenfolge
 */
export const sortLandscapes = (
  landscapes: Landscape[],
  currentImageId: string | null
): Landscape[] => {
  // IDs der ersten vier Bilder in fester Reihenfolge
  const fixedOrderIds = [
    "mountains-fuji",      // Sudoku Duo
    "gardens-japanese",     // Teegarten
    "night-skies-1",       // Milchstraße
    "rainforest-toucan",   // Regenbogentukan
  ];

  // Finde das aktuelle Bild
  const currentImage = currentImageId 
    ? landscapes.find(l => l.id === currentImageId)
    : null;

  // Separiere die Bilder in Kategorien
  const fixedOrderImages: Landscape[] = [];
  const completedImages: Landscape[] = [];
  const remainingImages: Landscape[] = [];

  // Erstelle eine Map für schnelleren Zugriff auf die ersten 4 Bilder
  const fixedOrderMap = new Map<string, number>();
  fixedOrderIds.forEach((id, index) => {
    fixedOrderMap.set(id, index);
  });

  landscapes.forEach(landscape => {
    // Überspringe das aktuelle Bild (wird separat behandelt)
    if (currentImage && landscape.id === currentImage.id) {
      return;
    }

    // Prüfe ob es eines der ersten 4 Bilder ist
    if (fixedOrderMap.has(landscape.id)) {
      fixedOrderImages.push(landscape);
    } 
    // Prüfe ob es vollständig freigeschaltet ist
    else if (landscape.isComplete) {
      completedImages.push(landscape);
    } 
    // Ansonsten zu den restlichen Bildern
    else {
      remainingImages.push(landscape);
    }
  });

  // Sortiere die ersten 4 Bilder in die richtige Reihenfolge
  fixedOrderImages.sort((a, b) => {
    const indexA = fixedOrderMap.get(a.id) ?? 999;
    const indexB = fixedOrderMap.get(b.id) ?? 999;
    return indexA - indexB;
  });

  // Sortiere die restlichen Bilder "zufällig" aber konsistent
  // Verwende eine einfache Hash-Funktion basierend auf der ID
  remainingImages.sort((a, b) => {
    return hashCode(a.id) - hashCode(b.id);
  });

  // Baue das finale Array zusammen
  const sortedLandscapes: Landscape[] = [];

  // 1. Aktuelles Bild (wenn vorhanden und nicht vollständig)
  if (currentImage && !currentImage.isComplete) {
    sortedLandscapes.push(currentImage);
  }

  // 2. Die ersten 4 Bilder in fester Reihenfolge
  sortedLandscapes.push(...fixedOrderImages);

  // 3. Vollständig freigeschaltete Bilder (außer den bereits hinzugefügten)
  sortedLandscapes.push(...completedImages);

  // 4. Restliche Bilder in "zufälliger" Reihenfolge
  sortedLandscapes.push(...remainingImages);

  return sortedLandscapes;
};

/**
 * Einfache Hash-Funktion für konsistente "Zufalls"-Sortierung
 */
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

/**
 * Filtert Landschaften basierend auf dem ausgewählten Tab
 */
export const filterLandscapesByTab = (
  landscapes: Landscape[],
  tab: 'all' | 'inProgress' | 'completed' | 'favorites'
): Landscape[] => {
  switch (tab) {
    case 'all':
      return landscapes;
    case 'inProgress':
      return landscapes.filter(l => l.progress > 0 && !l.isComplete);
    case 'completed':
      return landscapes.filter(l => l.isComplete);
    case 'favorites':
      return landscapes.filter(l => l.isFavorite);
    default:
      return landscapes;
  }
};