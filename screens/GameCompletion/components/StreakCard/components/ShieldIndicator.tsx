// screens/GameCompletion/components/StreakCard/components/ShieldIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useRouter } from 'expo-router';
import { spacing, radius } from '@/utils/theme';
import ShieldIcon from '@/assets/svg/shield.svg';
import ShieldEmptyIcon from '@/assets/svg/shieldEmpty.svg';
import GiftIcon from '@/assets/svg/gift.svg';

interface ShieldIndicatorProps {
  available: number; // Verfügbare reguläre Schutzschilde
  maxRegular: number; // Maximum reguläre Schutzschilde (2 oder 3)
  bonusShields: number; // Bonus-Schutzschilde
  nextResetDate: Date; // Nächster Reset-Termin
  onOpenSupportShop?: () => void; // Callback um Support Shop zu öffnen
  supporterStatus?: 'none' | 'one-time' | 'subscription'; // Supporter Status für dynamischen Premium-Banner
}

const ShieldIndicator: React.FC<ShieldIndicatorProps> = ({
  available,
  maxRegular,
  bonusShields,
  nextResetDate,
  onOpenSupportShop,
  supporterStatus = 'none',
}) => {
  const { t } = useTranslation(['leistung', 'supportShop']);
  const theme = useTheme();
  const { colors, typography } = theme;
  const router = useRouter();

  // Calculate days until reset
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const resetDate = new Date(nextResetDate);
  resetDate.setHours(0, 0, 0, 0);

  let daysUntilReset = Math.ceil(
    (resetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Wenn heute Montag ist und daysUntilReset = 0, dann zeige den nächsten Montag (in 7 Tagen)
  // Wenn daysUntilReset negativ ist (Reset-Datum liegt in der Vergangenheit), zeige auch 7 Tage
  if (daysUntilReset <= 0) {
    daysUntilReset = 7;
  }

  const totalShields = available + bonusShields;
  const hasNoShields = totalShields === 0;
  // Show "+" indicator when total shields exceed maxRegular (indicates bonus shields beyond regular capacity)
  const showPlusIndicator = totalShields > maxRegular;

  const handlePremiumPress = () => {
    if (onOpenSupportShop) {
      onOpenSupportShop();
    } else {
      // Fallback: Try to navigate to settings
      router.push('/settings');
    }
  };

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
        <View style={styles.titleRow}>
          <Feather name="shield" size={20} color="#95D6A4" />
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.lg }]}>
            {t('streakTab.shields.title', { defaultValue: 'Schutzschilde' })}
          </Text>
        </View>
      </View>

      {/* Hero Section: Large Shield Display */}
      <View style={styles.heroSection}>
        {/* Shield Icons mit SVG - Dynamisch 2 oder 3 Schilde anzeigen */}
        <View style={styles.shieldsGrid}>
          {Array.from({ length: maxRegular }).map((_, index) => {
            const isFilled = index < available;
            return (
              <View
                key={`shield-${index}`}
                style={[
                  styles.shieldIconWrapper,
                  { opacity: isFilled ? 1 : (theme.isDark ? 0.4 : 0.3) }
                ]}
              >
                {isFilled ? (
                  <ShieldIcon
                    width={56}
                    height={56}
                    fill="#74DA7F"
                  />
                ) : (
                  <ShieldEmptyIcon
                    width={56}
                    height={56}
                    fill={theme.isDark ? '#666' : '#CCC'}
                  />
                )}
              </View>
            );
          })}

          {/* Bonus indicator after shield icons */}
          {bonusShields > 0 && (
            <View style={styles.bonusIconIndicator}>
              <Text style={[styles.bonusPlusIcon, { color: '#D4AF37' }]}>+{bonusShields}</Text>
            </View>
          )}
        </View>

        {/* Counter */}
        <View style={styles.counterSection}>
          <View style={styles.counterRow}>
            <Text style={[styles.counterNumber, { color: hasNoShields ? colors.error : colors.textPrimary, fontSize: typography.size.huge }]}>
              {totalShields}
            </Text>
            {showPlusIndicator && (
              <Text style={[styles.plusIndicator, { color: '#D4AF37', fontSize: typography.size.lg }]}>+</Text>
            )}
          </View>
          <Text style={[styles.counterLabel, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
            {t('streakTab.shields.availableLabel', { count: totalShields })}
          </Text>
        </View>
      </View>

      {/* Bonus Shields Card - Same design as Premium Banner (without chevron) */}
      {bonusShields > 0 && (
        <View
          style={[
            styles.bonusCard,
            {
              backgroundColor: theme.isDark
                ? 'rgba(212, 175, 55, 0.12)'
                : 'rgba(212, 175, 55, 0.15)',
              borderColor: theme.isDark
                ? 'rgba(212, 175, 55, 0.3)'
                : 'rgba(193, 154, 46, 0.35)',
            },
          ]}
        >
          {/* Gift Icon */}
          <View style={{ marginRight: 12 }}>
            <GiftIcon width={36} height={36} />
          </View>

          {/* Text content */}
          <View style={styles.bonusTextContainer}>
            <Text style={[styles.bonusTitle, { color: theme.isDark ? '#D4AF37' : '#C19A2E', fontSize: typography.size.sm }]}>
              {bonusShields} Bonus-Schutzschild{bonusShields > 1 ? 'e' : ''}
            </Text>
            <Text style={[styles.bonusDescription, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
              Werden als Reserve verwendet
            </Text>
          </View>
        </View>
      )}

      {/* Info Section */}
      <View style={[styles.infoCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            {t('streakTab.shields.nextResetLabel')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary, fontSize: typography.size.xs }]}>
            {t('streakTab.shields.nextResetValue', { count: daysUntilReset })}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="info" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoDescription, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            {t('streakTab.shields.description', { defaultValue: 'Schützt deine Serie automatisch, wenn du einen Tag verpasst' })}
          </Text>
        </View>
      </View>

      {/* Premium Upsell - NUR wenn keine Schilde verfügbar */}
      {hasNoShields && (() => {
        // Determine which banner to show based on supporter status
        let bannerKey: 'noSupporter' | 'oneTimeSupporter' | 'premiumSubscriber' = 'noSupporter';

        if (supporterStatus === 'subscription') {
          bannerKey = 'premiumSubscriber';
        } else if (supporterStatus === 'one-time') {
          bannerKey = 'oneTimeSupporter';
        }

        return (
          <Pressable onPress={handlePremiumPress}>
            <View
              style={[
                styles.premiumCard,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(212, 175, 55, 0.12)'
                    : 'rgba(212, 175, 55, 0.15)',
                  borderColor: theme.isDark
                    ? 'rgba(212, 175, 55, 0.3)'
                    : 'rgba(193, 154, 46, 0.35)',
                },
              ]}
            >
              {/* Gift Icon */}
              <View style={{ marginRight: 12 }}>
                <GiftIcon width={36} height={36} />
              </View>

              {/* Text content */}
              <View style={styles.premiumTextContainer}>
                <Text style={[styles.premiumTitle, { color: theme.isDark ? '#D4AF37' : '#C19A2E', fontSize: typography.size.sm }]}>
                  {t(`supportShop:shieldBanner.${bannerKey}.title`)}
                </Text>
                <Text style={[styles.premiumSubtitle, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
                  {t(`supportShop:shieldBanner.${bannerKey}.subtitle`)}
                </Text>
              </View>

              {/* Chevron */}
              <Feather name="chevron-right" size={20} color={theme.isDark ? '#D4AF37' : '#C19A2E'} />
            </View>
          </Pressable>
        );
      })()}
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
    marginBottom: spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Hero Section
  heroSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  shieldsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  shieldIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Counter
  counterSection: {
    alignItems: 'center',
    gap: 4,
  },
  counterRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  counterNumber: {
    // fontSize set dynamically via theme.typography
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  plusIndicator: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    marginLeft: 2,
    marginTop: 4,
  },
  counterLabel: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Bonus Icon Indicator (after shield icons)
  bonusIconIndicator: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.xs,
  },
  bonusPlusIcon: {
    fontSize: 24,
    fontWeight: '800',
  },

  // Bonus Card (same layout as Premium Card, without chevron)
  bonusCard: {
    marginBottom: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bonusTextContainer: {
    flex: 1,
  },
  bonusTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
  bonusDescription: {
    // fontSize set dynamically via theme.typography
    marginTop: 2,
  },

  // Info Card
  infoCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoLabel: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
  infoValue: {
    // fontSize set dynamically via theme.typography
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.15)',
    marginVertical: spacing.xs,
  },
  infoDescription: {
    flex: 1,
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
    lineHeight: 18,
  },

  // Premium Upsell Card (Gallery-style elegant design)
  premiumCard: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumTextContainer: {
    flex: 1,
  },
  premiumTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
  premiumSubtitle: {
    // fontSize set dynamically via theme.typography
    marginTop: 2,
  },
});

export default ShieldIndicator;
