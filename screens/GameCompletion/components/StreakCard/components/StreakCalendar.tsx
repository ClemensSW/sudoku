// screens/Leistung/components/StreakTab/components/StreakCalendar.tsx
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import { MonthlyPlayData } from '@/utils/storage';
import { getDaysInMonth } from '@/utils/dailyStreak';
import ShieldIcon from '@/assets/svg/shield.svg';
import LetterXIcon from '@/assets/svg/letter-x.svg';

interface StreakCalendarProps {
  currentMonth: string; // Format: "2025-01"
  playHistory: { [yearMonth: string]: MonthlyPlayData };
  onMonthChange?: (yearMonth: string) => void;
}

// DEBUG: Toggle für Debug-Button (auf false setzen für Production)
const SHOW_DEBUG_BUTTON = true;

const StreakCalendar: React.FC<StreakCalendarProps> = ({
  currentMonth,
  playHistory,
  onMonthChange,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // DEBUG: State für Test-Szenarien
  const [debugScenario, setDebugScenario] = useState<'off' | 'full' | 'half' | 'shields' | 'mixed'>('off');

  // Parse year/month
  const [year, month] = selectedMonth.split('-').map(Number);
  let monthData = playHistory[selectedMonth];

  // DEBUG: Override monthData basierend auf Szenario
  if (debugScenario !== 'off') {
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
    }

    monthData = {
      days: mockDays,
      shieldDays: mockShieldDays,
      completed: debugScenario === 'full',
      reward: debugScenario === 'full' ? { type: 'bonus_shields', value: 1, claimed: false } : undefined,
    };
  }

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
        // Clean: Gefüllter Kreis mit Shield-Farbverlauf
        return {
          backgroundColor: '#95D6A4', // Primäre Shield-Farbe
          borderColor: 'transparent',
        };
      case 'shield':
        // Shield-Tag: Subtiler Shield-Akzent mit passenden Farben
        return {
          backgroundColor: theme.isDark ? '#77CE8E40' : '#77CE8E30',
          borderColor: '#77CE8E',
        };
      case 'missed':
        // Fehltag: Subtiler roter Akzent (nicht zu aggressiv)
        return {
          backgroundColor: theme.isDark ? 'rgba(239,83,80,0.15)' : 'rgba(239,83,80,0.08)',
          borderColor: theme.isDark ? 'rgba(239,83,80,0.4)' : 'rgba(239,83,80,0.25)',
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

  const getDayContent = (status: string, day: number) => {
    switch (status) {
      case 'shield':
        // Shield-Tag: Nur SVG Shield-Icon, KEINE Tageszahl
        return (
          <ShieldIcon
            width={32}
            height={32}
            fill="#77CE8E"
          />
        );
      case 'missed':
        // Fehltag: Nur SVG Letter-X-Icon, KEINE Tageszahl
        return (
          <LetterXIcon
            width={28}
            height={28}
            fill={theme.isDark ? '#EF5350' : '#D32F2F'}
          />
        );
      case 'played':
      case 'future':
      default:
        // Normale Tage: Nur Tageszahl
        return (
          <Text
            style={[
              styles.dayText,
              {
                color:
                  status === 'future'
                    ? colors.textSecondary
                    : status === 'played'
                    ? '#FFFFFF'
                    : colors.textPrimary,
                fontWeight: status === 'played' ? '700' : '600',
              },
            ]}
          >
            {day}
          </Text>
        );
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
      {/* Header with Month Navigation - Gesamte Zeile klickbar */}
      <View style={styles.header}>
        <Pressable
          onPress={handlePreviousMonth}
          disabled={!canGoBack()}
          style={({ pressed }) => [
            styles.navButton,
            styles.navButtonExpanded,
            { opacity: pressed ? 0.6 : !canGoBack() ? 0.3 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={28} color={colors.textPrimary} />
        </Pressable>

        <Pressable
          onPress={canGoForward() ? handleNextMonth : canGoBack() ? handlePreviousMonth : undefined}
          style={({ pressed }) => [
            styles.monthTitleContainer,
            { backgroundColor: pressed ? (theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)') : 'transparent' },
          ]}
        >
          <Text style={[styles.monthTitle, { color: colors.textPrimary }]}>
            {monthNames[month - 1]} {year}
          </Text>
        </Pressable>

        <Pressable
          onPress={handleNextMonth}
          disabled={!canGoForward()}
          style={({ pressed }) => [
            styles.navButton,
            styles.navButtonExpanded,
            { opacity: pressed ? 0.6 : !canGoForward() ? 0.3 : 1 },
          ]}
        >
          <Feather name="chevron-right" size={28} color={colors.textPrimary} />
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
                  {
                    borderWidth: status === 'shield' || status === 'missed' ? 1.5 : 0,
                  },
                ]}
              >
                {getDayContent(status, day)}
              </View>
            </Animated.View>
          );
        })}
      </View>

      {/* Progress Bar mit Farbverlauf */}
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
              styles.progressFillWrapper,
              {
                width: `${progressPercentage}%`,
              },
            ]}
          >
            <LinearGradient
              colors={['#95D6A4', '#B3E59F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.progressFill}
            />
          </Animated.View>
        </View>

        <View style={styles.progressLabelRow}>
          <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
            {t('streakTab.calendar.monthProgress', { count: playedDays, total: daysInMonth })}
          </Text>
          {monthData?.completed && (
            <LinearGradient
              colors={['#95D6A4', '#B3E59F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.completedBadge}
            >
              <Feather name="check-circle" size={14} color="white" />
              <Text style={styles.completedText}>Vollständig</Text>
            </LinearGradient>
          )}
        </View>
      </View>

      {/* DEBUG BUTTON */}
      {SHOW_DEBUG_BUTTON && (
        <Pressable
          onPress={() => {
            const scenarios: Array<'off' | 'full' | 'half' | 'shields' | 'mixed'> = ['off', 'full', 'half', 'shields', 'mixed'];
            const currentIndex = scenarios.indexOf(debugScenario);
            const nextIndex = (currentIndex + 1) % scenarios.length;
            setDebugScenario(scenarios[nextIndex]);
          }}
          style={[
            styles.debugButton,
            {
              backgroundColor: theme.isDark ? 'rgba(255,152,0,0.15)' : 'rgba(255,152,0,0.1)',
              borderColor: '#FF9800',
            },
          ]}
        >
          <View style={styles.debugRow}>
            <Feather name="tool" size={16} color="#FF9800" />
            <Text style={[styles.debugText, { color: colors.textPrimary }]}>
              DEBUG: {debugScenario === 'off' ? 'Aus' : debugScenario === 'full' ? 'Voller Monat' : debugScenario === 'half' ? 'Halber Monat' : debugScenario === 'shields' ? 'Viele Shields' : 'Gemischt'}
            </Text>
          </View>
          <Text style={[styles.debugHint, { color: colors.textSecondary }]}>
            Tap zum Wechseln: {debugScenario === 'off' ? 'Voller Monat' : debugScenario === 'full' ? 'Halber Monat' : debugScenario === 'half' ? 'Viele Shields' : debugScenario === 'shields' ? 'Gemischt' : 'Aus'}
          </Text>
        </Pressable>
      )}
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    marginBottom: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  navButton: {
    padding: spacing.xs,
  },
  navButtonExpanded: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
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
  progressFillWrapper: {
    height: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
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

  // Debug Button
  debugButton: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderStyle: 'dashed',
    gap: spacing.xs,
  },
  debugRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  debugText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  debugHint: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default StreakCalendar;
