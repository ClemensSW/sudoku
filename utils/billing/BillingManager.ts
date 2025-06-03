// utils/billing/BillingManager.ts

// Product interface matching SupportShop expectations
export interface Product {
  productId: string;
  title: string;
  description: string;
  price: string;
  color: string;
  icon: string;
}

// Simple event emitter for React Native
interface EventListeners {
  [event: string]: Array<(...args: any[]) => void>;
}

// Mock implementation of BillingManager for development
class BillingManager {
  private static instance: BillingManager;
  private products: Product[] = [];
  private subscriptions: Product[] = [];
  private isInitialized: boolean = false;
  private listeners: EventListeners = {};

  private constructor() {
    this.initializeMockProducts();
  }

  public static getInstance(): BillingManager {
    if (!BillingManager.instance) {
      BillingManager.instance = new BillingManager();
    }
    return BillingManager.instance;
  }

  private initializeMockProducts() {
    // Mock one-time products
    this.products = [
      {
        productId: 'sudoku_coffee',
        title: 'Kaffee-Pause',
        description: 'Spendiere mir einen Kaffee',
        price: '€1,99',
        color: '#8B4513',
        icon: '☕'
      },
      {
        productId: 'sudoku_breakfast',
        title: 'Frühstück',
        description: 'Ein leckeres Frühstück',
        price: '€4,99',
        color: '#FF6B6B',
        icon: '🥐'
      },
      {
        productId: 'sudoku_lunch',
        title: 'Mittagsessen',
        description: 'Ein nahrhaftes Mittagessen',
        price: '€9,99',
        color: '#4ECDC4',
        icon: '🍱'
      },
      {
        productId: 'sudoku_feast',
        title: 'Festmahl',
        description: 'Ein königliches Festmahl',
        price: '€19,99',
        color: '#9B59B6',
        icon: '👑'
      }
    ];

    // Mock subscriptions
    this.subscriptions = [
      {
        productId: 'monthly_support',
        title: 'Monatlicher Support',
        description: 'Unterstütze die App-Entwicklung jeden Monat',
        price: '€2,99/Monat',
        color: '#3498DB',
        icon: '📅'
      },
      {
        productId: 'yearly_support',
        title: 'Jährlicher Support',
        description: 'Spare 17% mit jährlicher Unterstützung',
        price: '€29,99/Jahr',
        color: '#27AE60',
        icon: '🎯'
      }
    ];
  }

  public async initialize(): Promise<void> {
    // Mock initialization
    console.log('BillingManager: Mock initialization');
    this.isInitialized = true;
    return Promise.resolve();
  }

  public getAllProducts(): Product[] {
    return this.products;
  }

  public getAllSubscriptions(): Product[] {
    return this.subscriptions;
  }

  public async purchaseProduct(productId: string): Promise<void> {
    // Mock purchase process
    console.log(`BillingManager: Mock purchase of ${productId}`);
    
    // Simulate async purchase
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate success (in production, this would handle real purchases)
    const product = [...this.products, ...this.subscriptions].find(p => p.productId === productId);
    if (product) {
      this.emit('purchase-completed', { productId, product });
    } else {
      this.emit('purchase-error', { error: 'Product not found', productId });
    }
  }

  // Simple event emitter implementation
  public on(event: string, listener: (...args: any[]) => void): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  public removeAllListeners(event?: string): void {
    if (event) {
      delete this.listeners[event];
    } else {
      this.listeners = {};
    }
  }

  private emit(event: string, ...args: any[]): void {
    if (this.listeners[event]) {
      this.listeners[event].forEach(listener => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
}

export default BillingManager;