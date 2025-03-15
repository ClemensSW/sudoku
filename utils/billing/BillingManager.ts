// utils/billing/BillingManager.ts
import { EventEmitter } from "events";

// Produkt-Interface
export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  icon: string;
  color: string;
  subscriptionPeriod?: string;
}

// Definition unserer Produkt-IDs
export const PRODUCT_IDS = {
  // Einmalige Produkte
  SUDOKU_COFFEE: "sudoku_coffee",
  SUDOKU_BREAKFAST: "sudoku_breakfast",
  SUDOKU_LUNCH: "sudoku_lunch",
  SUDOKU_FEAST: "sudoku_feast",

  // Abonnements
  MONTHLY_SUPPORT: "monthly_support",
  YEARLY_SUPPORT: "yearly_support",
};

/**
 * Mock-BillingManager für Entwicklungs- und Vorschauzwecke
 *
 * Diese Klasse simuliert In-App-Käufe für die Entwicklung, bevor
 * die tatsächliche Google Play Billing-Integration implementiert wird.
 */
class BillingManager extends EventEmitter {
  private static instance: BillingManager;
  private isInitialized: boolean = false;
  private products: Product[] = [];
  private subscriptions: Product[] = [];

  public static getInstance(): BillingManager {
    if (!BillingManager.instance) {
      BillingManager.instance = new BillingManager();
    }
    return BillingManager.instance;
  }

  private constructor() {
    super();
    this.setupProducts();
  }

  // Produkte mit Icons und Farben einrichten
  private setupProducts(): void {
    this.products = [
      {
        productId: PRODUCT_IDS.SUDOKU_COFFEE,
        title: "Sudoku-Kaffee",
        description: "Eine kleine Erfrischung für den Entwickler",
        price: "2,99 €",
        icon: "☕",
        color: "#795548",
      },
      {
        productId: PRODUCT_IDS.SUDOKU_BREAKFAST,
        title: "Sudoku-Frühstück",
        description: "Ein guter Start in den Entwicklertag",
        price: "4,99 €",
        icon: "🥐",
        color: "#FF9800",
      },
      {
        productId: PRODUCT_IDS.SUDOKU_LUNCH,
        title: "Sudoku-Mittagessen",
        description: "Energie für neue Features & Verbesserungen",
        price: "9,99 €",
        icon: "🍱",
        color: "#4CAF50",
      },
      {
        productId: PRODUCT_IDS.SUDOKU_FEAST,
        title: "Sudoku-Festmahl",
        description:
          "Eine großzügige Unterstützung für monatelange Entwicklung",
        price: "19,99 €",
        icon: "🍲",
        color: "#9C27B0",
      },
    ];

    this.subscriptions = [
      {
        productId: PRODUCT_IDS.MONTHLY_SUPPORT,
        title: "Monatliche Denksport-Unterstützung",
        description:
          "Regelmäßige Unterstützung für kontinuierliche Verbesserungen",
        price: "1,99 € / Monat",
        icon: "🧩",
        color: "#2196F3",
        subscriptionPeriod: "P1M",
      },
      {
        productId: PRODUCT_IDS.YEARLY_SUPPORT,
        title: "Jahres-Rätselförderung",
        description: "Langfristige Entwicklungsunterstützung zum Sparpreis",
        price: "9,99 € / Jahr",
        icon: "🏆",
        color: "#FFC107",
        subscriptionPeriod: "P1Y",
      },
    ];
  }

  // Initialisiere (simuliert)
  public async initialize(): Promise<void> {
    // Simulierte Verzögerung für realistisches Verhalten
    return new Promise((resolve) => {
      setTimeout(() => {
        this.isInitialized = true;
        this.emit("ready");
        resolve();
      }, 1000);
    });
  }

  // Get all available products
  public getAllProducts(): Product[] {
    return this.products;
  }

  // Get all available subscriptions
  public getAllSubscriptions(): Product[] {
    return this.subscriptions;
  }

  // Simuliere einen Kauf
  public async purchaseProduct(productId: string): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Prüfen, ob das Produkt existiert
    const product = [...this.products, ...this.subscriptions].find(
      (p) => p.productId === productId
    );

    if (!product) {
      this.emit("purchase-error", { code: "ITEM_UNAVAILABLE" });
      return false;
    }

    // Simuliere eine Kaufverzögerung
    return new Promise((resolve) => {
      setTimeout(() => {
        // Zufällig erfolgreicher oder fehlgeschlagener Kauf (für Testzwecke)
        const isSuccessful = Math.random() > 0.2; // 80% Erfolgsrate

        if (isSuccessful) {
          this.emit("purchase-completed", {
            productId,
            purchaseTime: Date.now(),
          });
          resolve(true);
        } else {
          this.emit("purchase-error", { code: "USER_CANCELED" });
          resolve(false);
        }
      }, 2000);
    });
  }

  // Aufräumen
  public async disconnect(): Promise<void> {
    this.isInitialized = false;
  }
}

export default BillingManager;
