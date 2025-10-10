// modules/subscriptions/purchaseQuota.ts
/**
 * Purchase Quota System
 *
 * Verwaltet die Anzahl der gekauften Produkte (Consumables).
 * Ermöglicht multiple Käufe desselben Produkts (z.B. 3× Kaffee = 3 Unlocks).
 *
 * WICHTIG: Produkte müssen in Google Play Console als "Consumable" konfiguriert sein!
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

const PURCHASE_QUOTA_KEY = "@purchase_quota";

export interface PurchaseQuotaItem {
  /**
   * Produkt-ID (z.B. "de.playfusiongate.sudokuduo.coffee")
   */
  productId: string;

  /**
   * Anzahl der Käufe dieses Produkts
   */
  purchaseCount: number;

  /**
   * Zeitstempel des letzten Kaufs
   */
  lastPurchaseDate: string;
}

export interface PurchaseQuotaData {
  /**
   * Map von Produkt-ID zu Kauf-Daten
   */
  items: Record<string, PurchaseQuotaItem>;

  /**
   * Letzte Aktualisierung
   */
  lastUpdated: string;
}

/**
 * Lade aktuelle Purchase Quota
 */
export async function getPurchaseQuota(): Promise<PurchaseQuotaData> {
  try {
    const stored = await AsyncStorage.getItem(PURCHASE_QUOTA_KEY);

    if (stored) {
      return JSON.parse(stored);
    }

    // Default: Leer
    return {
      items: {},
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("[purchaseQuota] Error loading quota:", error);
    return {
      items: {},
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Speichere Purchase Quota
 */
async function savePurchaseQuota(data: PurchaseQuotaData): Promise<void> {
  try {
    data.lastUpdated = new Date().toISOString();
    await AsyncStorage.setItem(PURCHASE_QUOTA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("[purchaseQuota] Error saving quota:", error);
    throw error;
  }
}

/**
 * Füge einen Kauf hinzu (incrementiere Counter)
 */
export async function recordPurchase(productId: string): Promise<number> {
  try {
    const quota = await getPurchaseQuota();

    // Existierendes Item aktualisieren oder neues erstellen
    const existing = quota.items[productId];

    if (existing) {
      existing.purchaseCount += 1;
      existing.lastPurchaseDate = new Date().toISOString();
    } else {
      quota.items[productId] = {
        productId,
        purchaseCount: 1,
        lastPurchaseDate: new Date().toISOString(),
      };
    }

    await savePurchaseQuota(quota);

    console.log(
      `[purchaseQuota] Recorded purchase: ${productId} (count: ${quota.items[productId].purchaseCount})`
    );

    return quota.items[productId].purchaseCount;
  } catch (error) {
    console.error("[purchaseQuota] Error recording purchase:", error);
    throw error;
  }
}

/**
 * Berechne Gesamt-Quota für Lifetime-Unlocks
 *
 * Logik:
 * - Jeder Einmalkauf (coffee, breakfast, lunch, feast) = +1 Unlock
 * - Abonnements werden NICHT mitgezählt (die haben monatliche Quota)
 *
 * Beispiel:
 * - 3× Coffee + 1× Breakfast = 4 Unlocks verfügbar
 */
export async function calculateLifetimeQuota(): Promise<number> {
  try {
    const quota = await getPurchaseQuota();

    let totalQuota = 0;

    // Alle One-Time-Produkte durchgehen
    const oneTimeProductIds = [
      "de.playfusiongate.sudokuduo.coffee",
      "de.playfusiongate.sudokuduo.breakfast",
      "de.playfusiongate.sudokuduo.lunch",
      "de.playfusiongate.sudokuduo.feast",
    ];

    for (const productId of oneTimeProductIds) {
      const item = quota.items[productId];
      if (item) {
        totalQuota += item.purchaseCount;
      }
    }

    console.log(`[purchaseQuota] Calculated lifetime quota: ${totalQuota}`);

    return totalQuota;
  } catch (error) {
    console.error("[purchaseQuota] Error calculating quota:", error);
    return 0;
  }
}

/**
 * Hole Kauf-Count für spezifisches Produkt
 */
export async function getPurchaseCount(productId: string): Promise<number> {
  try {
    const quota = await getPurchaseQuota();
    return quota.items[productId]?.purchaseCount || 0;
  } catch (error) {
    console.error("[purchaseQuota] Error getting purchase count:", error);
    return 0;
  }
}

/**
 * Reset Purchase Quota (für Testing)
 */
export async function resetPurchaseQuota(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PURCHASE_QUOTA_KEY);
    console.log("[purchaseQuota] Quota reset successfully");
  } catch (error) {
    console.error("[purchaseQuota] Error resetting quota:", error);
    throw error;
  }
}

/**
 * Debug: Zeige alle gekauften Produkte
 */
export async function debugPrintQuota(): Promise<void> {
  try {
    const quota = await getPurchaseQuota();

    console.log("=== PURCHASE QUOTA DEBUG ===");
    console.log("Last Updated:", quota.lastUpdated);
    console.log("Items:");

    Object.entries(quota.items).forEach(([productId, item]) => {
      console.log(`  - ${productId}: ${item.purchaseCount}× (last: ${item.lastPurchaseDate})`);
    });

    const totalQuota = await calculateLifetimeQuota();
    console.log(`Total Lifetime Quota: ${totalQuota}`);
    console.log("===========================");
  } catch (error) {
    console.error("[purchaseQuota] Error printing debug info:", error);
  }
}
