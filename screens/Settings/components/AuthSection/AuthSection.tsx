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
      {/* Corner Badge - Top Right */}
      <View style={styles.cornerBadge}>
        <DevelopmentBadge />
      </View>

      {/* Header - Centered Layout */}
      <View style={styles.header}>
        {/* Shield Icon - Large & Centered */}
        <View style={styles.iconContainer}>
          <ShieldIcon width={64} height={64} fill="#4A90E2" />
        </View>

        {/* Title - Centered */}
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t('authSection.title')}
        </Text>

        {/* Description */}
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    gap: spacing.lg,
    overflow: 'hidden', // Important for corner badge
    position: 'relative',
  },

  // Corner Badge - Top Right (Diagonal)
  cornerBadge: {
    position: 'absolute',
    top: 16,
    right: -8,
    transform: [{ rotate: '12deg' }],
    zIndex: 10,
  },

  // Header - Centered Vertical Layout
  header: {
    alignItems: 'center',
    gap: spacing.md,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
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
});

export default AuthSection;
