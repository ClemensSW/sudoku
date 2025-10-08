// modules/game/epCalculator.ts
/**
 * EP Calculator
 *
 * Berechnet EP-Gewinne mit Supporter-Multiplikator.
 * Zentrale Stelle für alle EP-Berechnungen.
 */

import { getSupporterStatus, getEpMultiplier } from '../subscriptions/entitlements';

/**
 * Berechnet den EP-Gewinn mit Supporter-Bonus
 * @param baseEp Basis-EP ohne Multiplikator
 * @returns Finaler EP-Gewinn (mit Multiplikator)
 */
export async function calculateEpWithBonus(baseEp: number): Promise<number> {
  try {
    const multiplier = await getEpMultiplier();
    const finalEp = baseEp * multiplier;

    console.log(`[EP Calculator] Base: ${baseEp} | Multiplier: ${multiplier}x | Final: ${finalEp}`);

    return finalEp;
  } catch (error) {
    console.error('[EP Calculator] Error calculating EP:', error);
    // Fallback: Kein Bonus
    return baseEp;
  }
}

/**
 * Gibt den aktuellen EP-Multiplikator zurück
 * @returns 1 (kein Bonus) oder 2 (Supporter-Bonus)
 */
export async function getCurrentMultiplier(): Promise<1 | 2> {
  try {
    return await getEpMultiplier();
  } catch (error) {
    console.error('[EP Calculator] Error getting multiplier:', error);
    return 1;
  }
}

/**
 * Prüft, ob der Nutzer aktuell einen EP-Bonus hat
 * @returns true wenn Supporter-Bonus aktiv ist
 */
export async function hasEpBonus(): Promise<boolean> {
  const multiplier = await getCurrentMultiplier();
  return multiplier === 2;
}

/**
 * Formatiert EP-Anzeige mit Bonus-Indikator
 * @param ep EP-Wert
 * @param showMultiplier Zeige "×2" wenn Bonus aktiv
 * @returns Formatierter String (z.B. "+50 EP ×2")
 */
export async function formatEpDisplay(
  ep: number,
  showMultiplier: boolean = true
): Promise<string> {
  const hasBonus = await hasEpBonus();

  if (hasBonus && showMultiplier) {
    return `+${ep} EP ×2`;
  }

  return `+${ep} EP`;
}
