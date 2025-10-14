// screens/Settings/components/AuthSection/AuthSection.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import DevelopmentBadge from './DevelopmentBadge';
import AuthButton from './AuthButton';
import ShieldIcon from '@/assets/svg/shield.svg';

interface AuthSectionProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
}

const AuthSection: React.FC<AuthSectionProps> = ({
  onGooglePress,
  onApplePress,
}) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const colors = theme.colors;

  const showGoogleButton = Platform.OS === 'android';
  const showAppleButton = Platform.OS === 'ios';

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ShieldIcon width={48} height={48} fill="#4A90E2" />
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t('authSection.title')}
            </Text>
            <DevelopmentBadge />
          </View>
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t('authSection.description')}
        </Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {showGoogleButton && (
          <AuthButton
            provider="google"
            label={t('authSection.googleSignIn')}
            onPress={onGooglePress || (() => {})}
            disabled={true} // Disabled während Entwicklung
          />
        )}

        {showAppleButton && (
          <AuthButton
            provider="apple"
            label={t('authSection.appleSignIn')}
            onPress={onApplePress || (() => {})}
            disabled={true} // Disabled während Entwicklung
          />
        )}

        {/* Fallback für Web/andere Plattformen */}
        {!showGoogleButton && !showAppleButton && (
          <View style={styles.infoBox}>
            <Feather name="info" size={16} color={colors.textSecondary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {t('authSection.platformNote')}
            </Text>
          </View>
        )}
      </View>

      {/* Optional: Benefits Section */}
      <View style={styles.benefitsSection}>
        <Text style={[styles.benefitsTitle, { color: colors.textSecondary }]}>
          {t('authSection.benefitsTitle')}
        </Text>
        <View style={styles.benefitsList}>
          {['benefit1', 'benefit2', 'benefit3'].map((key, index) => (
            <View key={key} style={styles.benefitItem}>
              <Feather name="check" size={16} color="#4CAF50" />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                {t(`authSection.${key}`)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.lg,
  },

  // Header
  header: {
    gap: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  titleContainer: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },

  // Buttons
  buttonsContainer: {
    gap: spacing.sm,
  },

  // Info Box (Fallback)
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    backgroundColor: 'rgba(66, 133, 244, 0.08)',
    borderRadius: radius.md,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  // Benefits
  benefitsSection: {
    gap: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.15)',
  },
  benefitsTitle: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  benefitsList: {
    gap: spacing.xs,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  benefitText: {
    fontSize: 13,
    lineHeight: 18,
  },
});

export default AuthSection;
