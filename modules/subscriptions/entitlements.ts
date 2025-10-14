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
  getActiveSubscriptionProductId,
  PurchaseType,
} from '@/screens/SupportShop/utils/purchaseTracking';
import Purchases from 'react-native-purchases';
import {
  SupporterStatus,
  ImageUnlockQuota,
  ImageUnlockResult,
  ImageUnlockError,
} from './types';
import { calculateLifetimeQuota } from './purchaseQuota';

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
    // Prioritize purchaseType from dev testing (allows testing both types)
    let supportType: 'none' | 'one-time' | 'subscription' = 'none';
    if (hasActiveSubscription) {
      supportType = 'subscription';
    } else if (purchaseType === 'subscription') {
      // Dev testing: subscription simulated even without RevenueCat
      supportType = 'subscription';
    } else if (hasAnyPurchase) {
      supportType = 'one-time';
    }

    // Get product ID - prioritize RevenueCat, fallback to dev testing
    let productId = activeEntitlement?.productIdentifier || null;
    if (!productId && purchaseType === 'subscription') {
      // Dev testing mode: get product ID from purchase tracking
      productId = await getActiveSubscriptionProductId();
    }

    // Determine isPremiumSubscriber - support dev testing!
    const isPremiumSubscriber = hasActiveSubscription || purchaseType === 'subscription';

    return {
      isSupporter: hasAnyPurchase,
      isPremiumSubscriber,
      expiresAt,
      productId,
      isInGracePeriod,
      supportType,
    };
  } catch (error) {
    console.error('[Entitlements] Error getting supporter status:', error);
    // Fallback: Check nur Purchase-Tracking
    const purchaseType = await getPurchaseType();
    const productId = purchaseType === 'subscription'
      ? await getActiveSubscriptionProductId()
      : null;

    return {
      isSupporter: purchaseType !== 'none',
      isPremiumSubscriber: purchaseType === 'subscription', // Support dev testing!
      expiresAt: null,
      productId,
      isInGracePeriod: false,
      supportType: purchaseType === 'none' ? 'none' : purchaseType,
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
 * Prüft ob der Nutzer ein jährliches Abo hat
 * @param status Supporter-Status (optional, wird geholt wenn nicht übergeben)
 * @returns true wenn yearly subscription aktiv ist
 */
export async function isYearlySubscriber(
  status?: SupporterStatus
): Promise<boolean> {
  const supporterStatus = status || (await getSupporterStatus());

  if (!supporterStatus.isPremiumSubscriber || !supporterStatus.productId) {
    return false;
  }

  // Check if productId contains "yearly"
  return supporterStatus.productId.includes('yearly');
}

/**
 * Gibt die maximale Anzahl an Schilden pro Woche zurück
 * @param status Supporter-Status (optional, wird geholt wenn nicht übergeben)
 * @returns 4 für Yearly, 3 für Monthly, 2 für Free/One-time
 */
export async function getMaxWeeklyShields(
  status?: SupporterStatus
): Promise<2 | 3 | 4> {
  const supporterStatus = status || (await getSupporterStatus());

  // Yearly Subscriber: 4 Schilde/Woche
  if (await isYearlySubscriber(supporterStatus)) {
    return 4;
  }

  // Monthly Subscriber: 3 Schilde/Woche
  if (supporterStatus.isPremiumSubscriber) {
    return 3;
  }

  // Free/One-time: 2 Schilde/Woche
  return 2;
}

/**
 * Gibt die aktuelle Image-Unlock-Quota zurück
 * Unterscheidet zwischen One-time (1 lifetime), Monthly (1/Monat) und Yearly (2/Monat)
 * @returns ImageUnlockQuota mit allen Details
 */
export async function getImageUnlockQuota(): Promise<ImageUnlockQuota> {
  try {
    // Load quota from storage
    const quotaJson = await AsyncStorage.getItem(KEYS.IMAGE_UNLOCK_QUOTA);
    const storedQuota = quotaJson ? JSON.parse(quotaJson) : null;

    // Get supporter status to determine purchase type
    const supporterStatus = await getSupporterStatus();
    const isSubscription = supporterStatus.supportType === 'subscription';

    // Determine subscription type and monthly limit
    let subscriptionType: 'monthly' | 'yearly' | null = null;
    let monthlyLimit: 1 | 2 = 1;

    if (isSubscription && supporterStatus.productId) {
      // Check if yearly subscription
      if (supporterStatus.productId.includes('yearly')) {
        subscriptionType = 'yearly';
        monthlyLimit = 2; // Yearly gets 2 images per month
      } else if (supporterStatus.productId.includes('monthly')) {
        subscriptionType = 'monthly';
        monthlyLimit = 1; // Monthly gets 1 image per month
      }
    }

    // Get current month/year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Initialize counters
    let usedThisMonth = 0;
    let lifetimeUnlocks = storedQuota?.lifetimeUnlocks || 0;
    let lastUnlockDate: string | null = null;

    // Calculate lifetime quota from purchases (dynamic!)
    const lifetimeQuota = await calculateLifetimeQuota();

    if (storedQuota && storedQuota.lastUnlockDate) {
      const lastUnlock = new Date(storedQuota.lastUnlockDate);
      const lastMonth = lastUnlock.getMonth();
      const lastYear = lastUnlock.getFullYear();

      // For subscriptions: Check if quota needs reset (new month)
      if (isSubscription) {
        // Same month? Keep counter
        if (lastMonth === currentMonth && lastYear === currentYear) {
          usedThisMonth = storedQuota.usedThisMonth || 0;
        }
        // New month? Reset counter (usedThisMonth stays 0)
      } else {
        // For one-time purchases: Keep lifetime counter
        usedThisMonth = storedQuota.usedThisMonth || 0;
      }

      lastUnlockDate = storedQuota.lastUnlockDate;
    }

    // Check if user can unlock
    let canUnlock = false;
    if (supporterStatus.isSupporter) {
      if (isSubscription) {
        // Subscription: Can unlock if less than monthly limit
        canUnlock = usedThisMonth < monthlyLimit;
      } else {
        // One-time: Can unlock if less than DYNAMIC lifetime quota
        // BEFORE: canUnlock = lifetimeUnlocks < 1; (HARDCODED!)
        // NOW: Uses purchase count (3× coffee = 3 unlocks available)
        canUnlock = lifetimeUnlocks < lifetimeQuota;
      }
    }

    // Calculate next reset date (null for one-time, 1st of next month for subscription)
    const nextResetDate = isSubscription
      ? new Date(currentYear, currentMonth + 1, 1)
      : null;

    // Calculate remaining unlocks
    const remainingUnlocks = isSubscription
      ? Math.max(0, monthlyLimit - usedThisMonth)
      : Math.max(0, lifetimeQuota - lifetimeUnlocks);

    const quota: ImageUnlockQuota = {
      monthlyLimit,
      usedThisMonth,
      lifetimeUnlocks,
      lifetimeQuota,
      lastUnlockDate,
      canUnlock,
      remainingUnlocks,
      nextResetDate,
      isSubscription,
      subscriptionType,
    };

    return quota;
  } catch (error) {
    console.error('[Entitlements] Error getting image unlock quota:', error);
    // Fallback: No unlocks available
    return {
      monthlyLimit: 1,
      usedThisMonth: 1,
      lifetimeUnlocks: 1,
      lifetimeQuota: 0,
      lastUnlockDate: null,
      canUnlock: false,
      remainingUnlocks: 0,
      nextResetDate: null,
      isSubscription: false,
      subscriptionType: null,
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
 * Unterscheidet zwischen Subscription (usedThisMonth) und One-time (lifetimeUnlocks)
 * @param imageId Die ID des freigeschalteten Bildes
 */
export async function recordImageUnlock(imageId: string): Promise<void> {
  try {
    const quota = await getImageUnlockQuota();

    // Update quota based on purchase type
    const updatedQuota = {
      usedThisMonth: quota.isSubscription ? quota.usedThisMonth + 1 : quota.usedThisMonth,
      lifetimeUnlocks: quota.isSubscription ? quota.lifetimeUnlocks : quota.lifetimeUnlocks + 1,
      lastUnlockDate: new Date().toISOString(),
    };

    await AsyncStorage.setItem(
      KEYS.IMAGE_UNLOCK_QUOTA,
      JSON.stringify(updatedQuota)
    );

    console.log(`[Entitlements] Image unlock recorded: ${imageId} (${quota.isSubscription ? 'subscription' : 'one-time'})`);
  } catch (error) {
    console.error('[Entitlements] Error recording image unlock:', error);
    throw error;
  }
}

/**
 * Validiert einen Image-Unlock-Versuch
 * Unterscheidet Fehlermeldungen für One-time vs. Subscription
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
      // Different error messages for subscription vs. one-time
      if (quota.isSubscription) {
        return {
          success: false,
          error: 'QUOTA_EXCEEDED',
          errorMessage: `Du kannst nur 1 Bild pro Monat freischalten. Nächster Unlock am ${quota.nextResetDate?.toLocaleDateString('de-DE')}.`,
        };
      } else {
        return {
          success: false,
          error: 'QUOTA_EXCEEDED_LIFETIME',
          errorMessage: 'Du hast dein Bild bereits freigeschaltet. Schließe ein Abo ab, um jeden Monat 1 Bild freizuschalten.',
        };
      }
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
