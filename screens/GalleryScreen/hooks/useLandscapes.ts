import { useState, useEffect, useCallback } from "react";
import {
  Landscape,
  LandscapeCollection,
  UnlockEvent,
} from "@/screens/GalleryScreen/utils/landscapes/types";
import {
  loadLandscapeCollection,
  unlockNextSegment,
  toggleFavorite as toggleFavoriteStorage,
  getFilteredLandscapes,
  getCurrentLandscape,
  getAndClearLastUnlockEvent,
} from "@/screens/GalleryScreen/utils/landscapes/storage";

/**
 * Custom Hook für die Verwaltung der Landschaftssammlung
 */
export const useLandscapes = (initialFilter = "all") => {
  // Zustände
  const [isLoading, setIsLoading] = useState(true);
  const [collection, setCollection] = useState<LandscapeCollection | null>(
    null
  );
  const [landscapes, setLandscapes] = useState<Landscape[]>([]);
  const [currentLandscape, setCurrentLandscape] = useState<Landscape | null>(
    null
  );
  const [filter, setFilter] = useState(initialFilter);
  const [unlockEvent, setUnlockEvent] = useState<UnlockEvent | null>(null);

  // Lädt die gesamte Sammlung
  const loadCollection = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await loadLandscapeCollection();
      setCollection(data);
    } catch (error) {
      console.error("Fehler beim Laden der Sammlung:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Lädt die aktuelle Landschaft
  const loadCurrentLandscape = useCallback(async () => {
    try {
      const landscape = await getCurrentLandscape();
      setCurrentLandscape(landscape);
    } catch (error) {
      console.error("Fehler beim Laden der aktuellen Landschaft:", error);
    }
  }, []);

  // Lädt gefilterte Landschaften
  const loadFilteredLandscapes = useCallback(async (filterType: string) => {
    try {
      const filteredLandscapes = await getFilteredLandscapes(filterType);
      setLandscapes(filteredLandscapes);
    } catch (error) {
      console.error("Fehler beim Filtern der Landschaften:", error);
    }
  }, []);

  // Schaltet das nächste Segment frei
  const unlockNext = useCallback(async () => {
    try {
      const event = await unlockNextSegment();
      if (event) {
        setUnlockEvent(event);
        // Aktualisiere die Daten
        loadCollection();
        loadCurrentLandscape();
        loadFilteredLandscapes(filter);
      }
      return event;
    } catch (error) {
      console.error("Fehler beim Freischalten des nächsten Segments:", error);
      return null;
    }
  }, [filter, loadCollection, loadCurrentLandscape, loadFilteredLandscapes]);

  // NEU: Holt das letzte Unlock-Event und löscht es
  const getLastUnlockEvent = useCallback(async () => {
    try {
      const event = await getAndClearLastUnlockEvent();
      if (event) {
        setUnlockEvent(event);
        // Aktualisiere die Daten
        loadCollection();
        loadCurrentLandscape();
        loadFilteredLandscapes(filter);
      }
      return event;
    } catch (error) {
      console.error("Fehler beim Abrufen des letzten Unlock-Events:", error);
      return null;
    }
  }, [filter, loadCollection, loadCurrentLandscape, loadFilteredLandscapes]);

  // Favoriten-Status umschalten
  const toggleFavorite = useCallback(
    async (landscapeId: string) => {
      try {
        const newStatus = await toggleFavoriteStorage(landscapeId);
        // Aktualisiere die Daten
        loadCollection();
        loadFilteredLandscapes(filter);
        return newStatus;
      } catch (error) {
        console.error("Fehler beim Umschalten des Favoriten-Status:", error);
        return false;
      }
    },
    [filter, loadCollection, loadFilteredLandscapes]
  );

  // Filter ändern
  const changeFilter = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      loadFilteredLandscapes(newFilter);
    },
    [loadFilteredLandscapes]
  );

  // Zurücksetzen des Unlock-Events
  const clearUnlockEvent = useCallback(() => {
    setUnlockEvent(null);
  }, []);

  // Lade die Daten beim ersten Rendern
  useEffect(() => {
    loadCollection();
    loadCurrentLandscape();
    loadFilteredLandscapes(filter);
  }, [loadCollection, loadCurrentLandscape, loadFilteredLandscapes, filter]);

  return {
    isLoading,
    collection,
    landscapes,
    currentLandscape,
    filter,
    unlockEvent,
    unlockNext,
    toggleFavorite,
    changeFilter,
    clearUnlockEvent,
    getLastUnlockEvent, // NEU: Funktion hinzugefügt
    reload: loadCollection,
  };
};
