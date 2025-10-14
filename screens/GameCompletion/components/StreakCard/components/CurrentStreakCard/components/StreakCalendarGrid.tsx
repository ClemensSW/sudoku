// components/StreakCalendarGrid.tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import ShieldIcon from '@/assets/svg/shield.svg';
import ShieldEmptyIcon from '@/assets/svg/shieldEmpty.svg';
import LetterXIcon from '@/assets/svg/letter-x.svg';
import { styles } from '../CurrentStreakCard.styles';

interface StreakCalendarGridProps {
  calendar: (number | null)[];
  year: number;
  month: number;
  monthNames: string[];
  getDayStatus: (day: number) => 'played' | 'shield' | 'streak-broken' | 'inactive' | 'today' | 'future' | 'before-launch';
  daysInMonth: number;
  playedDays: number;
  progressPercentage: number;
  isCompleted: boolean;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
}

const StreakCalendarGrid: React.FC<StreakCalendarGridProps> = ({
  calendar,
  year,
  month,
  monthNames,
  getDayStatus,
  daysInMonth,
  playedDays,
  progressPercentage,
  isCompleted,
  onPreviousMonth,
  onNextMonth,
  canGoBack,
  canGoForward,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  const getDayStyle = (status: string) => {
    switch (status) {
      case 'played':
        return {
          backgroundColor: '#95D6A4',
          borderColor: 'transparent',
        };
      case 'shield':
        return {
          backgroundColor: theme.isDark ? '#77CE8E40' : '#77CE8E30',
          borderColor: '#77CE8E',
        };
      case 'streak-broken':
        return {
          backgroundColor: theme.isDark ? 'rgba(244,143,177,0.15)' : 'rgba(239,83,80,0.08)',
          borderColor: theme.isDark ? 'rgba(244,143,177,0.35)' : 'rgba(239,83,80,0.25)',
          borderWidth: 1.5,
        };
      case 'inactive':
        return {
          backgroundColor: theme.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          borderColor: theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
          borderWidth: 1,
        };
      case 'today':
        return {
          backgroundColor: theme.isDark
            ? 'rgba(255, 255, 255, 0.12)'  // Etwas stärker für bessere Sichtbarkeit
            : '#FFFFFF',  // Reines Weiß in Light Mode
          borderColor: theme.isDark ? '#FFFFFF' : '#666666',
          borderWidth: 2,
          borderStyle: 'solid' as const,
          // Shadow nur im Light Mode (vermeidet elevation+transparency Grafikfehler)
          ...(theme.isDark ? {} : {
            shadowColor: '#666666',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }),
        };
      case 'before-launch':
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
        return (
          <ShieldIcon
            width={32}
            height={32}
            fill="#77CE8E"
          />
        );
      case 'streak-broken':
        return (
          <LetterXIcon
            width={20}
            height={20}
            fill={theme.isDark ? '#F48FB1' : '#D32F2F'}
          />
        );
      case 'inactive':
        return (
          <ShieldEmptyIcon
            width={28}
            height={28}
            fill={theme.isDark ? colors.textSecondary : '#888888'}
            style={{ opacity: 0.5 }}
          />
        );
      case 'today':
        return (
          <Text
            style={[
              styles.dayText,
              {
                color: theme.isDark ? colors.textPrimary : '#666666',  // Helleres Grau in Light Mode
                fontWeight: '700',
                fontSize: 16,
              },
            ]}
          >
            {day}
          </Text>
        );
      case 'played':
      case 'future':
      case 'before-launch':
      default:
        return (
          <Text
            style={[
              styles.dayText,
              {
                color:
                  status === 'future' || status === 'before-launch'
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
    <View style={styles.calendarSection}>
      {/* Header with Month Navigation */}
      <View style={styles.calendarHeader}>
        <Pressable
          onPress={onPreviousMonth}
          disabled={!canGoBack}
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.6 : !canGoBack ? 0.3 : 1 },
          ]}
        >
          <Feather name="chevron-left" size={28} color={colors.textPrimary} />
        </Pressable>

        <Pressable
          onPress={canGoForward ? onNextMonth : canGoBack ? onPreviousMonth : undefined}
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
          onPress={onNextMonth}
          disabled={!canGoForward}
          style={({ pressed }) => [
            styles.navButton,
            { opacity: pressed ? 0.6 : !canGoForward ? 0.3 : 1 },
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
                    borderWidth: status === 'shield' ? 1.5 : status === 'streak-broken' ? 1.5 : status === 'inactive' ? 1 : status === 'today' ? 2 : 0,
                  },
                ]}
              >
                {getDayContent(status, day)}
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
          {isCompleted && (
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
    </View>
  );
};

export default StreakCalendarGrid;
