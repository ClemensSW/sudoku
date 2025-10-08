// modules/subscriptions/SubscriptionService.ts
/**
 * Subscription Service (Singleton)
 *
 * Zentraler Service für Subscription-Management.
 * Hört auf RevenueCat-Events und aktualisiert den Supporter-Status.
 */

import Purchases, { CustomerInfo } from 'react-native-purchases';
import { getSupporterStatus } from './entitlements';
import { SupporterStatus, SubscriberEvent } from './types';

type EventListener = (status: SupporterStatus, info?: CustomerInfo) => void;

class SubscriptionService {
  private static instance: SubscriptionService;
  private listeners: Map<SubscriberEvent, EventListener[]> = new Map();
  private currentStatus: SupporterStatus | null = null;
  private isInitialized: boolean = false;

  private constructor() {
    // Private constructor für Singleton
  }

  /**
   * Singleton Instance
   */
  public static getInstance(): SubscriptionService {
    if (!SubscriptionService.instance) {
      SubscriptionService.instance = new SubscriptionService();
    }
    return SubscriptionService.instance;
  }

  /**
   * Initialisiert den Service und startet das Listening auf RevenueCat
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('[SubscriptionService] Already initialized');
      return;
    }

    try {
      console.log('[SubscriptionService] Initializing...');

      // Load initial status
      this.currentStatus = await getSupporterStatus();
      console.log('[SubscriptionService] Initial status:', this.currentStatus);

      // Setup RevenueCat listener
      Purchases.addCustomerInfoUpdateListener(this.handleCustomerInfoUpdate);

      this.isInitialized = true;
      console.log('[SubscriptionService] Initialized successfully');
    } catch (error) {
      console.error('[SubscriptionService] Initialization error:', error);
      throw error;
    }
  }

  /**
   * Handle RevenueCat CustomerInfo Updates
   */
  private handleCustomerInfoUpdate = async (info: CustomerInfo) => {
    console.log('[SubscriptionService] CustomerInfo updated');

    try {
      const previousStatus = this.currentStatus;
      const newStatus = await getSupporterStatus();

      // Check if status changed
      if (this.hasStatusChanged(previousStatus, newStatus)) {
        console.log('[SubscriptionService] Status changed:', {
          from: previousStatus,
          to: newStatus,
        });

        this.currentStatus = newStatus;

        // Emit status-changed event
        this.emit('status-changed', newStatus, info);

        // Emit specific events
        if (newStatus.isPremiumSubscriber && !previousStatus?.isPremiumSubscriber) {
          this.emit('subscription-started', newStatus, info);
        } else if (!newStatus.isPremiumSubscriber && previousStatus?.isPremiumSubscriber) {
          this.emit('subscription-expired', newStatus, info);
        } else if (newStatus.isPremiumSubscriber && previousStatus?.isPremiumSubscriber) {
          this.emit('subscription-renewed', newStatus, info);
        }

        if (newStatus.isSupporter && !previousStatus?.isSupporter) {
          this.emit('purchase-completed', newStatus, info);
        }
      }
    } catch (error) {
      console.error('[SubscriptionService] Error handling customer info update:', error);
    }
  };

  /**
   * Prüft, ob sich der Status geändert hat
   */
  private hasStatusChanged(
    prev: SupporterStatus | null,
    current: SupporterStatus
  ): boolean {
    if (!prev) return true;

    return (
      prev.isSupporter !== current.isSupporter ||
      prev.isPremiumSubscriber !== current.isPremiumSubscriber ||
      prev.productId !== current.productId ||
      prev.isInGracePeriod !== current.isInGracePeriod
    );
  }

  /**
   * Gibt den aktuellen Supporter-Status zurück
   */
  public async getStatus(): Promise<SupporterStatus> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    // Refresh status from storage/RevenueCat
    this.currentStatus = await getSupporterStatus();
    return this.currentStatus;
  }

  /**
   * Fügt einen Event-Listener hinzu
   */
  public on(event: SubscriberEvent, listener: EventListener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(listener);
  }

  /**
   * Entfernt einen Event-Listener
   */
  public off(event: SubscriberEvent, listener: EventListener): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  /**
   * Entfernt alle Listener für ein Event
   */
  public removeAllListeners(event?: SubscriberEvent): void {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
  }

  /**
   * Emittiert ein Event an alle Listener
   */
  private emit(
    event: SubscriberEvent,
    status: SupporterStatus,
    info?: CustomerInfo
  ): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((listener) => {
        try {
          listener(status, info);
        } catch (error) {
          console.error(`[SubscriptionService] Error in listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Cleanup (für Tests oder wenn Service neu gestartet werden soll)
   */
  public cleanup(): void {
    this.removeAllListeners();
    this.currentStatus = null;
    this.isInitialized = false;
  }
}

export default SubscriptionService;
