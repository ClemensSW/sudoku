// utils/dailyStreak.ts
/**
 * Daily Streak System - Core Logic
 *
 * Verwaltet tägliche Streaks, Schutzschilder und Kalender-Tracking
 */

import { loadStats, saveStats, getTodayDate, GameStats, MonthlyPlayData } from './storage';
import { getSupporterStatus } from '@/modules/subscriptions/entitlements';

// ===== Date Helpers =====

/**
 * Prüft ob ein Datum "gestern" ist
 */
export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date.getTime() === yesterday.getTime();
}

/**
 * Berechnet Tage-Differenz zwischen zwei Daten
 * @returns Anzahl Tage zwischen date1 und date2 (immer positiv)
 */
export function getDaysBetween(date1String: string, date2String: string): number {
  const d1 = new Date(date1String);
  const d2 = new Date(date2String);
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Gibt den nächsten Montag ab einem Datum zurück
 */
export function getNextMonday(fromDate: Date): Date {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + ((7 - date.getDay() + 1) % 7 || 7));
  date.setHours(0, 0, 0, 0);
  return date;
}

/**
 * Gibt Year-Month String für ein Datum zurück (Format: "2025-01")
 */
export function getYearMonth(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  return `${year}-${month}`;
}

/**
 * Gibt aktuellen Year-Month String zurück
 */
export function getCurrentYearMonth(): string {
  return getYearMonth(new Date());
}

/**
 * Gibt die Anzahl Tage in einem Monat zurück
 */
export function getDaysInMonth(yearMonth: string): number {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Date(year, month, 0).getDate();
}

/**
 * Formatiert ein Datum für Display (z.B. "15. Januar 2025")
 */
export function formatDate(date: Date, locale: string = 'de-DE'): string {
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// ===== Streak Logic =====

/**
 * Hauptlogik: Aktualisiert Daily Streak beim Spielstart
 *
 * Wird bei jedem Spielstart aufgerufen und entscheidet:
 * - Streak +1 wenn gestern gespielt
 * - Schutzschild einsetzen wenn 1 Tag verpasst
 * - Streak reset wenn 2+ Tage verpasst
 */
export async function updateDailyStreak(): Promise<void> {
  try {
    let stats = await loadStats();

    // Safety check: If dailyStreak is still missing after loadStats (which includes migration),
    // this means migration failed or stats are corrupted. Re-trigger migration.
    if (!stats.dailyStreak) {
      console.warn('[Daily Streak] dailyStreak missing after loadStats, re-triggering migration...');
      // Force reload which triggers migration again
      stats = await loadStats();

      // If still missing, abort
      if (!stats.dailyStreak) {
        console.error('[Daily Streak] dailyStreak data missing after migration retry, cannot update');
        return;
      }
    }

    const today = getTodayDate();
    const lastPlayed = stats.dailyStreak.lastPlayedDate;

    console.log('[Daily Streak] === UPDATE CHECK ===');
    console.log('[Daily Streak] Today:', today);
    console.log('[Daily Streak] Last played:', lastPlayed);
    console.log('[Daily Streak] Current streak:', stats.dailyStreak.currentStreak);

    // Fall 1: Heute bereits gespielt → nichts tun
    if (lastPlayed === today) {
      console.log('[Daily Streak] ❌ Already played today, no update needed');
      return;
    }

    // Fall 2: Gestern gespielt → Streak +1
    if (isYesterday(lastPlayed)) {
      console.log('[Daily Streak] ✅ Last played was yesterday → Streak +1');
      stats.dailyStreak.currentStreak++;
      stats.dailyStreak.lastPlayedDate = today;

      // Update longest streak if new record
      if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
        stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
      }

      console.log('[Daily Streak] Adding to play history...');
      await addToPlayHistory(stats, today);

      console.log('[Daily Streak] Saving stats...');
      await saveStats(stats);

      console.log(`[Daily Streak] 🎉 SUCCESS! Streak: ${stats.dailyStreak.currentStreak} days, Total days played: ${stats.dailyStreak.totalDaysPlayed}`);
      return;
    }

    // Fall 3: Vor 2+ Tagen gespielt → Prüfe Schutzschild
    const daysMissed = getDaysBetween(lastPlayed, today);
    console.log('[Daily Streak] Days missed:', daysMissed);

    // Fall 3a: Erster Spieltag ever (lastPlayed ist leer oder sehr alt)
    if (!lastPlayed || lastPlayed === '' || daysMissed > 30) {
      console.log('[Daily Streak] ✅ First day playing or long break → Starting new streak');
      stats.dailyStreak.currentStreak = 1;
      stats.dailyStreak.lastPlayedDate = today;

      await addToPlayHistory(stats, today);
      await saveStats(stats);

      console.log(`[Daily Streak] 🎉 SUCCESS! Streak: ${stats.dailyStreak.currentStreak} days, Total days played: ${stats.dailyStreak.totalDaysPlayed}`);
      return;
    }

    if (daysMissed === 2) {
      // Genau 1 Tag verpasst → Versuche Schutzschild einzusetzen
      if (canUseShield(stats)) {
        useShield(stats);
        stats.dailyStreak.currentStreak++; // Streak bleibt bestehen
        stats.dailyStreak.lastPlayedDate = today;

        // Update longest streak if new record
        if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
          stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
        }

        await addToPlayHistory(stats, today, { shieldUsed: true });
        await saveStats(stats);

        console.log(`[Daily Streak] Shield used! Streak preserved: ${stats.dailyStreak.currentStreak} days`);
        // TODO: Show notification to user ("Schutzschild aktiviert!")
        return;
      } else {
        // Kein Schutzschild verfügbar → Streak verloren
        await resetStreak(stats, today);
        console.log('[Daily Streak] No shield available, streak reset');
        // TODO: Show notification ("Streak verloren - kein Schutzschild verfügbar")
        return;
      }
    } else if (daysMissed > 2) {
      // 2+ Tage verpasst → Streak verloren (auch mit Schutzschild)
      await resetStreak(stats, today);
      console.log(`[Daily Streak] ${daysMissed - 1} days missed, streak reset`);
      // TODO: Show notification ("Streak verloren")
      return;
    }
  } catch (error) {
    console.error('[Daily Streak] Error updating daily streak:', error);
  }
}

/**
 * Prüft ob Schutzschild verfügbar ist
 */
export function canUseShield(stats: GameStats): boolean {
  if (!stats.dailyStreak) return false;

  const totalShields =
    stats.dailyStreak.shieldsAvailable + stats.dailyStreak.bonusShields;

  return totalShields > 0;
}

/**
 * Setzt einen Schutzschild ein
 */
export function useShield(stats: GameStats): void {
  if (!stats.dailyStreak) return;

  // Versuche zuerst reguläre Schutzschilder zu verwenden
  if (stats.dailyStreak.shieldsAvailable > 0) {
    stats.dailyStreak.shieldsAvailable--;
    stats.dailyStreak.shieldsUsedThisWeek++;
  } else if (stats.dailyStreak.bonusShields > 0) {
    // Fallback zu Bonus-Schildern
    stats.dailyStreak.bonusShields--;
  }

  stats.dailyStreak.totalShieldsUsed++;
  console.log('[Daily Streak] Shield consumed. Remaining:',
    stats.dailyStreak.shieldsAvailable, 'regular +',
    stats.dailyStreak.bonusShields, 'bonus');
}

/**
 * Setzt den Streak zurück
 */
async function resetStreak(stats: GameStats, today: string): Promise<void> {
  if (!stats.dailyStreak) return;

  stats.dailyStreak.currentStreak = 0;
  stats.dailyStreak.lastPlayedDate = today;
  await saveStats(stats);
}

/**
 * Fügt einen Tag zur Play-History hinzu
 */
async function addToPlayHistory(
  stats: GameStats,
  dateString: string,
  options?: { shieldUsed?: boolean }
): Promise<void> {
  if (!stats.dailyStreak) return;

  const date = new Date(dateString);
  const yearMonth = getYearMonth(date);
  const day = date.getDate();

  // Initialisiere Monat wenn nicht vorhanden
  if (!stats.dailyStreak.playHistory[yearMonth]) {
    stats.dailyStreak.playHistory[yearMonth] = {
      days: [],
      shieldDays: [],
      completed: false,
      reward: null,
    };
  }

  const monthData = stats.dailyStreak.playHistory[yearMonth];

  // Füge Tag hinzu wenn noch nicht vorhanden
  if (!monthData.days.includes(day)) {
    monthData.days.push(day);
    monthData.days.sort((a, b) => a - b); // Sortiere Tage aufsteigend
    stats.dailyStreak.totalDaysPlayed++;
  }

  // Markiere als Shield-Day wenn relevant
  if (options?.shieldUsed && !monthData.shieldDays.includes(day)) {
    monthData.shieldDays.push(day);
    monthData.shieldDays.sort((a, b) => a - b);
  }
}

// ===== Weekly Reset Logic =====

/**
 * Prüft und führt wöchentlichen Schutzschild-Reset durch (jeden Montag)
 */
export async function checkWeeklyShieldReset(): Promise<void> {
  try {
    let stats = await loadStats();
    if (!stats.dailyStreak) {
      console.warn('[Daily Streak] dailyStreak missing in checkWeeklyShieldReset, skipping reset');
      return;
    }

    const lastReset = new Date(stats.dailyStreak.lastShieldResetDate);
    const nextMonday = getNextMonday(lastReset);
    const now = new Date();

    if (now >= nextMonday) {
      // Reset ist fällig!
      const supporterStatus = await getSupporterStatus();
      const maxShields = supporterStatus.isPremiumSubscriber ? 3 : 2;

      stats.dailyStreak.shieldsAvailable = maxShields;
      stats.dailyStreak.shieldsUsedThisWeek = 0;
      stats.dailyStreak.lastShieldResetDate = formatDateISO(nextMonday);

      await saveStats(stats);
      console.log(`[Daily Streak] Weekly shield reset: ${maxShields} shields restored`);
    }
  } catch (error) {
    console.error('[Daily Streak] Error checking weekly shield reset:', error);
  }
}

// ===== Monthly Completion Logic =====

/**
 * Prüft ob ein Monat vollständig abgeschlossen wurde
 * Wird nach jedem gewonnenen Spiel aufgerufen
 */
export async function checkMonthlyCompletion(yearMonth: string): Promise<void> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) return;

    const monthData = stats.dailyStreak.playHistory[yearMonth];
    if (!monthData || monthData.completed) return;

    const daysInMonth = getDaysInMonth(yearMonth);
    const playedDays = monthData.days.length;

    if (playedDays === daysInMonth) {
      // Monat vollständig! 🎉
      monthData.completed = true;
      monthData.reward = {
        claimed: false,
        type: 'bonus_shields',
        value: 2, // +2 Bonus Schutzschilder
      };

      stats.dailyStreak.completedMonths.push(yearMonth);
      await saveStats(stats);

      console.log(`[Daily Streak] Month ${yearMonth} completed! Reward available.`);
      // TODO: Show MonthlyRewardModal
    }
  } catch (error) {
    console.error('[Daily Streak] Error checking monthly completion:', error);
  }
}

/**
 * Löst eine monatliche Belohnung ein
 */
export async function claimMonthlyReward(yearMonth: string): Promise<boolean> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) return false;

    const monthData = stats.dailyStreak.playHistory[yearMonth];
    if (!monthData || !monthData.reward || monthData.reward.claimed) {
      return false;
    }

    // Reward einlösen
    if (monthData.reward.type === 'bonus_shields') {
      stats.dailyStreak.bonusShields += monthData.reward.value;
    }
    // Weitere Reward-Types hier hinzufügen (ep_boost, avatar_frame, etc.)

    monthData.reward.claimed = true;
    await saveStats(stats);

    console.log(`[Daily Streak] Monthly reward claimed for ${yearMonth}`);
    return true;
  } catch (error) {
    console.error('[Daily Streak] Error claiming monthly reward:', error);
    return false;
  }
}

// ===== Utility Functions =====

/**
 * Formatiert ein Date-Objekt zu ISO-Date-String (YYYY-MM-DD)
 */
function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Gibt Statistik-Daten für UI zurück
 */
export async function getStreakStats() {
  const stats = await loadStats();
  if (!stats.dailyStreak) return null;

  const supporterStatus = await getSupporterStatus();
  const maxRegularShields = supporterStatus.isPremiumSubscriber ? 3 : 2;

  return {
    currentStreak: stats.dailyStreak.currentStreak,
    longestStreak: stats.dailyStreak.longestDailyStreak,
    totalDaysPlayed: stats.dailyStreak.totalDaysPlayed,
    completedMonths: stats.dailyStreak.completedMonths.length,
    shieldsAvailable: stats.dailyStreak.shieldsAvailable,
    bonusShields: stats.dailyStreak.bonusShields,
    maxRegularShields,
    lastPlayedDate: stats.dailyStreak.lastPlayedDate,
    playHistory: stats.dailyStreak.playHistory,
  };
}

/**
 * Gibt Daten für einen bestimmten Monat zurück
 */
export async function getMonthData(yearMonth: string): Promise<MonthlyPlayData | null> {
  const stats = await loadStats();
  if (!stats.dailyStreak) return null;

  return stats.dailyStreak.playHistory[yearMonth] || null;
}
