// utils/billing/BillingManager.ts
import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define event types for type-safety
export enum BillingEvents {
  PURCHASE_SUCCESS = 'PURCHASE_SUCCESS',
  PURCHASE_FAILED = 'PURCHASE_FAILED',
  RESTORE_SUCCESS = 'RESTORE_SUCCESS',
  RESTORE_FAILED = 'RESTORE_FAILED',
  SUBSCRIPTION_STATUS_CHANGED = 'SUBSCRIPTION_STATUS_CHANGED',
}

// Define product types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  priceAmountMicros: number;
  priceCurrencyCode: string;
  subscriptionPeriod?: string;
  freeTrialPeriod?: string;
}

// Define purchase types
export interface Purchase {
  productId: string;
  transactionId: string;
  transactionDate: number;
  purchaseToken?: string;
  dataAndroid?: string;
  signatureAndroid?: string;
  originalTransactionDateIOS?: number;
  originalTransactionIdentifierIOS?: string;
}

// Create a dummy native module for the emitter
// In a real app, you would use an actual native module for IAP
const DummyNativeModule = NativeModules.BillingModule || {
  addListener: () => {},
  removeListeners: () => {},
};

class BillingManager {
  private static instance: BillingManager;
  private eventEmitter: NativeEventEmitter;
  private products: Map<string, Product> = new Map();
  private purchases: Map<string, Purchase> = new Map();
  private isInitialized: boolean = false;
  private STORAGE_KEY = '@billing_manager_purchases';

  private constructor() {
    // Using NativeEventEmitter instead of Node's EventEmitter
    this.eventEmitter = new NativeEventEmitter(DummyNativeModule);
  }

  public static getInstance(): BillingManager {
    if (!BillingManager.instance) {
      BillingManager.instance = new BillingManager();
    }
    return BillingManager.instance;
  }

  /**
   * Initialize the billing manager
   */
  public async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      // Load any stored purchases
      await this.loadStoredPurchases();
      
      // Here you would normally initialize a real IAP library
      // like react-native-iap or react-native-purchases
      console.log('BillingManager initialized');
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize BillingManager:', error);
      return false;
    }
  }

  /**
   * Get available products from the store
   */
  public async getProducts(productIds: string[]): Promise<Product[]> {
    if (!this.isInitialized) await this.initialize();
    
    // In a real implementation, you would fetch products from the store
    // This is just a mock implementation
    const mockProducts: Product[] = productIds.map(id => ({
      id,
      title: `Product ${id}`,
      description: `Description for ${id}`,
      price: '$4.99',
      priceAmountMicros: 4990000,
      priceCurrencyCode: 'USD',
      subscriptionPeriod: id.includes('subscription') ? 'P1M' : undefined
    }));
    
    mockProducts.forEach(product => this.products.set(product.id, product));
    return mockProducts;
  }

  /**
   * Purchase a product
   */
  public async purchaseProduct(productId: string): Promise<Purchase | null> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // Mock purchase process
      const purchase: Purchase = {
        productId,
        transactionId: `transaction_${Date.now()}`,
        transactionDate: Date.now(),
        purchaseToken: Platform.OS === 'android' ? `token_${Date.now()}` : undefined,
      };
      
      // Store the purchase
      this.purchases.set(productId, purchase);
      await this.savePurchases();
      
      // Emit success event
      this.eventEmitter.emit(BillingEvents.PURCHASE_SUCCESS, purchase);
      
      return purchase;
    } catch (error) {
      console.error('Purchase failed:', error);
      this.eventEmitter.emit(BillingEvents.PURCHASE_FAILED, { error, productId });
      return null;
    }
  }

  /**
   * Restore purchases
   */
  public async restorePurchases(): Promise<Purchase[]> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // In a real implementation, you would call the store's restore purchases API
      // For this mock, we're just returning our stored purchases
      const purchases = Array.from(this.purchases.values());
      
      this.eventEmitter.emit(BillingEvents.RESTORE_SUCCESS, purchases);
      return purchases;
    } catch (error) {
      console.error('Restore purchases failed:', error);
      this.eventEmitter.emit(BillingEvents.RESTORE_FAILED, { error });
      return [];
    }
  }

  /**
   * Check if a product is purchased
   */
  public isPurchased(productId: string): boolean {
    return this.purchases.has(productId);
  }

  /**
   * Add event listener
   */
  public addListener(event: BillingEvents, listener: (...args: any[]) => void): { remove: () => void } {
    const subscription = this.eventEmitter.addListener(event, listener);
    return {
      remove: () => subscription.remove()
    };
  }

  /**
   * Remove all listeners
   */
  public removeAllListeners(event: BillingEvents): void {
    this.eventEmitter.removeAllListeners(event);
  }

  /**
   * Save purchases to AsyncStorage
   */
  private async savePurchases(): Promise<void> {
    const purchasesArray = Array.from(this.purchases.values());
    await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(purchasesArray));
  }

  /**
   * Load purchases from AsyncStorage
   */
  private async loadStoredPurchases(): Promise<void> {
    try {
      const storedPurchases = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (storedPurchases) {
        const purchases: Purchase[] = JSON.parse(storedPurchases);
        purchases.forEach(purchase => {
          this.purchases.set(purchase.productId, purchase);
        });
      }
    } catch (error) {
      console.error('Failed to load stored purchases:', error);
    }
  }
}

export default BillingManager.getInstance();