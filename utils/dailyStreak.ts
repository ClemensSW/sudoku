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

/**
 * Addiert Tage zu einem Datum und gibt ISO-String zurück
 */
function addDaysToDate(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Fügt einen Shield-Tag zur History hinzu (ohne als Spieltag zu zählen)
 */
async function addShieldDayToHistory(stats: GameStats, dateString: string): Promise<void> {
  if (!stats.dailyStreak) return;

  const date = new Date(dateString);
  const yearMonth = getYearMonth(date);
  const day = date.getDate();

  // Initialisiere Monat wenn nicht vorhanden
  if (!stats.dailyStreak.playHistory[yearMonth]) {
    stats.dailyStreak.playHistory[yearMonth] = { days: [], shieldDays: [] };
  }

  // Sicherstellen dass shieldDays existiert (für alte Daten ohne shieldDays)
  if (!stats.dailyStreak.playHistory[yearMonth].shieldDays) {
    stats.dailyStreak.playHistory[yearMonth].shieldDays = [];
  }

  // Füge nur zu shieldDays hinzu (nicht zu days - wurde nicht gespielt!)
  if (!stats.dailyStreak.playHistory[yearMonth].shieldDays.includes(day)) {
    stats.dailyStreak.playHistory[yearMonth].shieldDays.push(day);
    stats.dailyStreak.playHistory[yearMonth].shieldDays.sort((a, b) => a - b);
  }
}

// ===== Streak Logic =====

/**
 * Hauptlogik: Aktualisiert Daily Streak beim Spielstart
 *
 * Wird bei jedem Spielstart aufgerufen und entscheidet:
 * - Streak +1 wenn gestern gespielt
 * - Schutzschilder einsetzen für verpasste Tage (bis keine mehr da)
 * - Streak reset wenn nicht genug Schutzschilder
 *
 * @returns Object mit Änderungsstatus für UI
 */
export async function updateDailyStreak(): Promise<{
  changed: boolean;
  newStreak: number;
  shieldUsed: boolean;
  shieldsUsedCount?: number;
}> {
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
      return {
        changed: false,
        newStreak: stats.dailyStreak.currentStreak,
        shieldUsed: false,
      };
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
      return {
        changed: true,
        newStreak: stats.dailyStreak.currentStreak,
        shieldUsed: false,
      };
    }

    // Fall 2b: Gestern war ein Schild-Tag (durch applyPendingShields) → Streak +1 für heute
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    if (isShieldDayRecorded(stats, yesterdayStr)) {
      console.log('[Daily Streak] ✅ Yesterday was shielded → Streak +1 for today');
      stats.dailyStreak.currentStreak++;
      stats.dailyStreak.lastPlayedDate = today;

      // Update longest streak if new record
      if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
        stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
      }

      await addToPlayHistory(stats, today);
      await saveStats(stats);

      console.log(`[Daily Streak] 🎉 SUCCESS! Streak: ${stats.dailyStreak.currentStreak} days`);
      return {
        changed: true,
        newStreak: stats.dailyStreak.currentStreak,
        shieldUsed: false, // Schild wurde bereits von applyPendingShields verwendet
      };
    }

    // Fall 3: Vor 2+ Tagen gespielt → Prüfe Schutzschild
    const daysMissed = getDaysBetween(lastPlayed, today);
    console.log('[Daily Streak] Days missed:', daysMissed);

    // Fall 3a: Erster Spieltag ever (lastPlayed ist leer)
    if (!lastPlayed || lastPlayed === '') {
      console.log('[Daily Streak] ✅ First day playing or long break → Starting new streak');
      stats.dailyStreak.currentStreak = 1;
      stats.dailyStreak.lastPlayedDate = today;

      // Set longest streak to at least 1 on first play
      if (stats.dailyStreak.longestDailyStreak < 1) {
        stats.dailyStreak.longestDailyStreak = 1;
      }

      await addToPlayHistory(stats, today);
      await saveStats(stats);

      console.log(`[Daily Streak] 🎉 SUCCESS! Streak: ${stats.dailyStreak.currentStreak} days, Total days played: ${stats.dailyStreak.totalDaysPlayed}`);
      return {
        changed: true,
        newStreak: 1,
        shieldUsed: false,
      };
    }

    // Multi-Shield Logik: Verwende so viele Shields wie nötig/verfügbar
    if (daysMissed >= 2) {
      const daysToShield = daysMissed - 1; // z.B. 3 Tage seit letztem Spiel → 2 Tage verpasst

      // Prüfe welche Tage bereits durch applyPendingShields geschützt sind
      let alreadyShielded = 0;
      for (let i = 1; i <= daysToShield; i++) {
        const checkDate = addDaysToDate(lastPlayed, i);
        if (isShieldDayRecorded(stats, checkDate)) {
          alreadyShielded++;
        }
      }

      const remainingToShield = daysToShield - alreadyShielded;
      const availableShields = stats.dailyStreak.shieldsAvailable + stats.dailyStreak.bonusShields;
      const shieldsToUse = Math.min(availableShields, remainingToShield);

      console.log(`[Daily Streak] Days to shield: ${daysToShield}, Already shielded: ${alreadyShielded}, Remaining: ${remainingToShield}, Available: ${availableShields}, Using: ${shieldsToUse}`);

      // Shield-Tage zur History hinzufügen (retroaktiv) - nur für nicht bereits geschützte Tage
      let shieldsActuallyUsed = 0;
      for (let i = 1; i <= daysToShield && shieldsActuallyUsed < shieldsToUse; i++) {
        const shieldDate = addDaysToDate(lastPlayed, i);
        // Nur wenn noch nicht als Shield eingetragen
        if (!isShieldDayRecorded(stats, shieldDate)) {
          useShield(stats);
          await addShieldDayToHistory(stats, shieldDate);
          shieldsActuallyUsed++;
          console.log(`[Daily Streak] Shield #${shieldsActuallyUsed} applied to ${shieldDate}`);
        }
      }

      const totalProtected = alreadyShielded + shieldsActuallyUsed;
      if (totalProtected >= daysToShield) {
        // ✅ Alle verpassten Tage abgedeckt → Streak weiter
        stats.dailyStreak.currentStreak++;
        stats.dailyStreak.lastPlayedDate = today;

        // Update longest streak if new record
        if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
          stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
        }

        await addToPlayHistory(stats, today);
        await saveStats(stats);

        console.log(`[Daily Streak] ✅ ${shieldsActuallyUsed} new shield(s) used (${alreadyShielded} already shielded)! Streak preserved: ${stats.dailyStreak.currentStreak} days`);
        return {
          changed: true,
          newStreak: stats.dailyStreak.currentStreak,
          shieldUsed: shieldsActuallyUsed > 0 || alreadyShielded > 0,
          shieldsUsedCount: shieldsActuallyUsed,
        };
      } else {
        // ❌ Nicht genug Shields → Streak verloren, aber neuer Streak startet heute
        // Update longest streak bevor reset
        if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
          stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
        }

        // Neuer Streak startet mit 1 (User spielt HEUTE!)
        stats.dailyStreak.currentStreak = 1;
        stats.dailyStreak.lastPlayedDate = today;
        await addToPlayHistory(stats, today);
        await saveStats(stats);

        console.log(`[Daily Streak] ❌ Not enough shields (needed ${daysToShield}, had ${totalProtected}). ${shieldsActuallyUsed} new used, new streak started.`);
        return {
          changed: true,
          newStreak: 1,
          shieldUsed: shieldsActuallyUsed > 0,
          shieldsUsedCount: shieldsActuallyUsed,
        };
      }
    }
  } catch (error) {
    console.error('[Daily Streak] Error updating daily streak:', error);
    return {
      changed: false,
      newStreak: 0,
      shieldUsed: false,
    };
  }
}

/**
 * Findet alle Spieltage aus playHistory als sortierte ISO-Strings
 */
function getAllPlayDatesFromHistory(stats: GameStats): string[] {
  if (!stats.dailyStreak?.playHistory) return [];

  const dates: string[] = [];

  for (const [yearMonth, data] of Object.entries(stats.dailyStreak.playHistory)) {
    const [year, month] = yearMonth.split('-').map(Number);
    for (const day of data.days) {
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      dates.push(dateStr);
    }
  }

  return dates.sort(); // Chronologisch sortieren
}

/**
 * Findet den letzten Spieltag VOR einem bestimmten Datum
 */
function findLastPlayDateBefore(stats: GameStats, beforeDate: string): string | null {
  const allDates = getAllPlayDatesFromHistory(stats);
  const filtered = allDates.filter(d => d < beforeDate);
  return filtered.length > 0 ? filtered[filtered.length - 1] : null;
}

/**
 * Prüft ob für einen Tag bereits ein Shield eingetragen ist
 */
function isShieldDayRecorded(stats: GameStats, dateString: string): boolean {
  if (!stats.dailyStreak?.playHistory) return false;

  const date = new Date(dateString);
  const yearMonth = getYearMonth(date);
  const day = date.getDate();

  const monthData = stats.dailyStreak.playHistory[yearMonth];
  return monthData?.shieldDays?.includes(day) ?? false;
}

/**
 * Wendet Shields retroaktiv nach Cloud-Sync an
 *
 * Analysiert playHistory um Lücken zu finden und füllt sie mit Shields.
 * Funktioniert auch wenn User vor dem Sync bereits gespielt hat.
 */
export async function applyShieldsAfterSync(): Promise<void> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) return;

    const today = getTodayDate();

    console.log('[Streak Sync] === APPLY SHIELDS AFTER SYNC ===');
    console.log('[Streak Sync] Today:', today);

    // Finde alle Spieltage aus playHistory
    const allPlayDates = getAllPlayDatesFromHistory(stats);
    console.log('[Streak Sync] All play dates from history:', allPlayDates);

    if (allPlayDates.length < 2) {
      console.log('[Streak Sync] Less than 2 play dates - no gaps to fill');
      return;
    }

    // Finde den neuesten Spieltag (könnte heute oder früher sein)
    const mostRecentPlayDate = allPlayDates[allPlayDates.length - 1];
    // Finde den zweit-neuesten Spieltag
    const secondMostRecentPlayDate = allPlayDates[allPlayDates.length - 2];

    console.log('[Streak Sync] Most recent play:', mostRecentPlayDate);
    console.log('[Streak Sync] Second most recent play:', secondMostRecentPlayDate);

    // Berechne Lücke zwischen den letzten beiden Spieltagen
    const daysMissed = getDaysBetween(secondMostRecentPlayDate, mostRecentPlayDate);
    console.log('[Streak Sync] Gap between last two plays:', daysMissed, 'days');

    if (daysMissed < 2) {
      console.log('[Streak Sync] No gap to fill (consecutive days)');
      return;
    }

    // Prüfe wie viele Shield-Tage bereits eingetragen sind
    let existingShieldCount = 0;
    for (let i = 1; i < daysMissed; i++) {
      const checkDate = addDaysToDate(secondMostRecentPlayDate, i);
      if (isShieldDayRecorded(stats, checkDate)) {
        existingShieldCount++;
      }
    }

    const daysToShield = daysMissed - 1;
    const remainingToShield = daysToShield - existingShieldCount;

    console.log(`[Streak Sync] Days to shield: ${daysToShield}, Already shielded: ${existingShieldCount}, Remaining: ${remainingToShield}`);

    if (remainingToShield <= 0) {
      console.log('[Streak Sync] Gap already filled with shields');
      return;
    }

    // Wende Shields an
    const availableShields = stats.dailyStreak.shieldsAvailable + stats.dailyStreak.bonusShields;
    const shieldsToUse = Math.min(availableShields, remainingToShield);

    console.log(`[Streak Sync] Available shields: ${availableShields}, Using: ${shieldsToUse}`);

    let shieldsApplied = 0;
    for (let i = 1; i < daysMissed && shieldsApplied < shieldsToUse; i++) {
      const shieldDate = addDaysToDate(secondMostRecentPlayDate, i);

      // Nur wenn noch nicht als Shield eingetragen
      if (!isShieldDayRecorded(stats, shieldDate)) {
        useShield(stats);
        await addShieldDayToHistory(stats, shieldDate);
        shieldsApplied++;
        console.log(`[Streak Sync] Shield ${shieldsApplied} applied to ${shieldDate}`);
      }
    }

    // Aktualisiere lastPlayedDate auf den letzten geschützten Tag (falls Shields verwendet)
    if (shieldsApplied > 0) {
      // Finde den letzten geschützten Tag
      let lastShieldedDay = secondMostRecentPlayDate;
      for (let i = daysToShield; i >= 1; i--) {
        const checkDate = addDaysToDate(secondMostRecentPlayDate, i);
        if (isShieldDayRecorded(stats, checkDate)) {
          lastShieldedDay = checkDate;
          break;
        }
      }

      // Wenn nicht genug Shields und mostRecentPlayDate ist nicht heute,
      // setze lastPlayedDate auf letzten geschützten Tag
      if (shieldsApplied + existingShieldCount < daysToShield) {
        stats.dailyStreak.lastPlayedDate = lastShieldedDay;
        console.log(`[Streak Sync] lastPlayedDate updated to ${lastShieldedDay}`);

        // Streak gebrochen
        if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
          stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
        }
        stats.dailyStreak.currentStreak = 0;
        console.log('[Streak Sync] Not enough shields - streak broken');
      } else {
        console.log('[Streak Sync] All days covered - streak preserved');
      }
    }

    await saveStats(stats);
    console.log('[Streak Sync] Stats saved');
  } catch (error) {
    console.error('[Streak Sync] Error applying shields after sync:', error);
  }
}

/**
 * Berechnet den erwarteten Streak basierend auf playHistory
 * Zählt konsekutive Tage (gespielt ODER geschützt) rückwärts vom lastPlayedDate
 */
function calculateExpectedStreak(stats: GameStats, lastPlayedDate: string, daysMissedUntilYesterday: number): number {
  if (!stats.dailyStreak?.playHistory) return 0;

  // Finde alle erfolgreichen Tage (gespielt ODER geschützt) sortiert
  const allSuccessfulDays: string[] = [];

  for (const [yearMonth, monthData] of Object.entries(stats.dailyStreak.playHistory)) {
    const [year, month] = yearMonth.split('-').map(Number);

    // Gespielte Tage
    for (const day of monthData.days || []) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      allSuccessfulDays.push(dateStr);
    }

    // Geschützte Tage
    for (const day of monthData.shieldDays || []) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!allSuccessfulDays.includes(dateStr)) {
        allSuccessfulDays.push(dateStr);
      }
    }
  }

  // Sortiere aufsteigend
  allSuccessfulDays.sort();

  if (allSuccessfulDays.length === 0) return 0;

  // Zähle konsekutive Tage rückwärts vom letzten erfolgreichen Tag
  let streak = 0;
  let currentDate = new Date(allSuccessfulDays[allSuccessfulDays.length - 1]);

  for (let i = allSuccessfulDays.length - 1; i >= 0; i--) {
    const dayDate = new Date(allSuccessfulDays[i]);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - streak);

    // Prüfe ob der Tag der erwartete konsekutive Tag ist
    if (dayDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      streak++;
    } else {
      // Nicht konsekutiv - prüfe ob es nur 1 Tag Unterschied ist (erlaubt Lücken die später gefüllt werden)
      break;
    }
  }

  console.log(`[calculateExpectedStreak] Found ${streak} consecutive days from ${allSuccessfulDays[allSuccessfulDays.length - 1]}`);
  return streak;
}

/**
 * Berechnet den aktuellen Streak aus der playHistory.
 * Zählt konsekutive Tage (gespielt ODER geschützt) rückwärts vom letzten erfolgreichen Tag.
 *
 * Diese Funktion ist für den Merge-Service exportiert, um nach dem Sync
 * den Streak aus der gemergten playHistory neu zu berechnen.
 */
export function calculateStreakFromHistory(
  playHistory: { [yearMonth: string]: MonthlyPlayData } | undefined,
  lastPlayedDate: string | undefined
): number {
  if (!playHistory) return 0;

  // Sammle alle erfolgreichen Tage (gespielt ODER geschützt)
  const allSuccessfulDays: string[] = [];

  for (const [yearMonth, monthData] of Object.entries(playHistory)) {
    const [year, month] = yearMonth.split('-').map(Number);

    // Gespielte Tage
    for (const day of monthData.days || []) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      allSuccessfulDays.push(dateStr);
    }

    // Geschützte Tage
    for (const day of monthData.shieldDays || []) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      if (!allSuccessfulDays.includes(dateStr)) {
        allSuccessfulDays.push(dateStr);
      }
    }
  }

  // Sortiere aufsteigend
  allSuccessfulDays.sort();

  if (allSuccessfulDays.length === 0) return 0;

  // Zähle konsekutive Tage rückwärts vom letzten erfolgreichen Tag
  let streak = 0;
  const lastSuccessfulDay = allSuccessfulDays[allSuccessfulDays.length - 1];
  let currentDate = new Date(lastSuccessfulDay);

  for (let i = allSuccessfulDays.length - 1; i >= 0; i--) {
    const dayDate = new Date(allSuccessfulDays[i]);
    const expectedDate = new Date(currentDate);
    expectedDate.setDate(expectedDate.getDate() - streak);

    // Prüfe ob der Tag der erwartete konsekutive Tag ist
    if (dayDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
      streak++;
    } else {
      break;
    }
  }

  console.log(`[calculateStreakFromHistory] Found ${streak} consecutive days from ${lastSuccessfulDay}`);
  return streak;
}

/**
 * Wendet ausstehende Schilde automatisch an
 *
 * Wird beim Öffnen des Leistung-Screens aufgerufen, um verpasste Tage
 * sofort mit verfügbaren Schilden zu schützen (ohne auf ein Spiel zu warten).
 *
 * @returns Object mit Anzahl angewandter Schilde und ob Streak gebrochen ist
 */
export async function applyPendingShields(): Promise<{
  shieldsApplied: number;
  streakBroken: boolean;
}> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) {
      return { shieldsApplied: 0, streakBroken: false };
    }

    const today = getTodayDate();
    const lastPlayed = stats.dailyStreak.lastPlayedDate;

    console.log('[Pending Shields] === CHECK ===');
    console.log('[Pending Shields] Today:', today);
    console.log('[Pending Shields] Last played:', lastPlayed);

    // Keine Aktion nötig wenn kein lastPlayedDate vorhanden
    if (!lastPlayed || lastPlayed === '') {
      console.log('[Pending Shields] No last played date, skipping');
      return { shieldsApplied: 0, streakBroken: false };
    }

    // Keine Aktion nötig wenn heute oder gestern gespielt
    if (lastPlayed === today) {
      console.log('[Pending Shields] Already played today, skipping');
      return { shieldsApplied: 0, streakBroken: false };
    }

    if (isYesterday(lastPlayed)) {
      console.log('[Pending Shields] Played yesterday, no shields needed');
      return { shieldsApplied: 0, streakBroken: false };
    }

    // Berechne verpasste Tage (zwischen lastPlayed und gestern)
    // Wir schützen nur Tage BIS GESTERN, nicht heute
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const daysMissed = getDaysBetween(lastPlayed, yesterdayStr);
    console.log('[Pending Shields] Days missed (until yesterday):', daysMissed);

    if (daysMissed < 1) {
      console.log('[Pending Shields] No days to shield');
      return { shieldsApplied: 0, streakBroken: false };
    }

    // Prüfe welche Tage bereits geschützt sind
    let alreadyShielded = 0;
    for (let i = 1; i <= daysMissed; i++) {
      const checkDate = addDaysToDate(lastPlayed, i);
      if (isShieldDayRecorded(stats, checkDate)) {
        alreadyShielded++;
      }
    }

    const daysToShield = daysMissed - alreadyShielded;
    console.log('[Pending Shields] Already shielded:', alreadyShielded, 'Days to shield:', daysToShield);

    if (daysToShield <= 0) {
      console.log('[Pending Shields] All days already shielded');
      return { shieldsApplied: 0, streakBroken: false };
    }

    // Schilde anwenden
    const availableShields = stats.dailyStreak.shieldsAvailable + stats.dailyStreak.bonusShields;
    const shieldsToUse = Math.min(availableShields, daysToShield);

    console.log('[Pending Shields] Available shields:', availableShields, 'Using:', shieldsToUse);

    let shieldsApplied = 0;
    for (let i = 1; i <= daysMissed && shieldsApplied < shieldsToUse; i++) {
      const shieldDate = addDaysToDate(lastPlayed, i);

      // Nur wenn noch nicht als Shield eingetragen
      if (!isShieldDayRecorded(stats, shieldDate)) {
        useShield(stats);
        await addShieldDayToHistory(stats, shieldDate);
        shieldsApplied++;
        console.log(`[Pending Shields] Shield ${shieldsApplied} applied to ${shieldDate}`);
      }
    }

    // Prüfe ob Streak gebrochen ist (nicht genug Schilde für alle verpassten Tage)
    const totalProtected = alreadyShielded + shieldsApplied;
    const streakBroken = totalProtected < daysMissed;

    if (streakBroken) {
      console.log('[Pending Shields] ❌ Not enough shields - streak broken');
      // Streak gebrochen - speichere aktuellen als longest falls höher
      if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
        stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
      }
      stats.dailyStreak.currentStreak = 0;
    } else {
      // ✅ Alle Tage geschützt - Berechne korrekten Streak basierend auf konsekutiven Tagen
      // Dies ist wichtig nach Cloud-Sync, wenn der Streak möglicherweise zurückgesetzt wurde
      // aber die shieldDays erhalten geblieben sind (UNION-Strategie)
      const expectedStreak = calculateExpectedStreak(stats, lastPlayed, daysMissed);

      if (expectedStreak > stats.dailyStreak.currentStreak) {
        console.log(`[Pending Shields] ✅ Recalculating streak: ${stats.dailyStreak.currentStreak} → ${expectedStreak}`);
        stats.dailyStreak.currentStreak = expectedStreak;

        // Update longest streak if new record
        if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
          stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
        }
      } else {
        console.log('[Pending Shields] ✅ Streak already correct:', stats.dailyStreak.currentStreak);
      }
    }

    await saveStats(stats);
    console.log('[Pending Shields] Stats saved');

    return { shieldsApplied, streakBroken };
  } catch (error) {
    console.error('[Pending Shields] Error:', error);
    return { shieldsApplied: 0, streakBroken: false };
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

  // Update longest streak before resetting if current is higher
  if (stats.dailyStreak.currentStreak > stats.dailyStreak.longestDailyStreak) {
    stats.dailyStreak.longestDailyStreak = stats.dailyStreak.currentStreak;
  }

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
    };
  }

  const monthData = stats.dailyStreak.playHistory[yearMonth];

  // Sicherstellen dass shieldDays existiert (für alte Daten ohne shieldDays)
  if (!monthData.shieldDays) {
    monthData.shieldDays = [];
  }

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
 * Yearly: 4 Schilde, Monthly: 3 Schilde, Free: 2 Schilde
 */
export async function checkWeeklyShieldReset(): Promise<void> {
  try {
    let stats = await loadStats();
    if (!stats.dailyStreak) {
      console.warn('[Daily Streak] dailyStreak missing in checkWeeklyShieldReset, skipping reset');
      return;
    }

    const now = new Date();
    const lastReset = new Date(stats.dailyStreak.lastShieldResetDate);
    lastReset.setHours(0, 0, 0, 0);

    // Berechne nächsten Montag ab dem letzten Reset
    const nextMonday = getNextMonday(lastReset);
    nextMonday.setHours(0, 0, 0, 0);

    console.log('[Shield Reset] Checking weekly reset...');
    console.log('[Shield Reset] Last reset:', formatDateISO(lastReset));
    console.log('[Shield Reset] Next Monday:', formatDateISO(nextMonday));
    console.log('[Shield Reset] Now:', formatDateISO(now));

    // Prüfe ob Reset fällig ist (nextMonday <= heute)
    if (now >= nextMonday) {
      // Reset ist fällig!
      const supporterStatus = await getSupporterStatus();

      // Dynamische Berechnung: Yearly=4, Monthly=3, Free/One-time=2
      const { getMaxWeeklyShields } = await import('@/modules/subscriptions/entitlements');
      const maxShields = await getMaxWeeklyShields(supporterStatus);

      stats.dailyStreak.shieldsAvailable = maxShields;
      stats.dailyStreak.shieldsUsedThisWeek = 0;
      stats.dailyStreak.lastShieldResetDate = formatDateISO(now); // Setze auf HEUTE, nicht nextMonday

      await saveStats(stats);
      console.log(`[Shield Reset] ✅ Weekly shield reset: ${maxShields} shields restored (Yearly: 4, Monthly: 3, Free: 2)`);
      console.log(`[Shield Reset] Next reset will be on: ${formatDateISO(getNextMonday(now))}`);
    } else {
      console.log('[Shield Reset] ❌ Not due yet');
    }
  } catch (error) {
    console.error('[Daily Streak] Error checking weekly shield reset:', error);
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
  const { getMaxWeeklyShields } = await import('@/modules/subscriptions/entitlements');
  const maxRegularShields = await getMaxWeeklyShields(supporterStatus);

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

// ===== Shield Refill Logic (Support Shop) =====

/**
 * Füllt Schutzschilder nach einem Kauf auf
 *
 * @param purchaseType - 'one-time' = aktuelles Maximum auffüllen (2 für Free, 3/4 für Premium)
 *                      'subscription' = dynamisch (Yearly=4, Monthly=3)
 * @param productId - Optional: Product-ID des Kaufs (z.B. "yearly_support", "monthly_support")
 *                    Wenn übergeben, wird direkt aus der ID erkannt ob yearly (4 Schilde) oder monthly (3 Schilde)
 *                    ohne auf RevenueCat-Sync zu warten
 */
export async function refillShields(
  purchaseType: 'one-time' | 'subscription' = 'one-time',
  productId?: string
): Promise<void> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) {
      console.warn('[Daily Streak] dailyStreak missing in refillShields, cannot refill');
      return;
    }

    let maxShields: 2 | 3 | 4;

    // Falls productId übergeben wurde: Direkt aus Product-ID erkennen (schneller, kein RevenueCat-Wait)
    if (productId) {
      const isYearly = productId.toLowerCase().includes('yearly');

      if (purchaseType === 'subscription') {
        maxShields = isYearly ? 4 : 3;
        console.log(`[Daily Streak] 🛡️ Subscription purchase (from productId): ${productId} → ${maxShields} shields (Yearly=4, Monthly=3)`);
      } else {
        // One-time: Prüfe aktuellen Supporter-Status für Maximum
        const supporterStatus = await getSupporterStatus();
        const { getMaxWeeklyShields } = await import('@/modules/subscriptions/entitlements');
        maxShields = await getMaxWeeklyShields(supporterStatus);
        console.log(`[Daily Streak] 🛡️ One-time purchase: Shields refilled to ${maxShields}`);
      }
    } else {
      // Fallback: Wie vorher (holt von RevenueCat)
      const supporterStatus = await getSupporterStatus();
      const { getMaxWeeklyShields } = await import('@/modules/subscriptions/entitlements');
      maxShields = await getMaxWeeklyShields(supporterStatus);

      if (purchaseType === 'subscription') {
        console.log(`[Daily Streak] 🛡️ Subscription purchase (from RevenueCat): Shields refilled to ${maxShields} (Yearly=4, Monthly=3)`);
      } else {
        console.log(`[Daily Streak] 🛡️ One-time purchase: Shields refilled to ${maxShields}`);
      }
    }

    stats.dailyStreak.shieldsAvailable = maxShields;
    await saveStats(stats);
    console.log('[Daily Streak] Shields successfully refilled and saved');
  } catch (error) {
    console.error('[Daily Streak] Error refilling shields:', error);
  }
}

/**
 * Fügt +1 Bonus-Schild für einen Einmalkauf hinzu.
 *
 * Bonus-Schilde sind permanent und werden NICHT wöchentlich zurückgesetzt.
 * Sie werden als Fallback verwendet, wenn reguläre Schilde aufgebraucht sind.
 *
 * Dies ist die EINZIGE Quelle für Bonus-Schilde.
 */
export async function addBonusShieldForPurchase(): Promise<void> {
  try {
    const stats = await loadStats();
    if (!stats.dailyStreak) {
      console.warn('[Daily Streak] dailyStreak missing, cannot add bonus shield');
      return;
    }

    stats.dailyStreak.bonusShields = (stats.dailyStreak.bonusShields || 0) + 1;
    await saveStats(stats);
    console.log('[Daily Streak] 🛡️ +1 Bonus shield added for one-time purchase. Total bonus shields:', stats.dailyStreak.bonusShields);
  } catch (error) {
    console.error('[Daily Streak] Error adding bonus shield:', error);
  }
}
