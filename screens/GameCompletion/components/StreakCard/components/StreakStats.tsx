// screens/Leistung/components/StreakTab/components/StreakStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import LightningIcon from '@/assets/svg/lightning.svg';
import SuccessIcon from '@/assets/svg/success.svg';
import CalendarIcon from '@/assets/svg/calendar.svg';
import CheckMarkIcon from '@/assets/svg/check-mark.svg';
import ShieldIcon from '@/assets/svg/shield.svg';

interface StreakStatsProps {
  currentStreak: number;
  longestStreak: number;
  totalDaysPlayed: number;
  completedMonths: number;
  totalShieldsUsed: number;
}

const StreakStats: React.FC<StreakStatsProps> = ({
  currentStreak,
  longestStreak,
  totalDaysPlayed,
  completedMonths,
  totalShieldsUsed,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const { colors, typography } = theme;

  // Ensure longestStreak is at least as high as currentStreak
  const effectiveLongestStreak = Math.max(longestStreak, currentStreak);

  const stats = [
    {
      icon: 'lightning',
      label: t('streakTab.currentStreakLabel'),
      value: currentStreak,
      suffix: t('streakTab.days', { count: currentStreak }),
      color: '#FF9500',
    },
    {
      icon: 'success',
      label: t('streakTab.longestStreakLabel'),
      value: effectiveLongestStreak,
      suffix: t('streakTab.days', { count: effectiveLongestStreak }),
      color: '#FFD700',
    },
    {
      icon: 'calendar',
      label: t('streakTab.stats.totalDaysPlayed'),
      value: totalDaysPlayed,
      suffix: '',
      color: '#34A853',
    },
    {
      icon: 'checkmark',
      label: t('streakTab.stats.completedMonths'),
      value: completedMonths,
      suffix: '',
      color: '#7C4DFF',
    },
    {
      icon: 'shield',
      label: t('streakTab.stats.shieldsUsed'),
      value: totalShieldsUsed,
      suffix: '',
      color: '#4285F4',
    },
  ];

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? 'transparent' : '#FFC850',
        },
      ]}
      entering={FadeIn.duration(350).delay(200)}
    >
      {/* Header */}
      <View style={styles.header}>
        <Feather name="bar-chart-2" size={20} color="#95D6A4" />
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.lg }]}>
          {t('streakTab.stats.title', { defaultValue: 'Statistik' })}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => {
          // Determine which SVG icon to render
          let IconComponent;
          let iconSize = 48;

          switch (stat.icon) {
            case 'lightning':
              IconComponent = LightningIcon;
              iconSize = 48;
              break;
            case 'success':
              IconComponent = SuccessIcon;
              iconSize = 48;
              break;
            case 'calendar':
              IconComponent = CalendarIcon;
              iconSize = 48;
              break;
            case 'checkmark':
              IconComponent = CheckMarkIcon;
              iconSize = 40;
              break;
            case 'shield':
              IconComponent = ShieldIcon;
              iconSize = 48;
              break;
            default:
              IconComponent = null;
          }

          return (
            <Animated.View
              key={stat.label}
              style={[
                styles.statItem,
                {
                  borderColor: theme.isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                  // Remove border from last item
                  borderBottomWidth: index === stats.length - 1 ? 0 : 1,
                },
              ]}
              entering={FadeIn.duration(200).delay(300 + index * 50)}
            >
              <View style={styles.iconWrapper}>
                {IconComponent && (
                  <IconComponent width={iconSize} height={iconSize} fill={stat.color} />
                )}
              </View>

              <View style={styles.statContent}>
                <View style={styles.valueRow}>
                  <Text style={[styles.statValue, { color: colors.textPrimary, fontSize: typography.size.xl }]}>
                    {stat.value.toLocaleString('de-DE')}
                  </Text>
                  {stat.suffix && (
                    <Text style={[styles.statSuffix, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                      {stat.suffix}
                    </Text>
                  )}
                </View>
                <Text style={[styles.statLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
                  {stat.label}
                </Text>
              </View>
            </Animated.View>
          );
        })}
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Stats Grid
  statsGrid: {
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  iconWrapper: {
    width: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginBottom: 2,
  },
  statValue: {
    // fontSize set dynamically via theme.typography
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  statSuffix: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
  statLabel: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
});

export default StreakStats;
