import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Landscape,
  LandscapeCollection,
  UnlockEvent,
  LandscapeSegment,
} from "./types";
import { getDefaultCollectionState } from "./data";
import { sortLandscapes } from "./sorting";
import { landscapeCache } from "./storageCache";
import { setDirty } from "@/utils/cloudSync/dirtyFlags";

// Storage-Keys
const LANDSCAPE_COLLECTION_KEY = "@sudoku/landscape_collection";
const LAST_UNLOCK_KEY = "@sudoku/last_unlock"; // Für Sperre
const LAST_UNLOCK_EVENT_KEY = "@sudoku/last_unlock_event"; // Für Event-Speicherung

/**
 * Stellt sicher, dass favorites[] und isFavorite-Flags konsistent sind
 */
const ensureFavoritesConsistency = (c: LandscapeCollection): LandscapeCollection => {
  if (!c.favorites) c.favorites = [];
  const unique = Array.from(new Set(c.favorites));
  c.favorites = unique;

  // a) Flag setzen, wenn im Array
  unique.forEach((id) => {
    const l = c.landscapes[id];
    if (l) l.isFavorite = true;
  });

  // b) Fehlende IDs ergänzen, wenn Flag true
  Object.values(c.landscapes).forEach((l) => {
    if (l.isFavorite && !unique.includes(l.id)) {
      c.favorites.push(l.id);
    }
  });

  return c;
};

/**
 * Lädt die Landschaftssammlung aus dem Cache/AsyncStorage
 * Initialisiert eine neue Sammlung, falls keine existiert
 */
export const loadLandscapeCollection = async (): Promise<LandscapeCollection> => {
  try {
    // Hole aus dem Cache (lazy load von AsyncStorage wenn nötig)
    const collection = await landscapeCache.get();
    // Stelle Konsistenz sicher
    const fixed = ensureFavoritesConsistency(collection);
    // Wenn Konsistenz-Fix nötig war, speichere zurück
    if (fixed !== collection) {
      await saveLandscapeCollection(fixed);
    }
    return fixed;
  } catch (error) {
    console.error("Fehler beim Laden der Landschaftssammlung:", error);
    // Bei Fehler trotzdem eine nutzbare Sammlung zurückgeben
    return getDefaultCollectionState();
  }
};

/**
 * Speichert die Landschaftssammlung im Cache (debounced write zu AsyncStorage)
 */
export const saveLandscapeCollection = async (collection: LandscapeCollection): Promise<void> => {
  try {
    // Schreibe in den Cache (debounced AsyncStorage write)
    await landscapeCache.set(collection);

    // Cloud Sync: Markiere als dirty für nächsten Sync
    setDirty('landscapes').catch(err => console.error('[LandscapeStorage] Error setting dirty flag:', err));
  } catch (error) {
    console.error("Fehler beim Speichern der Landschaftssammlung:", error);
  }
};

/**
 * Erzwingt sofortiges Schreiben des Cache in AsyncStorage (für kritische Operationen)
 * Sollte aufgerufen werden bei: App Background, kritischen Updates, vor Navigation
 */
export const flushLandscapeCache = async (): Promise<void> => {
  try {
    await landscapeCache.flushImmediate();
  } catch (error) {
    console.error("Fehler beim Flushen des Landscape-Cache:", error);
  }
};

/** Prüft, ob kürzlich ein Segment freigeschaltet wurde (Throttle/Sperre) */
const hasRecentlyUnlocked = async (): Promise<boolean> => {
  try {
    const lastUnlockTimestamp = await AsyncStorage.getItem(LAST_UNLOCK_KEY);
    if (!lastUnlockTimestamp) return false;
    const lastTime = parseInt(lastUnlockTimestamp);
    const now = Date.now();
    const timeDifference = now - lastTime;
    return timeDifference < 10000; // 10 Sekunden Sperre
  } catch (error) {
    console.error("Fehler beim Prüfen der letzten Freischaltung:", error);
    return false;
  }
};

/** Markiert, dass eine Freischaltung stattgefunden hat */
const markAsUnlocked = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_UNLOCK_KEY, Date.now().toString());
  } catch (error) {
    console.error("Fehler beim Markieren der Freischaltung:", error);
  }
};

/** Speichert das letzte Unlock-Event */
export const saveUnlockEvent = async (event: UnlockEvent): Promise<void> => {
  try {
    await AsyncStorage.setItem(LAST_UNLOCK_EVENT_KEY, JSON.stringify(event));
  } catch (error) {
    console.error("Fehler beim Speichern des Unlock-Events:", error);
  }
};

/** Holt und löscht das letzte Unlock-Event */
export const getAndClearLastUnlockEvent = async (): Promise<UnlockEvent | null> => {
  try {
    const eventData = await AsyncStorage.getItem(LAST_UNLOCK_EVENT_KEY);
    if (eventData) {
      await AsyncStorage.removeItem(LAST_UNLOCK_EVENT_KEY);
      return JSON.parse(eventData) as UnlockEvent;
    }
    return null;
  } catch (error) {
    console.error("Fehler beim Abrufen des Unlock-Events:", error);
    return null;
  }
};

/** Findet die ID der nächsten unvollständigen Landschaft */
const findNextIncompleteImage = (collection: LandscapeCollection): string | null => {
  const { landscapes } = collection;
  const incompleteLandscapeIds = Object.keys(landscapes).filter(
    (id: string) => !landscapes[id].isComplete && landscapes[id].progress < 9
  );
  return incompleteLandscapeIds.length > 0 ? incompleteLandscapeIds[0] : null;
};

/** Ändert das aktuelle Bild, das als nächstes freigeschaltet werden soll */
export const setCurrentProject = async (landscapeId: string): Promise<boolean> => {
  try {
    const collection = await loadLandscapeCollection();
    if (!collection.landscapes[landscapeId]) return false;
    collection.currentImageId = landscapeId;
    await saveLandscapeCollection(collection);
    return true;
  } catch (error) {
    console.error("Fehler beim Ändern des freizuschaltenden Bildes:", error);
    return false;
  }
};

/** Schaltet das nächste verfügbare Segment im aktuellen Bild frei */
export const unlockNextSegment = async (): Promise<UnlockEvent | null> => {
  try {
    const recentlyUnlocked = await hasRecentlyUnlocked();
    if (recentlyUnlocked) return null;

    const collection = await loadLandscapeCollection();
    const { currentImageId, landscapes } = collection;

    if (!currentImageId) {
      console.log("Keine aktuelle Landschaft gesetzt");
      return null;
    }

    const landscape = landscapes[currentImageId];
    if (!landscape) {
      console.log("Landschaft nicht gefunden für ID:", currentImageId);
      return null;
    }

    if (landscape.isComplete) {
      const nextLandscapeId = findNextIncompleteImage(collection);
      if (nextLandscapeId) {
        collection.currentImageId = nextLandscapeId;
        await saveLandscapeCollection(collection);
        return unlockNextSegment();
      }
      return null;
    }

    const segmentIndex = landscape.segments.findIndex((s: LandscapeSegment) => !s.isUnlocked);
    if (segmentIndex === -1) return null;

    landscape.segments[segmentIndex].isUnlocked = true;
    landscape.segments[segmentIndex].unlockedAt = new Date().toISOString();
    landscape.progress += 1;

    if (landscape.progress === 9) {
      landscape.isComplete = true;
      landscape.completedAt = new Date().toISOString();
      // currentImageId bewusst beibehalten
    }

    await saveLandscapeCollection(collection);
    // Kritische Operation - sofort in AsyncStorage schreiben
    await flushLandscapeCache();
    await markAsUnlocked();

    const unlockEvent: UnlockEvent = {
      landscapeId: currentImageId,
      segmentIndex: segmentIndex,
      unlockedAt: new Date().toISOString(),
    };

    await saveUnlockEvent(unlockEvent);
    return unlockEvent;
  } catch (error) {
    console.error("Fehler beim Freischalten eines Segments:", error);
    return null;
  }
};

/** Setzt eine Landschaft als Favorit oder entfernt sie aus den Favoriten */
export const toggleFavorite = async (landscapeId: string): Promise<boolean> => {
  try {
    const collection = await loadLandscapeCollection();

    if (!collection.landscapes[landscapeId]) return false;
    if (!collection.landscapes[landscapeId].isComplete) return false;

    const isFavorite = collection.landscapes[landscapeId].isFavorite;
    collection.landscapes[landscapeId].isFavorite = !isFavorite;

    if (!isFavorite) {
      collection.favorites.push(landscapeId);
    } else {
      collection.favorites = collection.favorites.filter((id: string) => id !== landscapeId);
    }

    await saveLandscapeCollection(collection);
    return !isFavorite;
  } catch (error) {
    console.error("Fehler beim Umschalten des Favoriten-Status:", error);
    return false;
  }
};

/**
 * Holt das nächste Favoritenbild (zyklisch) für die Startseite
 * Fällt bei Bedarf auf ein beliebiges fertiges Bild zurück
 */
export const getCurrentFavoriteBackground = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { favorites = [], landscapes } = collection;
    if (favorites.length === 0) {
      const completed = Object.values(landscapes).filter((l) => l.isComplete || l.progress === 9);
      return completed.length ? completed[0] : null;
    }
    const index = typeof collection.lastUsedFavoriteIndex === "number" ? collection.lastUsedFavoriteIndex : 0;
    const safeIndex = Math.min(Math.max(index, 0), favorites.length - 1);
    const id = favorites[safeIndex];
    return landscapes[id] || null;
  } catch (e) {
    console.error("Fehler bei getCurrentFavoriteBackground:", e);
    return null;
  }
};

export const getNextFavoriteBackground = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { favorites = [], landscapes } = collection;

    // Filter: Nur existierende, fertige Favoriten
    const favoriteIds = favorites.filter((id) => {
      const l = landscapes[id];
      return l && l.isFavorite && (l.isComplete || l.progress === 9);
    });

    if (favoriteIds.length === 0) {
      const completed = Object.values(landscapes).filter((l) => l.isComplete || l.progress === 9);
      return completed.length ? completed[0] : null;
    }

    const last = typeof collection.lastUsedFavoriteIndex === "number" ? collection.lastUsedFavoriteIndex : -1;
    const next = (last + 1) % favoriteIds.length;
    const nextId = favoriteIds[next];

    // Persistiere Index, damit bei jedem Aufruf gewechselt wird
    collection.lastUsedFavoriteIndex = next;
    collection.lastChangedDate = new Date().toISOString();
    await saveLandscapeCollection(collection);

    return landscapes[nextId] || null;
  } catch (error) {
    console.error("Fehler beim Laden des Favoriten-Hintergrunds:", error);
    return null;
  }
};

/** Holt ein tägliches Hintergrundbild aus Favoriten (Beibehaltung für Abwärtskompatibilität) */
export const getDailyBackground = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { favorites, landscapes, lastUsedFavoriteIndex, lastChangedDate } = collection;

    if (favorites.length === 0) {
      const completeLandscapes = Object.values(landscapes).filter(
        (l: Landscape) => l.isComplete || l.progress === 9
      );
      return completeLandscapes.length > 0 ? completeLandscapes[0] : null;
    }

    if (favorites.length === 1) {
      return landscapes[favorites[0]] || null;
    }

    const today = new Date().toDateString();
    const lastChanged = new Date(lastChangedDate).toDateString();

    if (today !== lastChanged) {
      const nextIndex = (lastUsedFavoriteIndex + 1) % favorites.length;
      collection.lastUsedFavoriteIndex = nextIndex;
      collection.lastChangedDate = new Date().toISOString();
      await saveLandscapeCollection(collection);
      return landscapes[favorites[nextIndex]] || null;
    }

    const currentFavoriteId = favorites[lastUsedFavoriteIndex];
    return landscapes[currentFavoriteId] || null;
  } catch (error) {
    console.error("Fehler beim Laden des Hintergrundbildes:", error);
    return null;
  }
};

/** Holt gefilterte Landschaften basierend auf dem Filter-Typ */
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
        filteredLandscapes = Object.values(landscapes).filter((l: Landscape) => !l.isComplete);
        break;
      case "completed":
        filteredLandscapes = Object.values(landscapes).filter((l: Landscape) => l.isComplete || l.progress === 9);
        break;
      case "favorites":
        filteredLandscapes = Object.values(landscapes).filter(
          (l: Landscape) => l.isFavorite && (l.isComplete || l.progress === 9)
        );
        break;
      default:
        filteredLandscapes = Object.values(landscapes);
    }

    return sortLandscapes(filteredLandscapes, currentImageId);
  } catch (error) {
    console.error("Fehler beim Filtern der Landschaften:", error);
    return [];
  }
};

/** Holt die aktuelle aktive Landschaft */
export const getCurrentLandscape = async (): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    const { currentImageId, landscapes } = collection;
    if (!currentImageId) return null;
    return landscapes[currentImageId] || null;
  } catch (error) {
    console.error("Fehler beim Laden der aktuellen Landschaft:", error);
    return null;
  }
};

/** Holt eine spezifische Landschaft anhand ihrer ID */
export const getLandscapeById = async (landscapeId: string): Promise<Landscape | null> => {
  try {
    const collection = await loadLandscapeCollection();
    return collection.landscapes[landscapeId] || null;
  } catch (error) {
    console.error("Fehler beim Laden der Landschaft:", error);
    return null;
  }
};

/** Holt alle Landschaften als Array */
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

/** Alias für externe Nutzung */
export const setCurrentProjectAlias = setCurrentProject;