// modules/gallery/supporterUnlocks.ts
/**
 * Supporter Gallery Unlocks
 *
 * Logik für das Freischalten von Bildern durch Supporter.
 * Integriert mit dem bestehenden Gallery-System.
 */

import {
  validateImageUnlock,
  recordImageUnlock,
  getSupporterStatus,
} from '../subscriptions/entitlements';
import { ImageUnlockResult } from '../subscriptions/types';
import {
  loadLandscapeCollection,
  saveLandscapeCollection,
} from '@/screens/Gallery/utils/landscapes/storage';

/**
 * Schaltet ein Bild als Supporter frei
 * @param imageId Die ID des freizuschaltenden Bildes
 * @returns ImageUnlockResult mit Erfolg oder Fehler
 */
export async function unlockImageAsSupporter(
  imageId: string
): Promise<ImageUnlockResult> {
  try {
    console.log(`[SupporterUnlocks] Attempting to unlock image: ${imageId}`);

    // 1. Validate unlock (prüft Supporter-Status & Quota)
    const validation = await validateImageUnlock(imageId);
    if (!validation.success) {
      console.log('[SupporterUnlocks] Validation failed:', validation.error);
      return validation;
    }

    // 2. Load gallery collection
    const collection = await loadLandscapeCollection();
    const landscape = collection.landscapes[imageId];

    if (!landscape) {
      console.error('[SupporterUnlocks] Image not found:', imageId);
      return {
        success: false,
        error: 'IMAGE_NOT_FOUND',
        errorMessage: 'Bild wurde nicht gefunden.',
      };
    }

    // 3. Check if already unlocked
    if (landscape.isComplete || landscape.progress === 9) {
      console.log('[SupporterUnlocks] Image already unlocked:', imageId);
      return {
        success: false,
        error: 'ALREADY_UNLOCKED',
        errorMessage: 'Dieses Bild ist bereits freigeschaltet.',
      };
    }

    // 4. Unlock all segments
    landscape.segments.forEach((segment) => {
      segment.isUnlocked = true;
    });
    landscape.progress = 9;
    landscape.isComplete = true;

    // 5. Save collection
    await saveLandscapeCollection(collection);

    // 6. Record unlock in quota
    await recordImageUnlock(imageId);

    console.log(`[SupporterUnlocks] Successfully unlocked image: ${imageId}`);

    return {
      success: true,
      unlockedImageId: imageId,
    };
  } catch (error) {
    console.error('[SupporterUnlocks] Error unlocking image:', error);
    return {
      success: false,
      error: 'STORAGE_ERROR',
      errorMessage: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    };
  }
}

/**
 * Prüft, ob ein Bild bereits freigeschaltet ist
 * @param imageId Die ID des Bildes
 * @returns true wenn das Bild komplett ist
 */
export async function isImageUnlocked(imageId: string): Promise<boolean> {
  try {
    const collection = await loadLandscapeCollection();
    const landscape = collection.landscapes[imageId];

    if (!landscape) {
      return false;
    }

    return landscape.isComplete || landscape.progress === 9;
  } catch (error) {
    console.error('[SupporterUnlocks] Error checking unlock status:', error);
    return false;
  }
}

/**
 * Gibt alle Bilder zurück, die per Supporter-Unlock freigeschaltet wurden
 * (vs. durch Spielfortschritt)
 * @returns Array von Image-IDs
 */
export async function getSupporterUnlockedImages(): Promise<string[]> {
  try {
    const collection = await loadLandscapeCollection();
    const supporterUnlocked: string[] = [];

    // Prüfe alle Bilder, die komplett sind, aber nicht das aktuelle Projekt
    Object.values(collection.landscapes).forEach((landscape) => {
      if (
        (landscape.isComplete || landscape.progress === 9) &&
        landscape.id !== collection.currentImageId
      ) {
        // Annahme: Alle kompletten Bilder außer dem aktuellen wurden
        // per Supporter-Unlock freigeschaltet (oder durch alten Fortschritt)
        // TODO: Später besseres Tracking einführen (z.B. unlockMethod: 'supporter' | 'progress')
        supporterUnlocked.push(landscape.id);
      }
    });

    return supporterUnlocked;
  } catch (error) {
    console.error('[SupporterUnlocks] Error getting supporter unlocked images:', error);
    return [];
  }
}
