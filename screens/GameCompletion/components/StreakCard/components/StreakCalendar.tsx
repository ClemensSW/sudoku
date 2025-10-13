// screens/Leistung/components/StreakTab/components/StreakCalendar.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { MonthlyPlayData } from '@/utils/storage';
import { getDaysInMonth } from '@/utils/dailyStreak';

interface StreakCalendarProps {
  currentMonth: string; // Format: "2025-01"
  playHistory: { [yearMonth: string]: MonthlyPlayData };
  onMonthChange?: (yearMonth: string) => void;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentMonth,
  playHistory,
  onMonthChange,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // Parse year/month
  const [year, month] = selectedMonth.split('-').map(Number);
  const monthData = playHistory[selectedMonth];

  // Month names
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
    onMonthChange?.(newYearMonth);
  };

  const handleNextMonth = () => {
    const date = new Date(year, month - 1, 1);
    date.setMonth(date.getMonth() + 1);
    const newYearMonth = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    setSelectedMonth(newYearMonth);
    onMonthChange?.(newYearMonth);
  };

  // Check if we can navigate (only last 12 months, not future)
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
  const generateCalendar = () => {
    const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = Sunday
    const daysInMonth = getDaysInMonth(selectedMonth);
    const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday = 0

    const calendar: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < adjustedFirstDay; i++) {
      calendar.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      calendar.push(day);
    }

    return calendar;
  };

  const calendar = generateCalendar();
  const daysInMonth = getDaysInMonth(selectedMonth);
  const playedDays = monthData?.days.length || 0;
  const progressPercentage = (playedDays / daysInMonth) * 100;

  // Check day status
  const getDayStatus = (day: number): 'played' | 'shield' | 'missed' | 'future' => {
    if (!monthData) return 'missed';

    const today = new Date();
    const dayDate = new Date(year, month - 1, day);

    // Future days
    if (dayDate > today) return 'future';

    // Check if shield was used
    if (monthData.shieldDays.includes(day)) return 'shield';

    // Check if played
    if (monthData.days.includes(day)) return 'played';

    return 'missed';
  };

  const getDayStyle = (status: string) => {
    switch (status) {
      case 'played':
        return {
          backgroundColor: theme.isDark ? '#34A85350' : '#34A85320',
          borderColor: '#34A853',
        };
      case 'shield':
        return {
          backgroundColor: theme.isDark ? '#4285F450' : '#4285F420',
          borderColor: '#4285F4',
        };
      case 'missed':
        return {
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
          borderColor: 'transparent',
        };
      case 'future':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          opacity: 0.3,
        };
      default:
        return {};
    }
  };

  const getDayIcon = (status: string) => {
    switch (status) {
      case 'played':
        return <Feather name="check" size={14} color="#34A853" />;
      case 'shield':
        return <Feather name="shield" size={14} color="#4285F4" />;
      default:
        return null;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
        },
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Header with Month Navigation */}
      <View style={styles.header}>
        <Pressable
          onPress={handlePreviousMonth}
          disabled={!canGoBack()}
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.6 : !canGoBack() ? 0.3 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={24} color={colors.textPrimary} />
        </Pressable>

        <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
          {monthNames[month - 1]} {year}
        </Text>

        <Pressable
          onPress={handleNextMonth}
          disabled={!canGoForward()}
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.6 : !canGoForward() ? 0.3 : 1 },
          ]}
        >
          <Feather name="chevron-right" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdayRow}>
        {['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'].map((day) => (
          <Text key={day} style={[styles.weekdayText, { color: colors.textSecondary }]}>
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {calendar.map((day, index) => {
          if (day === null) {
            return <View key={`empty-${index}`} style={styles.dayCell} />;
          }

          const status = getDayStatus(day);
          const dayStyle = getDayStyle(status);

          return (
            <Animated.View
              key={`day-${day}`}
              entering={FadeIn.duration(200).delay(index * 15)}
              style={styles.dayCell}
            >
              <View
                style={[
                  styles.dayCircle,
                  dayStyle,
                  { borderWidth: status !== 'future' && status !== 'missed' ? 2 : 0 },
                ]}
              >
                {getDayIcon(status)}
                <Text
                  style={[
                    styles.dayText,
                    {
                      color:
                        status === 'future'
                          ? colors.textSecondary
                          : colors.textPrimary,
                    },
                  ]}
                >
                  {day}
                </Text>
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View
          style={[
            styles.progressBackground,
            {
              backgroundColor: theme.isDark
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.06)',
            },
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              {
                width: `${progressPercentage}%`,
                backgroundColor: monthData?.completed ? '#34A853' : colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.progressLabelRow}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            {t('streakTab.calendar.monthProgress', { count: playedDays, total: daysInMonth })}
          </Text>
          {monthData?.completed && (
            <View style={[styles.completedBadge, { backgroundColor: '#34A853' }]}>
              <Feather name="check-circle" size={14} color="white" />
              <Text style={styles.completedText}>Vollständig</Text>
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: radius.xl,
    padding: spacing.lg,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    marginBottom: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  navButton: {
    padding: spacing.xs,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Weekday Headers
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },

  // Calendar Grid
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dayCell: {
    width: '14.28%', // 7 columns
    aspectRatio: 1,
    padding: 2,
  },
  dayCircle: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Progress
  progressSection: {
    marginTop: spacing.sm,
  },
  progressBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
});

export default StreakCalendar;
