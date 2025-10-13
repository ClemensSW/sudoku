// CurrentStreakCard.tsx
import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { MonthlyPlayData } from '@/utils/storage';
import { useStreakCalendar } from './hooks/useStreakCalendar';
import { useDebugCalendar, SHOW_DEBUG_BUTTON } from './hooks/useDebugCalendar';
import StreakHero from './components/StreakHero';
import StreakCalendarGrid from './components/StreakCalendarGrid';
import { styles } from './CurrentStreakCard.styles';

interface CurrentStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  playHistory?: { [yearMonth: string]: MonthlyPlayData };
  firstLaunchDate?: string;
}

const CurrentStreakCard: React.FC<CurrentStreakCardProps> = ({
  currentStreak,
  longestStreak,
  playHistory,
  firstLaunchDate,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // First, get selectedMonth from a minimal calendar hook call
  const [internalMonth, setInternalMonth] = React.useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  });

  // Debug Hook
  const {
    debugScenario,
    debugMonthData,
    cycleDebugScenario,
    getDebugLabel,
    getNextDebugLabel,
  } = useDebugCalendar({ selectedMonth: internalMonth, playHistory });

  // Mock firstLaunchDate for 'before-launch' scenario
  // Setze auf 1. des aktuellen Monats, damit ganzer Monat bis heute sichtbar ist
  const mockFirstLaunchDate = SHOW_DEBUG_BUTTON && debugScenario === 'before-launch'
    ? new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]
    : firstLaunchDate;

  const {
    year,
    month,
    monthData: originalMonthData,
    monthNames,
    handlePreviousMonth,
    handleNextMonth,
    canGoBack,
    canGoForward,
    calendar,
    getDayStatus,
    daysInMonth,
    playedDays: originalPlayedDays,
    progressPercentage: originalProgressPercentage,
    selectedMonth,
  } = useStreakCalendar({ playHistory, firstLaunchDate: mockFirstLaunchDate });

  // Sync internal month with calendar hook
  React.useEffect(() => {
    setInternalMonth(selectedMonth);
  }, [selectedMonth]);

  // Use debug data if debug mode is active
  const monthData = SHOW_DEBUG_BUTTON && debugScenario !== 'off' ? debugMonthData : originalMonthData;
  const playedDays = SHOW_DEBUG_BUTTON && debugScenario !== 'off'
    ? (debugMonthData?.days.length || 0)
    : originalPlayedDays;
  const progressPercentage = SHOW_DEBUG_BUTTON && debugScenario !== 'off'
    ? (daysInMonth > 0 ? (playedDays / daysInMonth) * 100 : 0)
    : originalProgressPercentage;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
        },
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Hero Section */}
      <StreakHero
        currentStreak={currentStreak}
        longestStreak={longestStreak}
      />

      {/* Calendar Grid - Only if playHistory is provided */}
      {playHistory && (
        <StreakCalendarGrid
          calendar={calendar}
          year={year}
          month={month}
          monthNames={monthNames}
          getDayStatus={getDayStatus}
          daysInMonth={daysInMonth}
          playedDays={playedDays}
          progressPercentage={progressPercentage}
          isCompleted={monthData?.completed || false}
          onPreviousMonth={handlePreviousMonth}
          onNextMonth={handleNextMonth}
          canGoBack={canGoBack()}
          canGoForward={canGoForward()}
          // Debug props
          showDebugButton={SHOW_DEBUG_BUTTON}
          debugScenario={debugScenario}
          onDebugCycle={cycleDebugScenario}
          debugLabel={getDebugLabel()}
          debugNextLabel={getNextDebugLabel()}
        />
      )}
    </Animated.View>
  );
};

export default CurrentStreakCard;
