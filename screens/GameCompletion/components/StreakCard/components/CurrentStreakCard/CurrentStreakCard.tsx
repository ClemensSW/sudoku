// CurrentStreakCard.tsx
import React, { useState, useEffect } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { MonthlyPlayData, loadStats } from '@/utils/storage';
import { useStreakCalendar } from './hooks/useStreakCalendar';
import StreakHero from './components/StreakHero';
import StreakCalendarGrid from './components/StreakCalendarGrid';
import StreakCalendarDebug from './components/StreakCalendarDebug';
import { styles } from './CurrentStreakCard.styles';

interface CurrentStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  playHistory?: { [yearMonth: string]: MonthlyPlayData };
  firstLaunchDate?: string;
}

const CurrentStreakCard: React.FC<CurrentStreakCardProps> = ({
  currentStreak: propCurrentStreak,
  longestStreak: propLongestStreak,
  playHistory: propPlayHistory,
  firstLaunchDate: propFirstLaunchDate,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // 🚨 DEBUG: Mock data state
  const [debugData, setDebugData] = useState<{
    currentStreak: number;
    longestStreak: number;
    shieldsAvailable: number;
    playHistory: { [yearMonth: string]: MonthlyPlayData };
    firstLaunchDate: string;
  } | null>(null);

  // Use debug data if available, otherwise use real props
  const currentStreak = debugData?.currentStreak ?? propCurrentStreak;
  const longestStreak = debugData?.longestStreak ?? propLongestStreak;
  const playHistory = debugData?.playHistory ?? propPlayHistory;
  const firstLaunchDate = debugData?.firstLaunchDate ?? propFirstLaunchDate;

  // Load shield availability
  const [shieldsAvailable, setShieldsAvailable] = useState(0);

  // 🚨 DEBUG: Override shields if debug data is active
  useEffect(() => {
    if (debugData) {
      setShieldsAvailable(debugData.shieldsAvailable);
    } else {
      const loadShields = async () => {
        const stats = await loadStats();
        if (stats?.dailyStreak) {
          setShieldsAvailable(
            stats.dailyStreak.shieldsAvailable +
            stats.dailyStreak.bonusShields
          );
        }
      };
      loadShields();
    }
  }, [playHistory, debugData]);

  const {
    year,
    month,
    monthData,
    monthNames,
    handlePreviousMonth,
    handleNextMonth,
    canGoBack,
    canGoForward,
    calendar,
    getDayStatus,
    daysInMonth,
    playedDays,
    progressPercentage,
  } = useStreakCalendar({
    playHistory,
    firstLaunchDate,
    currentStreak,
    shieldsAvailable,
  });

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
      {/* 🚨 DEBUG ONLY - Remove before production */}
      <StreakCalendarDebug
        onScenarioSelect={(scenario) => {
          setDebugData({
            currentStreak: scenario.currentStreak,
            longestStreak: scenario.longestStreak,
            shieldsAvailable: scenario.shieldsAvailable,
            playHistory: scenario.playHistory,
            firstLaunchDate: scenario.firstLaunchDate,
          });
        }}
        onReset={() => setDebugData(null)}
      />

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
        />
      )}
    </Animated.View>
  );
};

export default CurrentStreakCard;
