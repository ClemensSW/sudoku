// utils/billing/BillingManager.ts
import { Platform } from 'react-native';
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
  CustomerInfo,
  PURCHASES_ERROR_CODE,
} from 'react-native-purchases';
import i18next from 'i18next';
import { BILLING_CONFIG } from './config';

// Product interface matching SupportShop expectations
export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  color: string;
  icon: string;
  revenueCatId?: string; // For mapping to RevenueCat products
}

// Event types
type EventListeners = {
  'purchase-completed': Array<(purchase: any) => void>;
  'purchase-error': Array<(error: any) => void>;
  'restore-completed': Array<(info: CustomerInfo) => void>;
};

class BillingManager {
  private static instance: BillingManager;
  private products: Product[] = [];
  private subscriptions: Product[] = [];
  private isInitialized: boolean = false;
  private listeners: EventListeners = {
    'purchase-completed': [],
    'purchase-error': [],
    'restore-completed': [],
  };
  private offerings: PurchasesOffering | null = null;

  private constructor() {
    this.initializeProductDefinitions();
  }

  public static getInstance(): BillingManager {
    if (!BillingManager.instance) {
      BillingManager.instance = new BillingManager();
    }
    return BillingManager.instance;
  }

  private initializeProductDefinitions() {
    // Product definitions with RevenueCat IDs
    // Diese IDs müssen mit den IDs in Google Play Console übereinstimmen
    this.products = [
      {
        productId: 'sudoku_coffee',
        title: i18next.t('supportShop:billingProducts.coffee.title'),
        description: i18next.t('supportShop:billingProducts.coffee.description'),
        price: '€1,99',
        color: '#8B4513',
        icon: '☕',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.COFFEE
      },
      {
        productId: 'sudoku_breakfast',
        title: i18next.t('supportShop:billingProducts.breakfast.title'),
        description: i18next.t('supportShop:billingProducts.breakfast.description'),
        price: '€4,99',
        color: '#FF6B6B',
        icon: '🥐',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.BREAKFAST
      },
      {
        productId: 'sudoku_lunch',
        title: i18next.t('supportShop:billingProducts.lunch.title'),
        description: i18next.t('supportShop:billingProducts.lunch.description'),
        price: '€9,99',
        color: '#4ECDC4',
        icon: '🍱',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.LUNCH
      },
      {
        productId: 'sudoku_feast',
        title: i18next.t('supportShop:billingProducts.feast.title'),
        description: i18next.t('supportShop:billingProducts.feast.description'),
        price: '€19,99',
        color: '#9B59B6',
        icon: '👑',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.FEAST
      }
    ];

    this.subscriptions = [
      {
        productId: 'monthly_support',
        title: i18next.t('supportShop:billingSubscriptions.monthly.title'),
        description: i18next.t('supportShop:billingSubscriptions.monthly.description'),
        price: i18next.t('supportShop:billingSubscriptions.monthly.price'),
        color: '#3498DB',
        icon: '📅',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.MONTHLY_SUB
      },
      {
        productId: 'yearly_support',
        title: i18next.t('supportShop:billingSubscriptions.yearly.title'),
        description: i18next.t('supportShop:billingSubscriptions.yearly.description'),
        price: i18next.t('supportShop:billingSubscriptions.yearly.price'),
        color: '#27AE60',
        icon: '🎯',
        revenueCatId: BILLING_CONFIG.GOOGLE_PLAY_PRODUCTS.YEARLY_SUB
      }
    ];
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('BillingManager: Already initialized');
      return;
    }

    try {
      // Configure RevenueCat
      const apiKey = Platform.OS === 'ios' 
        ? BILLING_CONFIG.REVENUECAT_API_KEY_IOS 
        : BILLING_CONFIG.REVENUECAT_API_KEY_ANDROID;
      
      if (apiKey === 'YOUR_ANDROID_API_KEY_HERE' || apiKey === 'YOUR_IOS_API_KEY_HERE') {
        console.warn('BillingManager: Using mock mode - RevenueCat API keys not configured');
        // Use mock mode if keys are not set
        this.isInitialized = true;
        return;
      }

      Purchases.configure({ apiKey });

      // Enable debug logs in development
      if (__DEV__) {
        Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
      }

      // Fetch offerings
      await this.fetchOfferings();

      // Update product prices from RevenueCat
      await this.updateProductPrices();

      this.isInitialized = true;
      console.log('BillingManager: Initialized successfully');
    } catch (error) {
      console.error('BillingManager: Failed to initialize', error);
      throw error;
    }
  }

  private async fetchOfferings(): Promise<void> {
    try {
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        this.offerings = offerings.current;
        console.log('BillingManager: Fetched offerings', this.offerings);
      }
    } catch (error) {
      console.error('BillingManager: Failed to fetch offerings', error);
    }
  }

  private async updateProductPrices(): Promise<void> {
    if (!this.offerings) return;

    // Update product prices from RevenueCat packages
    const allProducts = [...this.products, ...this.subscriptions];
    
    for (const product of allProducts) {
      if (product.revenueCatId) {
        const rcPackage = this.offerings.availablePackages.find(
          pkg => pkg.product.identifier === product.revenueCatId
        );
        
        if (rcPackage) {
          product.price = rcPackage.product.priceString;
        }
      }
    }
  }

  public getAllProducts(): Product[] {
    return this.products;
  }

  public getAllSubscriptions(): Product[] {
    return this.subscriptions;
  }

  public async purchaseProduct(productId: string): Promise<void> {
    try {
      const allProducts = [...this.products, ...this.subscriptions];
      const product = allProducts.find(p => p.productId === productId);
      
      if (!product || !product.revenueCatId) {
        throw new Error('Product not found or invalid configuration');
      }

      // Check if using mock mode
      if (!this.offerings) {
        console.log(`BillingManager: Mock purchase of ${productId}`);
        // Simulate purchase in mock mode
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.emit('purchase-completed', { productId, product });
        return;
      }

      // Find the package in RevenueCat offerings
      const rcPackage = this.offerings.availablePackages.find(
        pkg => pkg.product.identifier === product.revenueCatId
      );

      if (!rcPackage) {
        throw new Error('Product not found in RevenueCat offerings');
      }

      // Make the purchase
      const purchaseResult = await Purchases.purchasePackage(rcPackage);
      
      console.log('BillingManager: Purchase successful', purchaseResult);
      this.emit('purchase-completed', {
        productId,
        product,
        customerInfo: purchaseResult.customerInfo,
      });

    } catch (error) {
      console.error('BillingManager: Purchase error', error);
      
      // Type guard for PurchasesError
      if (error && typeof error === 'object' && 'code' in error) {
        const purchasesError = error as { code: string };
        // Handle specific RevenueCat errors
        if (purchasesError.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
          // User cancelled - don't emit error
          return;
        }
      }
      
      this.emit('purchase-error', { error, productId });
    }
  }

  public async restorePurchases(): Promise<void> {
    try {
      const customerInfo = await Purchases.restorePurchases();
      console.log('BillingManager: Restore successful', customerInfo);
      this.emit('restore-completed', customerInfo);
    } catch (error) {
      console.error('BillingManager: Restore error', error);
      throw error;
    }
  }

  public async getCustomerInfo(): Promise<CustomerInfo | null> {
    try {
      return await Purchases.getCustomerInfo();
    } catch (error) {
      console.error('BillingManager: Failed to get customer info', error);
      return null;
    }
  }

  // Event emitter implementation
  public on<K extends keyof EventListeners>(
    event: K,
    listener: EventListeners[K][0]
  ): void {
    this.listeners[event].push(listener as any);
  }

  public removeAllListeners<K extends keyof EventListeners>(event?: K): void {
    if (event) {
      this.listeners[event] = [];
    } else {
      Object.keys(this.listeners).forEach((key) => {
        this.listeners[key as K] = [];
      });
    }
  }

  private emit<K extends keyof EventListeners>(
    event: K,
    ...args: Parameters<EventListeners[K][0]>
  ): void {
    this.listeners[event].forEach((listener) => {
      try {
        (listener as any)(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

export default BillingManager;