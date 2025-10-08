// modules/subscriptions/hooks/useImageUnlock.ts
/**
 * useImageUnlock Hook
 *
 * React Hook für Image-Unlock-Logik.
 * Verwaltet Quota und Unlock-Status.
 */

import { useState, useEffect, useCallback } from 'react';
import { getImageUnlockQuota, canUnlockImage } from '../entitlements';
import { ImageUnlockQuota } from '../types';

interface UseImageUnlockResult {
  /**
   * Aktuelle Unlock-Quota
   */
  quota: ImageUnlockQuota | null;

  /**
   * Lädt die Quota gerade?
   */
  loading: boolean;

  /**
   * Fehler beim Laden
   */
  error: Error | null;

  /**
   * Kann der Nutzer aktuell ein Bild freischalten? (Quick-Access)
   */
  canUnlock: boolean;

  /**
   * Verbleibende Unlocks diesen Monat (Quick-Access)
   */
  remainingUnlocks: number;

  /**
   * Bereits genutzte Unlocks diesen Monat (Quick-Access)
   */
  usedUnlocks: number;

  /**
   * Nächstes Reset-Datum (Quick-Access)
   */
  nextResetDate: Date | null;

  /**
   * Refresh-Funktion (manuell Quota neu laden)
   */
  refresh: () => Promise<void>;
}

export function useImageUnlock(): UseImageUnlockResult {
  const [quota, setQuota] = useState<ImageUnlockQuota | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Load quota
  const loadQuota = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentQuota = await getImageUnlockQuota();
      setQuota(currentQuota);
    } catch (err) {
      console.error('[useImageUnlock] Error loading quota:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadQuota();
  }, [loadQuota]);

  // Quick-access properties
  const canUnlock = quota?.canUnlock ?? false;
  const remainingUnlocks = quota?.remainingUnlocks ?? 0;
  const usedUnlocks = quota?.usedThisMonth ?? 0;
  const nextResetDate = quota?.nextResetDate ?? null;

  return {
    quota,
    loading,
    error,
    canUnlock,
    remainingUnlocks,
    usedUnlocks,
    nextResetDate,
    refresh: loadQuota,
  };
}
