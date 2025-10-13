// hooks/useDebugCalendar.ts
import { useState, useMemo } from 'react';
import { MonthlyPlayData } from '@/utils/storage';
import { getDaysInMonth } from '@/utils/dailyStreak';

// DEBUG: Toggle für Debug-Button (auf false setzen für Production)
export const SHOW_DEBUG_BUTTON = true;

export type DebugScenario = 'off' | 'full' | 'half' | 'shields' | 'mixed' | 'before-launch';

interface UseDebugCalendarProps {
  selectedMonth: string;
  playHistory?: { [yearMonth: string]: MonthlyPlayData };
}

export const useDebugCalendar = ({ selectedMonth, playHistory }: UseDebugCalendarProps) => {
  const [debugScenario, setDebugScenario] = useState<DebugScenario>('off');

  const debugMonthData = useMemo((): MonthlyPlayData | undefined => {
    if (debugScenario === 'off' || !playHistory) {
      return playHistory?.[selectedMonth];
    }

    const daysInMonth = getDaysInMonth(selectedMonth);
    const mockDays: number[] = [];
    const mockShieldDays: number[] = [];

    switch (debugScenario) {
      case 'full':
        // Alle Tage gespielt
        for (let d = 1; d <= daysInMonth; d++) mockDays.push(d);
        break;

      case 'half':
        // Erste Hälfte gespielt
        for (let d = 1; d <= Math.floor(daysInMonth / 2); d++) mockDays.push(d);
        break;

      case 'shields':
        // Viele Shield-Tage
        for (let d = 1; d <= daysInMonth; d++) {
          if (d % 3 === 0) mockShieldDays.push(d);
          else if (d % 2 === 0) mockDays.push(d);
        }
        break;

      case 'mixed':
        // Gemischt: Gespielt, Shields, Fehltage
        for (let d = 1; d <= daysInMonth; d++) {
          if (d % 5 === 0) mockShieldDays.push(d);
          else if (d % 3 !== 0) mockDays.push(d);
          // Alle anderen sind Fehltage
        }
        break;

      case 'before-launch':
        // Simuliert Tage VOR firstLaunchDate (werden ignoriert)
        // Zeigt nur einige Tage an, als ob firstLaunchDate in der Mitte des Monats wäre
        for (let d = 15; d <= daysInMonth; d++) {
          if (d % 2 === 0) mockDays.push(d);
          else if (d % 3 === 0) mockShieldDays.push(d);
        }
        break;

      default:
        return playHistory[selectedMonth];
    }

    return {
      days: mockDays,
      shieldDays: mockShieldDays,
      completed: debugScenario === 'full',
      reward: debugScenario === 'full' ? { type: 'bonus_shields', value: 1, claimed: false } : null,
    };
  }, [debugScenario, selectedMonth, playHistory]);

  const cycleDebugScenario = () => {
    const scenarios: DebugScenario[] = ['off', 'full', 'half', 'shields', 'mixed', 'before-launch'];
    const currentIndex = scenarios.indexOf(debugScenario);
    const nextIndex = (currentIndex + 1) % scenarios.length;
    setDebugScenario(scenarios[nextIndex]);
  };

  const getDebugLabel = (): string => {
    switch (debugScenario) {
      case 'off': return 'Aus';
      case 'full': return 'Voller Monat';
      case 'half': return 'Halber Monat';
      case 'shields': return 'Viele Shields';
      case 'mixed': return 'Gemischt';
      case 'before-launch': return 'Vor App-Start';
      default: return 'Aus';
    }
  };

  const getNextDebugLabel = (): string => {
    const scenarios: DebugScenario[] = ['off', 'full', 'half', 'shields', 'mixed', 'before-launch'];
    const currentIndex = scenarios.indexOf(debugScenario);
    const nextIndex = (currentIndex + 1) % scenarios.length;

    switch (scenarios[nextIndex]) {
      case 'off': return 'Aus';
      case 'full': return 'Voller Monat';
      case 'half': return 'Halber Monat';
      case 'shields': return 'Viele Shields';
      case 'mixed': return 'Gemischt';
      case 'before-launch': return 'Vor App-Start';
      default: return 'Aus';
    }
  };

  return {
    debugScenario,
    debugMonthData,
    cycleDebugScenario,
    getDebugLabel,
    getNextDebugLabel,
  };
};
