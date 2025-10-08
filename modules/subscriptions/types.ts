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
 * Monatliches Limit für Bildfreischaltung (nur für Supporter)
 */
export interface ImageUnlockQuota {
  /**
   * Monatliches Limit (fix: 1 Bild pro Monat)
   */
  monthlyLimit: 1;

  /**
   * Anzahl der bereits genutzten Unlocks diesen Monat
   */
  usedThisMonth: number;

  /**
   * Datum des letzten Unlocks (ISO string)
   */
  lastUnlockDate: string | null;

  /**
   * Kann der Nutzer aktuell ein Bild freischalten?
   */
  canUnlock: boolean;

  /**
   * Verbleibende Unlocks diesen Monat
   */
  remainingUnlocks: number;

  /**
   * Nächstes Reset-Datum (1. des nächsten Monats)
   */
  nextResetDate: Date;
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
  | 'NOT_SUPPORTER'           // Nutzer ist kein Supporter
  | 'QUOTA_EXCEEDED'          // Monatliches Limit erreicht
  | 'ALREADY_UNLOCKED'        // Bild ist bereits freigeschaltet
  | 'IMAGE_NOT_FOUND'         // Bild existiert nicht
  | 'STORAGE_ERROR';          // AsyncStorage Fehler

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
