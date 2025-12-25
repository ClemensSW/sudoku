// screens/Settings/components/AuthSection/AuthSection.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';

interface AuthSectionProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
}) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  const handleGetStarted = () => {
    triggerHaptic('light');
    onGetStarted();
  };

  const handleAlreadyHaveAccount = () => {
    triggerHaptic('light');
    onAlreadyHaveAccount();
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(100).duration(500)}
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          shadowColor: theme.isDark ? '#000' : '#000',
        },
      ]}
    >
      {/* Benefits Section */}
      <View style={styles.benefitsContainer}>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>☁️</Text>
          <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
            {t('authSection.benefits.sync')}
          </Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>📱</Text>
          <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
            {t('authSection.benefits.devices')}
          </Text>
        </View>
        <View style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>🏆</Text>
          <Text style={[styles.benefitText, { color: colors.textPrimary }]}>
            {t('authSection.benefits.leaderboards')}
          </Text>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        {/* Primary Button - Get Started */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            {
              backgroundColor: progressColor,
              shadowColor: progressColor,
            },
          ]}
          onPress={handleGetStarted}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {t('authSection.getStarted')}
          </Text>
        </TouchableOpacity>

        {/* Secondary Link - Already have account */}
        <TouchableOpacity
          style={styles.secondaryLink}
          onPress={handleAlreadyHaveAccount}
          activeOpacity={0.7}
        >
          <Text style={[styles.secondaryLinkText, { color: colors.textSecondary }]}>
            {t('authSection.alreadyHaveAccount')}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.xl,
  },

  // Benefits Section
  benefitsContainer: {
    gap: spacing.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  benefitIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },

  // CTA Section
  ctaContainer: {
    gap: spacing.md,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryLink: {
    paddingVertical: spacing.sm,
  },
  secondaryLinkText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthSection;
