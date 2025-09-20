// screens/GalleryScreen/utils/landscapes/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Landscape, LandscapeCollection, UnlockEvent, LandscapeSegment } from "./types";
import { getDefaultCollectionState } from "./data";
import { sortLandscapes } from "./sorting";

// Storage-Keys
const LANDSCAPE_COLLECTION_KEY = "@sudoku/landscape_collection";
const LAST_UNLOCK_KEY = "@sudoku/last_unlock"; // Für Sperre
const LAST_UNLOCK_EVENT_KEY = "@sudoku/last_unlock_event"; // Für Event-Speicherung

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
 * Prüft, ob eine Freischaltung innerhalb eines Zeitfensters bereits stattgefunden hat
 */
const hasRecentlyUnlocked = async (): Promise<boolean> => {
  try {
    const lastUnlockTimestamp = await AsyncStorage.getItem(LAST_UNLOCK_KEY);
    if (!lastUnlockTimestamp) return false;
    
    // Prüfen, ob die letzte Freischaltung weniger als 10 Sekunden her ist
    const lastTime = parseInt(lastUnlockTimestamp);
    const now = Date.now();
    const timeDifference = now - lastTime;
    
    console.log(`Zeit seit letzter Freischaltung: ${timeDifference}ms`);
    return timeDifference < 10000; // 10 Sekunden Sperre
  } catch (error) {
    console.error("Fehler beim Prüfen der letzten Freischaltung:", error);
    return false;
  }
};

/**
 * Markiert eine Freischaltung als durchgeführt
 */
const markAsUnlocked = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_UNLOCK_KEY, Date.now().toString());
  } catch (error) {
    console.error("Fehler beim Markieren der Freischaltung:", error);
  }
};

/**
 * Speichert das letzte Freischaltungsereignis
 */
export const saveUnlockEvent = async (event: UnlockEvent | null): Promise<void> => {
  try {
    if (event) {
      await AsyncStorage.setItem(LAST_UNLOCK_EVENT_KEY, JSON.stringify(event));
      console.log("Unlock-Event gespeichert:", event);
    } else {
      // Wenn null, lösche das Event
      await AsyncStorage.removeItem(LAST_UNLOCK_EVENT_KEY);
    }
  } catch (error) {
    console.error("Fehler beim Speichern des Unlock-Events:", error);
  }
};

/**
 * Ruft das letzte Freischaltungsereignis ab und löscht es danach
 */
export const getAndClearLastUnlockEvent = async (): Promise<UnlockEvent | null> => {
  try {
    const eventData = await AsyncStorage.getItem(LAST_UNLOCK_EVENT_KEY);
    // Lösche das gespeicherte Event, damit es nur einmal abgerufen werden kann
    await AsyncStorage.removeItem(LAST_UNLOCK_EVENT_KEY);
    
    return eventData ? JSON.parse(eventData) as UnlockEvent : null;
  } catch (error) {
    console.error("Fehler beim Abrufen des Unlock-Events:", error);
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
    (id: string) => !landscapes[id].isComplete
  );
  
  return incompleteLandscapeIds.length > 0 ? incompleteLandscapeIds[0] : null;
};

/**
 * Ändert das aktuelle Bild, das als nächstes freigeschaltet werden soll
 */
export const setCurrentProject = async (landscapeId: string): Promise<boolean> => {
  try {
    const collection = await loadLandscapeCollection();
    
    // Prüfen, ob das Bild existiert und nicht bereits vollständig ist
    if (!collection.landscapes[landscapeId]) return false;
    if (collection.landscapes[landscapeId].isComplete) return false;
    
    // Aktuelles Bild aktualisieren
    collection.currentImageId = landscapeId;
    
    // Speichern
    await saveLandscapeCollection(collection);
    return true;
  } catch (error) {
    console.error("Fehler beim Ändern des freizuschaltenden Bildes:", error);
    return false;
  }
};

/**
 * Schaltet das nächste verfügbare Segment im aktuellen Bild frei
 * Gibt ein Event zurück, das den Typ der Freischaltung und betroffene IDs enthält
 */
export const unlockNextSegment = async (): Promise<UnlockEvent | null> => {
  try {
    // Prüfen, ob kürzlich bereits eine Freischaltung erfolgt ist
    const recentlyUnlocked = await hasRecentlyUnlocked();
    if (recentlyUnlocked) {
      console.log("Freischaltung übersprungen, da bereits kürzlich ein Segment freigeschaltet wurde");
      return null;
    }
    
    const collection = await loadLandscapeCollection();
    const { currentImageId, landscapes } = collection;
    
    // ✅ FIX: Prüfe ob currentImageId null ist
    if (!currentImageId) {
      console.log("Keine aktuelle Landschaft gesetzt");
      return null;
    }
    
    // ✅ FIX: Jetzt ist sicher, dass currentImageId ein string ist
    const landscape = landscapes[currentImageId];
    if (!landscape) {
      console.log("Landschaft nicht gefunden für ID:", currentImageId);
      return null;
    }
    
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
    
    // ✅ FIX: Explizite Typisierung für findIndex callback
    const segmentIndex = landscape.segments.findIndex((s: LandscapeSegment) => !s.isUnlocked);
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
    
    // Freischaltung als erfolgt markieren
    await markAsUnlocked();
    
    // ✅ FIX: currentImageId ist garantiert string an dieser Stelle
    const unlockEvent: UnlockEvent = {
      landscapeId: currentImageId, // TypeScript-Fehler behoben
      segmentIndex: segmentIndex,
      unlockedAt: new Date().toISOString(),
    };
    
    // Event speichern
    await saveUnlockEvent(unlockEvent);
    
    return unlockEvent;
  } catch (error) {
    console.error("Fehler beim Freischalten eines Segments:", error);
    return null;
  }
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
      collection.favorites = collection.favorites.filter((id: string) => id !== landscapeId);
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
      const completeLandscapes = Object.values(landscapes).filter((l: Landscape) => l.isComplete);
      return completeLandscapes.length > 0 ? completeLandscapes[0] : null;
    }
    
    // Nur ein Favorit - verwende ihn
    if (favorites.length === 1) {
      return landscapes[favorites[0]] || null;
    }
    
    // Mehrere Favoriten - rotiere täglich
    const today = new Date().toDateString();
    const lastChanged = new Date(lastChangedDate).toDateString();
    
    if (today !== lastChanged) {
      // Neuer Tag - wechsle zum nächsten Favoriten
      const nextIndex = (lastUsedFavoriteIndex + 1) % favorites.length;
      collection.lastUsedFavoriteIndex = nextIndex;
      collection.lastChangedDate = new Date().toISOString();
      await saveLandscapeCollection(collection);
      
      return landscapes[favorites[nextIndex]] || null;
    }
    
    // Gleicher Tag - verwende den aktuellen Favoriten
    const currentFavoriteId = favorites[lastUsedFavoriteIndex];
    return landscapes[currentFavoriteId] || null;
  } catch (error) {
    console.error("Fehler beim Laden des Hintergrundbildes:", error);
    return null;
  }
};

/**
 * Holt gefilterte Landschaften basierend auf dem Filter-Typ
 */
export const getFilteredLandscapes = async (filter: string): Promise<Landscape[]> => {
  try {
    const collection = await loadLandscapeCollection();
    const { landscapes, currentImageId } = collection;
    
    let filteredLandscapes: Landscape[] = [];
    
    switch (filter) {
      case "all":
        filteredLandscapes = Object.values(landscapes);
        break;
      case "inProgress":
        filteredLandscapes = Object.values(landscapes).filter((l: Landscape) => l.progress > 0 && !l.isComplete);
        break;
      case "completed":
        filteredLandscapes = Object.values(landscapes).filter((l: Landscape) => l.isComplete);
        break;
      case "favorites":
        filteredLandscapes = Object.values(landscapes).filter((l: Landscape) => l.isFavorite);
        break;
      default:
        filteredLandscapes = Object.values(landscapes);
    }
    
    // Sortiere die Landschaften
    return sortLandscapes(filteredLandscapes, currentImageId);
  } catch (error) {
    console.error("Fehler beim Filtern der Landschaften:", error);
    return [];
  }
};

/**
 * Holt die aktuelle aktive Landschaft
 */
export const getCurrentLandscape = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { currentImageId, landscapes } = collection;
    
    // ✅ FIX: Prüfe ob currentImageId null ist
    if (!currentImageId) {
      return null;
    }
    
    // ✅ FIX: Jetzt ist sicher, dass currentImageId ein string ist
    return landscapes[currentImageId] || null;
  } catch (error) {
    console.error("Fehler beim Laden der aktuellen Landschaft:", error);
    return null;
  }
};

/**
 * Holt eine spezifische Landschaft anhand ihrer ID
 */
export const getLandscapeById = async (landscapeId: string): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    return collection.landscapes[landscapeId] || null;
  } catch (error) {
    console.error("Fehler beim Laden der Landschaft:", error);
    return null;
  }
};

/**
 * Holt alle Landschaften als Array
 */
export const getAllLandscapes = async (): Promise<Landscape[]> => {
  try {
    const collection = await loadLandscapeCollection();
    const { currentImageId } = collection;
    const landscapes = Object.values(collection.landscapes);
    
    return sortLandscapes(landscapes, currentImageId);
  } catch (error) {
    console.error("Fehler beim Laden aller Landschaften:", error);
    return [];
  }
};

/**
 * Setzt den aktuellen Projekt-Alias für setCurrentProject
 */
export const setCurrentProjectAlias = setCurrentProject;