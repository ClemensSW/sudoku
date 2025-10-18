import AsyncStorage from "@react-native-async-storage/async-storage";
import { LandscapeCollection } from "./types";
import { getDefaultCollectionState } from "./data";

// Storage-Keys
const LANDSCAPE_COLLECTION_KEY = "@sudoku/landscape_collection";

/**
 * Singleton Cache für die Landschaftssammlung
 * Reduziert AsyncStorage-Zugriffe von 79+ auf ~1 pro Session
 */
class LandscapeCollectionCache {
  private cache: LandscapeCollection | null = null;
  private isLoading = false;
  private isDirty = false;
  private writeTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly WRITE_DEBOUNCE_MS = 500; // 500ms debounce für Batch-Writes

  /**
   * Lädt die Collection aus dem Cache oder AsyncStorage (lazy load)
   */
  async get(): Promise<LandscapeCollection> {
    // Cache hit - sofortige Rückgabe
    if (this.cache !== null) {
      return this.cache;
    }

    // Verhindere parallele Lade-Operationen
    if (this.isLoading) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isLoading && this.cache !== null) {
            clearInterval(checkInterval);
            resolve(this.cache);
          }
        }, 50);
      });
    }

    // Lade von AsyncStorage
    this.isLoading = true;
    try {
      const storedData = await AsyncStorage.getItem(LANDSCAPE_COLLECTION_KEY);
      if (storedData) {
        this.cache = JSON.parse(storedData) as LandscapeCollection;
      } else {
        // Keine Daten vorhanden, initialisiere mit Standardwerten
        this.cache = getDefaultCollectionState();
        // Speichere sofort (nicht debounced)
        await this.flushImmediate();
      }
      return this.cache;
    } catch (error) {
      console.error("Fehler beim Laden der Landschaftssammlung:", error);
      // Bei Fehler trotzdem eine nutzbare Sammlung zurückgeben
      this.cache = getDefaultCollectionState();
      return this.cache;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Aktualisiert die Collection im Cache und plant einen debounced Write
   */
  async set(collection: LandscapeCollection): Promise<void> {
    this.cache = collection;
    this.isDirty = true;

    // Debounced Write - sammelt mehrere Updates
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
    }

    this.writeTimeout = setTimeout(() => {
      this.flush();
    }, this.WRITE_DEBOUNCE_MS);
  }

  /**
   * Schreibt sofort in AsyncStorage (ohne Debounce)
   */
  async flushImmediate(): Promise<void> {
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
      this.writeTimeout = null;
    }
    await this.flush();
  }

  /**
   * Schreibt die Collection in AsyncStorage (intern)
   */
  private async flush(): Promise<void> {
    if (!this.isDirty || this.cache === null) {
      return;
    }

    try {
      await AsyncStorage.setItem(LANDSCAPE_COLLECTION_KEY, JSON.stringify(this.cache));
      this.isDirty = false;
    } catch (error) {
      console.error("Fehler beim Speichern der Landschaftssammlung:", error);
    }
  }

  /**
   * Invalidiert den Cache (für Tests oder Fehlerfälle)
   */
  invalidate(): void {
    this.cache = null;
    this.isDirty = false;
    if (this.writeTimeout) {
      clearTimeout(this.writeTimeout);
      this.writeTimeout = null;
    }
  }

  /**
   * Holt die gecachte Collection ohne AsyncStorage-Zugriff (optional)
   * Gibt null zurück, wenn Cache leer ist
   */
  getCached(): LandscapeCollection | null {
    return this.cache;
  }

  /**
   * Prüft, ob der Cache geladen ist
   */
  isLoaded(): boolean {
    return this.cache !== null;
  }
}

// Singleton-Instanz exportieren
export const landscapeCache = new LandscapeCollectionCache();
