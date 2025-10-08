// modules/subscriptions/entitlements.ts
/**
 * Entitlements & Supporter Checks
 *
 * Zentrale Stelle für alle Supporter/Subscription-Prüfungen.
 * Nutzt das Purchase-Tracking aus SupportShop/utils/purchaseTracking.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getPurchaseType,
  checkHasPurchased,
  PurchaseType,
} from '@/screens/SupportShop/utils/purchaseTracking';
import Purchases from 'react-native-purchases';
import {
  SupporterStatus,
  ImageUnlockQuota,
  ImageUnlockResult,
  ImageUnlockError,
} from './types';

// Storage Keys
const KEYS = {
  IMAGE_UNLOCK_QUOTA: '@sudoku/image_unlock_quota',
};

/**
 * Prüft, ob der Nutzer ein Supporter ist (Einmalkauf ODER Abo)
 * @returns true wenn der Nutzer jemals etwas gekauft hat
 */
export async function isSupporter(): Promise<boolean> {
  const purchaseType = await getPurchaseType();
  return purchaseType !== 'none';
}

/**
 * Gibt den vollständigen Supporter-Status zurück
 * @returns SupporterStatus mit allen Details
 */
export async function getSupporterStatus(): Promise<SupporterStatus> {
  try {
    // Check purchase tracking
    const purchaseType = await getPurchaseType();
    const hasAnyPurchase = purchaseType !== 'none';

    // Check RevenueCat für aktive Abos
    const customerInfo = await Purchases.getCustomerInfo();
    const hasActiveSubscription =
      typeof customerInfo.entitlements.active['supporter'] !== 'undefined';

    const activeEntitlement = customerInfo.entitlements.active['supporter'];
    const expiresAt = activeEntitlement
      ? new Date(activeEntitlement.expirationDate!)
      : null;

    // Check Grace Period
    const isInGracePeriod =
      activeEntitlement?.isActive === true &&
      activeEntitlement?.willRenew === false;

    // Determine support type
    let supportType: 'none' | 'one-time' | 'subscription' = 'none';
    if (hasActiveSubscription) {
      supportType = 'subscription';
    } else if (hasAnyPurchase) {
      supportType = 'one-time';
    }

    return {
      isSupporter: hasAnyPurchase,
      isPremiumSubscriber: hasActiveSubscription,
      expiresAt,
      productId: activeEntitlement?.productIdentifier || null,
      isInGracePeriod,
      supportType,
    };
  } catch (error) {
    console.error('[Entitlements] Error getting supporter status:', error);
    // Fallback: Check nur Purchase-Tracking
    const purchaseType = await getPurchaseType();
    return {
      isSupporter: purchaseType !== 'none',
      isPremiumSubscriber: false,
      expiresAt: null,
      productId: null,
      isInGracePeriod: false,
      supportType: purchaseType === 'none' ? 'none' : 'one-time',
    };
  }
}

/**
 * Gibt den EP-Multiplikator basierend auf Supporter-Status zurück
 * @param status Supporter-Status (optional, wird geholt wenn nicht übergeben)
 * @returns 2 für Supporter, 1 für Non-Supporter
 */
export async function getEpMultiplier(
  status?: SupporterStatus
): Promise<1 | 2> {
  const supporterStatus = status || (await getSupporterStatus());
  return supporterStatus.isSupporter ? 2 : 1;
}

/**
 * Gibt die aktuelle Image-Unlock-Quota zurück
 * @returns ImageUnlockQuota mit allen Details
 */
export async function getImageUnlockQuota(): Promise<ImageUnlockQuota> {
  try {
    // Load quota from storage
    const quotaJson = await AsyncStorage.getItem(KEYS.IMAGE_UNLOCK_QUOTA);
    const storedQuota = quotaJson ? JSON.parse(quotaJson) : null;

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Check if quota needs reset (new month)
    let usedThisMonth = 0;
    let lastUnlockDate: string | null = null;

    if (storedQuota && storedQuota.lastUnlockDate) {
      const lastUnlock = new Date(storedQuota.lastUnlockDate);
      const lastMonth = lastUnlock.getMonth();
      const lastYear = lastUnlock.getFullYear();

      // Same month? Keep counter
      if (lastMonth === currentMonth && lastYear === currentYear) {
        usedThisMonth = storedQuota.usedThisMonth || 0;
        lastUnlockDate = storedQuota.lastUnlockDate;
      }
      // New month? Reset counter
    }

    // Check if user can unlock
    const supporterStatus = await getSupporterStatus();
    const canUnlock =
      supporterStatus.isSupporter && usedThisMonth < 1;

    // Calculate next reset date (1st of next month)
    const nextResetDate = new Date(currentYear, currentMonth + 1, 1);

    const quota: ImageUnlockQuota = {
      monthlyLimit: 1,
      usedThisMonth,
      lastUnlockDate,
      canUnlock,
      remainingUnlocks: Math.max(0, 1 - usedThisMonth),
      nextResetDate,
    };

    return quota;
  } catch (error) {
    console.error('[Entitlements] Error getting image unlock quota:', error);
    // Fallback: No unlocks available
    return {
      monthlyLimit: 1,
      usedThisMonth: 1,
      lastUnlockDate: null,
      canUnlock: false,
      remainingUnlocks: 0,
      nextResetDate: new Date(),
    };
  }
}

/**
 * Prüft, ob ein Bild freigeschaltet werden kann
 * @returns true wenn ein Unlock möglich ist
 */
export async function canUnlockImage(): Promise<boolean> {
  const quota = await getImageUnlockQuota();
  return quota.canUnlock;
}

/**
 * Aktualisiert die Unlock-Quota nach erfolgreichem Unlock
 * @param imageId Die ID des freigeschalteten Bildes
 */
export async function recordImageUnlock(imageId: string): Promise<void> {
  try {
    const quota = await getImageUnlockQuota();

    // Update quota
    const updatedQuota = {
      usedThisMonth: quota.usedThisMonth + 1,
      lastUnlockDate: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      KEYS.IMAGE_UNLOCK_QUOTA,
      JSON.stringify(updatedQuota)
    );

    console.log(`[Entitlements] Image unlock recorded: ${imageId}`);
  } catch (error) {
    console.error('[Entitlements] Error recording image unlock:', error);
    throw error;
  }
}

/**
 * Validiert einen Image-Unlock-Versuch
 * @param imageId Die ID des Bildes
 * @returns ImageUnlockResult mit Erfolg oder Fehler
 */
export async function validateImageUnlock(
  imageId: string
): Promise<ImageUnlockResult> {
  try {
    // Check supporter status
    const supporterStatus = await getSupporterStatus();
    if (!supporterStatus.isSupporter) {
      return {
        success: false,
        error: 'NOT_SUPPORTER',
        errorMessage: 'Du musst Supporter sein, um Bilder freizuschalten.',
      };
    }

    // Check quota
    const quota = await getImageUnlockQuota();
    if (!quota.canUnlock) {
      return {
        success: false,
        error: 'QUOTA_EXCEEDED',
        errorMessage: `Du kannst nur 1 Bild pro Monat freischalten. Nächster Unlock am ${quota.nextResetDate.toLocaleDateString('de-DE')}.`,
      };
    }

    // Check if image is already unlocked
    // (wird in modules/gallery/supporterUnlocks.ts geprüft)

    return {
      success: true,
      unlockedImageId: imageId,
    };
  } catch (error) {
    console.error('[Entitlements] Error validating image unlock:', error);
    return {
      success: false,
      error: 'STORAGE_ERROR',
      errorMessage: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    };
  }
}
