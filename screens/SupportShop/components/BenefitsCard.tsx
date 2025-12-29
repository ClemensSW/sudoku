// screens/SupportShop/components/BenefitsCard.tsx
/**
 * BenefitsCard - Kompakte Darstellung der Supporter-Vorteile
 *
 * Zeigt die Benefits in max 3 Zeilen:
 * - Titel
 * - 2x EP + 1 Bild/Monat (Icons + Text)
 *
 * Design: Minimalistisch, nicht überladen
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import Animated, { FadeIn } from 'react-native-reanimated';

const BenefitsCard: React.FC = () => {
  const { t } = useTranslation('supportShop');
  const theme = useTheme();
  const { colors, typography } = theme;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark
            ? 'rgba(255, 255, 255, 0.05)'
            : 'rgba(0, 0, 0, 0.03)',
          borderColor: theme.isDark
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.08)',
        },
      ]}
      entering={FadeIn.duration(400).delay(100)}
    >
      {/* Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.md }]}>
          🎁 {t('benefits.title', 'Unterstütze mich und erhalte:')}
        </Text>
      </View>

      {/* Benefits Row */}
      <View style={styles.benefitsRow}>
        {/* 2x EP Benefit */}
        <View style={styles.benefit}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(138, 180, 248, 0.15)'
                  : 'rgba(66, 133, 244, 0.1)',
              },
            ]}
          >
            <Feather name="zap" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.benefitText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
            {t('benefits.doubleEp', '2× EP')}
          </Text>
        </View>

        {/* Separator */}
        <Text style={[styles.separator, { color: colors.textSecondary, fontSize: typography.size.md }]}>
          |
        </Text>

        {/* Image Unlock Benefit */}
        <View style={styles.benefit}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(138, 180, 248, 0.15)'
                  : 'rgba(66, 133, 244, 0.1)',
              },
            ]}
          >
            <Feather name="image" size={16} color={colors.primary} />
          </View>
          <Text style={[styles.benefitText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
            {t('benefits.imagePerMonth', '1 Bild/Monat')}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  titleRow: {
    marginBottom: 12,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
  },
  separator: {
    // fontSize set dynamically via theme.typography
    marginHorizontal: 12,
    opacity: 0.3,
  },
});

export default BenefitsCard;
