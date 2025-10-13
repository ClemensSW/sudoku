// screens/Leistung/components/StreakTab/components/ShieldIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';

interface ShieldIndicatorProps {
  available: number; // Verfügbare reguläre Schutzschilder
  maxRegular: number; // Maximum reguläre Schutzschilder (2 oder 3)
  bonusShields: number; // Bonus-Schutzschilder
  nextResetDate: Date; // Nächster Reset-Termin
}

const ShieldIndicator: React.FC<ShieldIndicatorProps> = ({
  available,
  maxRegular,
  bonusShields,
  nextResetDate,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  // Calculate days until reset
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextResetDate.setHours(0, 0, 0, 0);
  const daysUntilReset = Math.ceil(
    (nextResetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalShields = available + bonusShields;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
        },
      ]}
      entering={FadeIn.duration(350).delay(100)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="shield" size={20} color="#4285F4" />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t('streakTab.shields.title')}
          </Text>
        </View>
      </View>

      {/* Shield Circles */}
      <View style={styles.shieldsRow}>
        <View style={styles.shieldsDisplay}>
          {Array.from({ length: maxRegular }).map((_, index) => {
            const isFilled = index < available;
            return (
              <View
                key={`regular-${index}`}
                style={[
                  styles.shieldCircle,
                  {
                    backgroundColor: isFilled
                      ? '#4285F4'
                      : theme.isDark
                      ? 'rgba(255,255,255,0.1)'
                      : 'rgba(0,0,0,0.06)',
                    borderColor: isFilled ? '#4285F4' : 'transparent',
                  },
                ]}
              >
                {isFilled && <Feather name="shield" size={16} color="white" />}
              </View>
            );
          })}
        </View>

        <Text style={[styles.countText, { color: colors.textPrimary }]}>
          {available}/{maxRegular}
        </Text>
      </View>

      {/* Bonus Shields (if available) */}
      {bonusShields > 0 && (
        <View style={[styles.bonusSection, { backgroundColor: theme.isDark ? 'rgba(255,215,0,0.1)' : 'rgba(255,215,0,0.08)' }]}>
          <Feather name="gift" size={16} color="#FFD700" />
          <Text style={[styles.bonusText, { color: colors.textPrimary }]}>
            {t('streakTab.shields.bonusShields')}: <Text style={styles.bonusNumber}>+{bonusShields}</Text>
          </Text>
        </View>
      )}

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Feather name="clock" size={14} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('streakTab.shields.nextReset')}: {daysUntilReset === 0 ? 'Heute' : `in ${daysUntilReset} ${daysUntilReset === 1 ? 'Tag' : 'Tagen'}`}
          </Text>
        </View>

        <View style={[styles.descriptionBox, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
          <Feather name="info" size={14} color={colors.textSecondary} style={{ marginTop: 2 }} />
          <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
            {t('streakTab.shields.description')}
          </Text>
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    marginBottom: spacing.lg,
  },

  // Header
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Shields Display
  shieldsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  shieldsDisplay: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  shieldCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  countText: {
    fontSize: 20,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },

  // Bonus Section
  bonusSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    marginBottom: spacing.md,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  bonusNumber: {
    fontWeight: '800',
    color: '#FFD700',
  },

  // Info Section
  infoSection: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoText: {
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  descriptionText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 18,
  },
});

export default ShieldIndicator;
