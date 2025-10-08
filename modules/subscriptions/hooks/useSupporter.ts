// modules/subscriptions/hooks/useSupporter.ts
/**
 * useSupporter Hook
 *
 * React Hook für Supporter-Status.
 * Automatisches Re-Rendering bei Status-Änderungen.
 */

import { useState, useEffect, useCallback } from 'react';
import SubscriptionService from '../SubscriptionService';
import { SupporterStatus } from '../types';

interface UseSupporterResult {
  /**
   * Aktueller Supporter-Status
   */
  status: SupporterStatus | null;

  /**
   * Lädt der Status gerade?
   */
  loading: boolean;

  /**
   * Fehler beim Laden
   */
  error: Error | null;

  /**
   * Ist der Nutzer ein Supporter? (Quick-Access)
   */
  isSupporter: boolean;

  /**
   * Hat der Nutzer ein aktives Abo? (Quick-Access)
   */
  isPremiumSubscriber: boolean;

  /**
   * EP-Multiplikator (1 oder 2)
   */
  epMultiplier: 1 | 2;

  /**
   * Refresh-Funktion (manuell Status neu laden)
   */
  refresh: () => Promise<void>;
}

export function useSupporter(): UseSupporterResult {
  const [status, setStatus] = useState<SupporterStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load initial status
  const loadStatus = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const service = SubscriptionService.getInstance();
      const currentStatus = await service.getStatus();

      setStatus(currentStatus);
    } catch (err) {
      console.error('[useSupporter] Error loading status:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Setup effect
  useEffect(() => {
    const service = SubscriptionService.getInstance();

    // Load initial status
    loadStatus();

    // Listen to status changes
    const handleStatusChange = (newStatus: SupporterStatus) => {
      console.log('[useSupporter] Status changed:', newStatus);
      setStatus(newStatus);
    };

    service.on('status-changed', handleStatusChange);

    // Cleanup
    return () => {
      service.off('status-changed', handleStatusChange);
    };
  }, [loadStatus]);

  // Quick-access properties
  const isSupporter = status?.isSupporter ?? false;
  const isPremiumSubscriber = status?.isPremiumSubscriber ?? false;
  const epMultiplier = isSupporter ? 2 : 1;

  return {
    status,
    loading,
    error,
    isSupporter,
    isPremiumSubscriber,
    epMultiplier,
    refresh: loadStatus,
  };
}
