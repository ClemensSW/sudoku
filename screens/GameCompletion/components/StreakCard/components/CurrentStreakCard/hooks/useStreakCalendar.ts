// hooks/useStreakCalendar.ts
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MonthlyPlayData } from '@/utils/storage';
import { getDaysInMonth } from '@/utils/dailyStreak';

interface UseStreakCalendarProps {
  playHistory?: { [yearMonth: string]: MonthlyPlayData };
  firstLaunchDate?: string;
  currentStreak: number;
  shieldsAvailable: number;
}

export const useStreakCalendar = ({ playHistory, firstLaunchDate, currentStreak, shieldsAvailable }: UseStreakCalendarProps) => {
  const { t } = useTranslation('leistung');

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  const [year, month] = selectedMonth.split('-').map(Number);
  const monthData = playHistory?.[selectedMonth];

  const monthNames = [
    t('streakTab.months.january'),
    t('streakTab.months.february'),
    t('streakTab.months.march'),
    t('streakTab.months.april'),
    t('streakTab.months.may'),
    t('streakTab.months.june'),
    t('streakTab.months.july'),
    t('streakTab.months.august'),
    t('streakTab.months.september'),
    t('streakTab.months.october'),
    t('streakTab.months.november'),
    t('streakTab.months.december'),
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

  const handleGoToCurrentMonth = () => {
    const now = new Date();
    const currentYearMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedMonth(currentYearMonth);
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
  const getDayStatus = (day: number): 'played' | 'shield' | 'streak-broken' | 'inactive' | 'today' | 'future' | 'before-launch' => {
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
    if (monthData?.shieldDays?.includes(day)) return 'shield';

    // 6. Streak-Break Detection (wenn Streak = 0)
    if (currentStreak === 0 && dayDate < now) {
      // Finde alle erfolgreichen Tage (gespielt ODER mit Shield geschützt)
      const allSuccessfulDays = [
        ...(monthData?.days || []),
        ...(monthData?.shieldDays || [])
      ].sort((a, b) => a - b);

      const lastSuccessfulDay = allSuccessfulDays[allSuccessfulDays.length - 1];

      // Erster Tag nach dem letzten erfolgreichen Tag = Streak-Break
      if (lastSuccessfulDay && day === lastSuccessfulDay + 1) {
        return 'streak-broken';
      }

      // Alle Tage NACH dem Streak-Break = inactive
      if (lastSuccessfulDay && day > lastSuccessfulDay + 1) {
        return 'inactive';
      }

      // Kein erfolgreicher Tag im Monat = inactive
      if (allSuccessfulDays.length === 0) {
        return 'inactive';
      }
    }

    // 7. Verpasst (während aktivem Streak)
    return 'streak-broken';
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
    handleGoToCurrentMonth,
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
