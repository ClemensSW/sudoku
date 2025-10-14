// hooks/useStreakCalendar.ts
import { useState, useMemo } from 'react';
import { MonthlyPlayData } from '@/utils/storage';
import { getDaysInMonth } from '@/utils/dailyStreak';

interface UseStreakCalendarProps {
  playHistory?: { [yearMonth: string]: MonthlyPlayData };
  firstLaunchDate?: string;
  currentStreak: number;
  shieldsAvailable: number;
}

export const useStreakCalendar = ({ playHistory, firstLaunchDate, currentStreak, shieldsAvailable }: UseStreakCalendarProps) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const [year, month] = selectedMonth.split('-').map(Number);
  const monthData = playHistory?.[selectedMonth];

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];

  // Navigation handlers
  const handlePreviousMonth = () => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() - 1);
    const newYearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedMonth(newYearMonth);
  };

  const handleNextMonth = () => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const newYearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedMonth(newYearMonth);
  };

  const canGoBack = () => {
    const date = new Date(year, month - 1, 1);
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
    return date > twelveMonthsAgo;
  };

  const canGoForward = () => {
    const date = new Date(year, month - 1, 1);
    const today = new Date();
    return date < new Date(today.getFullYear(), today.getMonth(), 1);
  };

  // Generate calendar grid
  const calendar = useMemo(() => {
    if (!playHistory) return [];

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = getDaysInMonth(selectedMonth);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

    const cal: (number | null)[] = [];

    for (let i = 0; i < adjustedFirstDay; i++) {
      cal.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cal.push(day);
    }

    return cal;
  }, [playHistory, year, month, selectedMonth]);

  // Day status checker
  const getDayStatus = (day: number): 'played' | 'shield' | 'shield-available' | 'missed' | 'today' | 'future' | 'before-launch' => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const dayDate = new Date(year, month - 1, day);

    // 1. Heute-Check
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (dayDate.getTime() === today.getTime()) {
      if (monthData?.days.includes(day)) return 'played';
      return 'today';
    }

    // 2. Future
    if (dayDate > now) return 'future';

    // 3. Before launch
    if (firstLaunchDate) {
      const launchDate = new Date(firstLaunchDate);
      launchDate.setHours(0, 0, 0, 0);
      if (dayDate < launchDate) return 'before-launch';
    }

    // 4. Gespielt
    if (monthData?.days.includes(day)) return 'played';

    // 5. Shield wurde eingesetzt
    if (monthData?.shieldDays.includes(day)) return 'shield';

    // 6. Shield verfügbar (vor heute, Streak nicht gestartet)
    if (currentStreak === 0 && shieldsAvailable > 0 && dayDate < now) {
      return 'shield-available';
    }

    // 7. Verpasst
    return 'missed';
  };

  // Progress calculation
  const daysInMonth = playHistory ? getDaysInMonth(selectedMonth) : 0;
  const playedDays = monthData?.days.length || 0;
  const progressPercentage = daysInMonth > 0 ? (playedDays / daysInMonth) * 100 : 0;

  return {
    // State
    selectedMonth,
    year,
    month,
    monthData,
    monthNames,

    // Navigation
    handlePreviousMonth,
    handleNextMonth,
    canGoBack,
    canGoForward,

    // Calendar data
    calendar,
    getDayStatus,

    // Progress
    daysInMonth,
    playedDays,
    progressPercentage,
  };
};
