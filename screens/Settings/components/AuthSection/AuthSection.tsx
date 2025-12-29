// screens/Settings/components/AuthSection/AuthSection.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';

interface AuthSectionProps {
  onGetStarted: () => void;
  onAlreadyHaveAccount: () => void;
}

// Benefit configuration with colors
const BENEFITS = [
  { key: 'sync', icon: '☁️', glowColor: '#4285F4' },      // Blue
  { key: 'devices', icon: '📱', glowColor: '#34A853' },   // Green
  { key: 'leaderboards', icon: '🏆', glowColor: '#FFD700', comingSoon: true }, // Gold
];

const AuthSection: React.FC<AuthSectionProps> = ({
  onGetStarted,
  onAlreadyHaveAccount,
}) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const { colors, typography } = theme;
  const progressColor = useProgressColor();

  // Shimmer animation
  const shimmerPosition = useSharedValue(-1);

  useEffect(() => {
    shimmerPosition.value = withRepeat(
      withTiming(2, { duration: 2500, easing: Easing.linear }),
      -1,
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerPosition.value * 150 }],
  }));

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
      style={styles.outerContainer}
    >
      {/* Gradient Border */}
      <LinearGradient
        colors={[
          progressColor,
          `${progressColor}60`,
          `${progressColor}20`,
          'transparent',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              shadowColor: progressColor,
            },
          ]}
        >
          {/* Decorative Glow Orb */}
          <View
            style={[
              styles.glowOrb,
              { backgroundColor: progressColor },
            ]}
          />

          {/* Benefits Section */}
          <View style={styles.benefitsContainer}>
            {BENEFITS.map((benefit, index) => (
              <Animated.View
                key={benefit.key}
                entering={FadeInDown.delay(200 + index * 100).duration(400)}
                style={styles.benefitRow}
              >
                {/* Icon with Glow Background */}
                <View
                  style={[
                    styles.iconGlow,
                    { backgroundColor: `${benefit.glowColor}20` },
                  ]}
                >
                  <Text style={[styles.benefitIcon, { fontSize: typography.size.xl }]}>{benefit.icon}</Text>
                </View>

                {/* Benefit Text */}
                <Text style={[styles.benefitText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                  {t(`authSection.benefits.${benefit.key}`)}
                </Text>

                {/* Coming Soon Badge */}
                {benefit.comingSoon && (
                  <View
                    style={[
                      styles.comingSoonBadge,
                      {
                        backgroundColor: `${colors.warning}15`,
                        borderColor: `${colors.warning}40`,
                      },
                    ]}
                  >
                    <Text style={[styles.comingSoonText, { color: colors.warning, fontSize: typography.size.xs }]}>
                      {t('authSection.comingSoon')}
                    </Text>
                  </View>
                )}
              </Animated.View>
            ))}
          </View>

          {/* CTA Section */}
          <View style={styles.ctaContainer}>
            {/* Primary Button with Shimmer */}
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
              <Text style={[styles.primaryButtonText, { fontSize: typography.size.md }]}>
                {t('authSection.getStarted')}
              </Text>

              {/* Shimmer Effect */}
              <Animated.View style={[styles.shimmerContainer, shimmerStyle]}>
                <LinearGradient
                  colors={[
                    'transparent',
                    'rgba(255, 255, 255, 0.35)',
                    'transparent',
                  ]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.shimmerGradient}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Secondary Link */}
            <TouchableOpacity
              style={styles.secondaryLink}
              onPress={handleAlreadyHaveAccount}
              activeOpacity={0.7}
            >
              <Text style={[styles.secondaryLinkText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                {t('authSection.alreadyHaveAccount')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: spacing.xxl,
  },

  gradientBorder: {
    borderRadius: radius.xl + 1.5,
    padding: 1.5,
  },

  container: {
    borderRadius: radius.xl,
    padding: spacing.xl,
    gap: spacing.xl,
    overflow: 'hidden',
    // Enhanced shadow
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },

  // Decorative Glow Orb
  glowOrb: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
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

  iconGlow: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  benefitIcon: {
    // fontSize set dynamically via theme.typography
  },

  benefitText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
    flex: 1,
  },

  // Coming Soon Badge
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },

  comingSoonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
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
    overflow: 'hidden',
    // Enhanced shadow
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  primaryButtonText: {
    color: '#FFFFFF',
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  // Shimmer Effect
  shimmerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  shimmerGradient: {
    width: 80,
    height: '100%',
  },

  secondaryLink: {
    paddingVertical: spacing.sm,
  },

  secondaryLinkText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
  },
});

export default AuthSection;
