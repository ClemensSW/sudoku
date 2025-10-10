// modules/subscriptions/types.ts
/**
 * Subscription & Supporter Types
 *
 * Core types for the supporter/subscription system.
 * WICHTIG: Ein "Supporter" ist jeder, der IRGENDWANN gekauft hat (Einmalkauf ODER Abo).
 * Ein "Premium Subscriber" ist nur ein aktiver Abo-Nutzer.
 */

/**
 * Supporter Status
 * Umfasst sowohl Einmalkäufe als auch Abonnements
 */
export interface SupporterStatus {
  /**
   * True wenn der Nutzer jemals etwas gekauft hat (Einmalkauf ODER Abo)
   */
  isSupporter: boolean;

  /**
   * True nur wenn ein aktives Abonnement besteht
   */
  isPremiumSubscriber: boolean;

  /**
   * Ablaufdatum des Abos (nur bei isPremiumSubscriber = true)
   */
  expiresAt: Date | null;

  /**
   * Produkt-ID des letzten/aktuellen Kaufs
   */
  productId: string | null;

  /**
   * True wenn Abo in Grace Period (Zahlung fehlgeschlagen, aber noch aktiv)
   */
  isInGracePeriod: boolean;

  /**
   * Typ des Supports
   */
  supportType: 'none' | 'one-time' | 'subscription';
}

/**
 * Image-Unlock Quota
 * Unterscheidet zwischen One-time (1 lifetime), Monthly (1/Monat) und Yearly (2/Monat)
 */
export interface ImageUnlockQuota {
  /**
   * Monatliches Limit
   * - One-time: 1 (lifetime)
   * - Monthly: 1 (pro Monat)
   * - Yearly: 2 (pro Monat)
   */
  monthlyLimit: 1 | 2;

  /**
   * Anzahl der bereits genutzten Unlocks diesen Monat (nur für Subscriptions)
   */
  usedThisMonth: number;

  /**
   * Anzahl der genutzten Unlocks insgesamt (nur für One-time purchases)
   */
  lifetimeUnlocks: number;

  /**
   * Datum des letzten Unlocks (ISO string)
   */
  lastUnlockDate: string | null;

  /**
   * Kann der Nutzer aktuell ein Bild freischalten?
   */
  canUnlock: boolean;

  /**
   * Verbleibende Unlocks (abhängig vom Purchase-Typ)
   */
  remainingUnlocks: number;

  /**
   * Nächstes Reset-Datum (1. des nächsten Monats, null bei one-time)
   */
  nextResetDate: Date | null;

  /**
   * True wenn Nutzer aktives Abo hat (vs. one-time purchase)
   */
  isSubscription: boolean;

  /**
   * Typ des Abonnements (nur bei isSubscription = true)
   */
  subscriptionType?: 'monthly' | 'yearly' | null;
}

/**
 * Image-Unlock Result
 * Rückgabe beim Versuch, ein Bild freizuschalten
 */
export interface ImageUnlockResult {
  /**
   * War der Unlock erfolgreich?
   */
  success: boolean;

  /**
   * Fehlercode (falls nicht erfolgreich)
   */
  error?: ImageUnlockError;

  /**
   * Fehlermeldung (für UI)
   */
  errorMessage?: string;

  /**
   * Freigeschaltetes Bild-ID (bei Erfolg)
   */
  unlockedImageId?: string;
}

/**
 * Image-Unlock Error Codes
 */
export type ImageUnlockError =
  | 'NOT_SUPPORTER'                 // Nutzer ist kein Supporter
  | 'QUOTA_EXCEEDED'                // Monatliches Limit erreicht (Subscription)
  | 'QUOTA_EXCEEDED_LIFETIME'       // Lifetime Limit erreicht (One-time)
  | 'ALREADY_UNLOCKED'              // Bild ist bereits freigeschaltet
  | 'IMAGE_NOT_FOUND'               // Bild existiert nicht
  | 'STORAGE_ERROR';                // AsyncStorage Fehler

/**
 * Subscriber Event Types
 * Für Event-Listener im SubscriptionService
 */
export type SubscriberEvent =
  | 'status-changed'          // Supporter-Status hat sich geändert
  | 'subscription-started'    // Neues Abo gestartet
  | 'subscription-renewed'    // Abo verlängert
  | 'subscription-expired'    // Abo abgelaufen
  | 'purchase-completed';     // Einmalkauf abgeschlossen
