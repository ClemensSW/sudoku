import AsyncStorage from "@react-native-async-storage/async-storage";
import { Landscape, LandscapeCollection, UnlockEvent } from "./types";
import { getDefaultCollectionState } from "./data";

// Storage-Keys
const LANDSCAPE_COLLECTION_KEY = "@sudoku/landscape_collection";

/**
 * Lädt die Landschaftssammlung aus dem AsyncStorage
 * Initialisiert eine neue Sammlung, falls keine existiert
 */
export const loadLandscapeCollection = async (): Promise<LandscapeCollection> => {
  try {
    const storedData = await AsyncStorage.getItem(LANDSCAPE_COLLECTION_KEY);
    if (storedData) {
      return JSON.parse(storedData) as LandscapeCollection;
    }
    // Keine Daten vorhanden, initialisiere mit Standardwerten
    const defaultCollection = getDefaultCollectionState();
    await saveLandscapeCollection(defaultCollection);
    return defaultCollection;
  } catch (error) {
    console.error("Fehler beim Laden der Landschaftssammlung:", error);
    // Bei Fehler trotzdem eine nutzbare Sammlung zurückgeben
    return getDefaultCollectionState();
  }
};

/**
 * Speichert die Landschaftssammlung im AsyncStorage
 */
export const saveLandscapeCollection = async (collection: LandscapeCollection): Promise<void> => {
  try {
    await AsyncStorage.setItem(LANDSCAPE_COLLECTION_KEY, JSON.stringify(collection));
  } catch (error) {
    console.error("Fehler beim Speichern der Landschaftssammlung:", error);
  }
};

/**
 * Schaltet das nächste verfügbare Segment im aktuellen Bild frei
 * Gibt ein Event zurück, das den Typ der Freischaltung und betroffene IDs enthält
 */
export const unlockNextSegment = async (): Promise<UnlockEvent | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { currentImageId, landscapes } = collection;
    
    // Aktuelle Landschaft abrufen
    const landscape = landscapes[currentImageId];
    if (!landscape) return null;
    
    // Bereits vollständig freigeschaltet?
    if (landscape.isComplete) {
      // Versuche, zum nächsten unvollständigen Bild zu wechseln
      const nextLandscapeId = findNextIncompleteImage(collection);
      if (nextLandscapeId) {
        collection.currentImageId = nextLandscapeId;
        await saveLandscapeCollection(collection);
        return unlockNextSegment(); // Rekursiver Aufruf mit neuer aktiver Landschaft
      }
      return null; // Keine weitere Aktion möglich
    }
    
    // Finde das nächste unfreigeschaltete Segment
    const segmentIndex = landscape.segments.findIndex(s => !s.isUnlocked);
    if (segmentIndex === -1) return null;
    
    // Segment freischalten
    landscape.segments[segmentIndex].isUnlocked = true;
    landscape.segments[segmentIndex].unlockedAt = new Date().toISOString();
    landscape.progress += 1;
    
    // Prüfen, ob Landschaft jetzt komplett ist
    const isComplete = landscape.progress === 9;
    if (isComplete) {
      landscape.isComplete = true;
      landscape.completedAt = new Date().toISOString();
    }
    
    // Änderungen speichern
    await saveLandscapeCollection(collection);
    
    // Event zurückgeben
    return {
      type: isComplete ? "complete" : "segment",
      landscapeId: currentImageId,
      segmentId: isComplete ? undefined : segmentIndex
    };
  } catch (error) {
    console.error("Fehler beim Freischalten eines Segments:", error);
    return null;
  }
};

/**
 * Findet die ID der nächsten unvollständigen Landschaft
 */
const findNextIncompleteImage = (collection: LandscapeCollection): string | null => {
  const { landscapes } = collection;
  
  // Finde Landschaften, die noch nicht vollständig sind
  const incompleteLandscapeIds = Object.keys(landscapes).filter(
    id => !landscapes[id].isComplete
  );
  
  return incompleteLandscapeIds.length > 0 ? incompleteLandscapeIds[0] : null;
};

/**
 * Setzt eine Landschaft als Favorit oder entfernt sie aus den Favoriten
 */
export const toggleFavorite = async (landscapeId: string): Promise<boolean> => {
  try {
    const collection = await loadLandscapeCollection();
    
    if (!collection.landscapes[landscapeId]) return false;
    
    // Prüfen, ob die Landschaft vollständig freigeschaltet ist
    if (!collection.landscapes[landscapeId].isComplete) return false;
    
    // Favoriten-Status umschalten
    const isFavorite = collection.landscapes[landscapeId].isFavorite;
    collection.landscapes[landscapeId].isFavorite = !isFavorite;
    
    // Favoriten-Liste aktualisieren
    if (!isFavorite) {
      // Zu Favoriten hinzufügen
      collection.favorites.push(landscapeId);
    } else {
      // Aus Favoriten entfernen
      collection.favorites = collection.favorites.filter(id => id !== landscapeId);
    }
    
    await saveLandscapeCollection(collection);
    return !isFavorite; // Neuer Favoriten-Status
  } catch (error) {
    console.error("Fehler beim Umschalten des Favoriten-Status:", error);
    return false;
  }
};

/**
 * Holt das aktuelle Hintergrundbild für die Startseite
 * Rotiert automatisch durch die Favoriten, wenn mehrere vorhanden sind
 */
export const getDailyBackground = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { favorites, landscapes, lastUsedFavoriteIndex, lastChangedDate } = collection;
    
    // Wenn keine Favoriten vorhanden sind, nimm das erste vollständige Bild
    // oder gib null zurück, wenn keines verfügbar ist
    if (favorites.length === 0) {
      const completeLandscapes = Object.values(landscapes).filter(l => l.isComplete);
      return completeLandscapes.length > 0 ? completeLandscapes[0] : null;
    }
    
    // Prüfe, ob ein Tageswechsel stattgefunden hat
    const today = new Date().toISOString().split("T")[0];
    const lastDate = lastChangedDate.split("T")[0];
    
    if (today === lastDate) {
      // Gleicher Tag - behalte das aktuelle Bild
      return landscapes[favorites[lastUsedFavoriteIndex]] || null;
    }
    
    // Neuer Tag - rotiere zum nächsten Favoriten
    const newIndex = (lastUsedFavoriteIndex + 1) % favorites.length;
    collection.lastUsedFavoriteIndex = newIndex;
    collection.lastChangedDate = new Date().toISOString();
    
    await saveLandscapeCollection(collection);
    return landscapes[favorites[newIndex]] || null;
  } catch (error) {
    console.error("Fehler beim Abrufen des Hintergrundbildes:", error);
    return null;
  }
};

/**
 * Gibt die aktuelle, in Bearbeitung befindliche Landschaft zurück
 */
export const getCurrentLandscape = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    return collection.landscapes[collection.currentImageId] || null;
  } catch (error) {
    console.error("Fehler beim Abrufen der aktuellen Landschaft:", error);
    return null;
  }
};

/**
 * Liefert alle Landschaften mit dem angegebenen Filter zurück
 */
export const getFilteredLandscapes = async (filter: string): Promise<Landscape[]> => {
  try {
    const collection = await loadLandscapeCollection();
    let landscapes = Object.values(collection.landscapes);
    
    switch (filter) {
      case "inProgress":
        return landscapes.filter(l => l.progress > 0 && !l.isComplete);
      case "completed":
        return landscapes.filter(l => l.isComplete);
      case "favorites":
        return landscapes.filter(l => l.isFavorite);
      default:
        return landscapes;
    }
  } catch (error) {
    console.error("Fehler beim Filtern der Landschaften:", error);
    return [];
  }
};