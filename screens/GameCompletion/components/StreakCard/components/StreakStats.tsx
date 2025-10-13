// screens/Leistung/components/StreakTab/components/StreakStats.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';

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
  const colors = theme.colors;

  const stats = [
    {
      icon: 'zap',
      label: t('streakTab.currentStreak'),
      value: currentStreak,
      suffix: t('streakTab.days'),
      color: '#FF9500',
    },
    {
      icon: 'award',
      label: t('streakTab.longestStreak'),
      value: longestStreak,
      suffix: t('streakTab.days'),
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
      icon: 'star',
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
        },
      ]}
      entering={FadeIn.duration(350).delay(200)}
    >
      {/* Header */}
      <View style={styles.header}>
        <Feather name="bar-chart-2" size={20} color={colors.primary} />
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('streakTab.stats.title', { defaultValue: 'Statistik' })}
        </Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <Animated.View
            key={stat.label}
            style={[
              styles.statItem,
              {
                borderColor: theme.isDark
                  ? 'rgba(255,255,255,0.08)'
                  : 'rgba(0,0,0,0.06)',
              },
            ]}
            entering={FadeIn.duration(200).delay(300 + index * 50)}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: `${stat.color}20`,
                },
              ]}
            >
              <Feather name={stat.icon as any} size={20} color={stat.color} />
            </View>

            <View style={styles.statContent}>
              <View style={styles.valueRow}>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {stat.value.toLocaleString('de-DE')}
                </Text>
                {stat.suffix && (
                  <Text style={[styles.statSuffix, { color: colors.textSecondary }]}>
                    {stat.suffix}
                  </Text>
                )}
              </View>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                {stat.label}
              </Text>
            </View>
          </Animated.View>
        ))}
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
    marginBottom: spacing.lg,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
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
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    fontSize: 22,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.3,
  },
  statSuffix: {
    fontSize: 14,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default StreakStats;
