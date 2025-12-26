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
  const colors = theme.colors;
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>
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
        </View>

        {/* Counter */}
        <View style={styles.counterSection}>
          <Text style={[styles.counterNumber, { color: hasNoShields ? colors.error : colors.textPrimary }]}>
            {totalShields}
          </Text>
          <Text style={[styles.counterLabel, { color: colors.textSecondary }]}>
            {t('streakTab.shields.availableLabel', { count: totalShields })}
          </Text>
        </View>
      </View>

      {/* Bonus Shields (if available) */}
      {bonusShields > 0 && (
        <View style={[styles.bonusCard, { backgroundColor: theme.isDark ? 'rgba(255,215,0,0.12)' : 'rgba(255,215,0,0.1)' }]}>
          <View style={styles.bonusHeader}>
            <View style={[styles.bonusIconCircle, { backgroundColor: 'rgba(255,215,0,0.2)' }]}>
              <Feather name="gift" size={18} color="#FFD700" />
            </View>
            <View style={styles.bonusTextContainer}>
              <Text style={[styles.bonusTitle, { color: colors.textPrimary }]}>
                Bonus-Schutzschilde
              </Text>
              <Text style={[styles.bonusValue, { color: '#FFD700' }]}>
                +{bonusShields} Extra
              </Text>
            </View>
          </View>
          <Text style={[styles.bonusDescription, { color: colors.textSecondary }]}>
            Diese Schutzschilde bleiben dauerhaft verfügbar!
          </Text>
        </View>
      )}

      {/* Info Section */}
      <View style={[styles.infoCard, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }]}>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>
            {t('streakTab.shields.nextResetLabel')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.textPrimary }]}>
            {t('streakTab.shields.nextResetValue', { count: daysUntilReset })}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Feather name="info" size={16} color={colors.textSecondary} />
          <Text style={[styles.infoDescription, { color: colors.textSecondary }]}>
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
                <Text style={[styles.premiumTitle, { color: theme.isDark ? '#D4AF37' : '#C19A2E' }]}>
                  {t(`supportShop:shieldBanner.${bannerKey}.title`)}
                </Text>
                <Text style={[styles.premiumSubtitle, { color: colors.textSecondary }]}>
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
    fontSize: 18,
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
  counterNumber: {
    fontSize: 48,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -1,
  },
  counterLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Bonus Card
  bonusCard: {
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: '#FFD700',
  },
  bonusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  bonusIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bonusTextContainer: {
    flex: 1,
  },
  bonusTitle: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  bonusValue: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  bonusDescription: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginLeft: 44,
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
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 13,
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
    fontSize: 12,
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
    fontSize: 15,
    fontWeight: '600',
  },
  premiumSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
});

export default ShieldIndicator;
