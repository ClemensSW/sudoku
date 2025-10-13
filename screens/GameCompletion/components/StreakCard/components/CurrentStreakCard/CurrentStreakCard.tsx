// CurrentStreakCard.tsx
import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { MonthlyPlayData } from '@/utils/storage';
import { useStreakCalendar } from './hooks/useStreakCalendar';
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
  } = useStreakCalendar({ playHistory, firstLaunchDate });

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
        />
      )}
    </Animated.View>
  );
};

export default CurrentStreakCard;
