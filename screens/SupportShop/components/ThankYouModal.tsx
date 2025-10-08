// screens/SupportShop/components/ThankYouModal.tsx
/**
 * ThankYouModal - Post-Purchase Danke-Screen
 *
 * Zeigt nach erfolgreichem Kauf:
 * - Confetti-Animation (optional)
 * - Persönliche Dankes-Nachricht
 * - CTA: "Galerie erkunden" oder "Schließen"
 *
 * Design: Kurz, persönlich, dankbar - nicht überladen
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface ThankYouModalProps {
  visible: boolean;
  onClose: () => void;
  onExploreGallery?: () => void;
  title?: string;
  message?: string;
  isSupporter?: boolean; // Zeige "Galerie erkunden" nur für Supporter
}

const ThankYouModal: React.FC<ThankYouModalProps> = ({
  visible,
  onClose,
  onExploreGallery,
  title,
  message,
  isSupporter = true,
}) => {
  const { t } = useTranslation('supportShop');
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const checkScale = useSharedValue(0);
  const checkRotate = useSharedValue(-0.2);

  // Default texts
  const displayTitle = title || t('thankYou.title', 'Vielen Dank!');
  const displayMessage =
    message ||
    t(
      'thankYou.message',
      'Deine Unterstützung bedeutet mir sehr viel!'
    );

  // Trigger animations on mount
  useEffect(() => {
    if (visible) {
      // Happy success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Checkmark animation
      checkScale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withSpring(1, { damping: 10, stiffness: 100 })
      );

      checkRotate.value = withSequence(
        withTiming(-0.2, { duration: 0 }),
        withSpring(0, { damping: 12, stiffness: 120 })
      );
    }
  }, [visible]);

  const checkAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: checkScale.value },
      { rotate: `${checkRotate.value}rad` },
    ],
  }));

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={styles.overlay}
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
      >
        {/* Blur Backdrop */}
        <BlurView
          intensity={40}
          tint={theme.isDark ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />

        {/* Modal Content */}
        <Animated.View
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.isDark ? colors.card : '#FFFFFF',
              borderColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(0, 0, 0, 0.05)',
            },
          ]}
          entering={ZoomIn.duration(300).delay(100)}
        >
          {/* Success Icon */}
          <Animated.View style={[styles.iconContainer, checkAnimatedStyle]}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(52, 199, 89, 0.15)'
                    : 'rgba(52, 199, 89, 0.1)',
                },
              ]}
            >
              <Feather name="check-circle" size={60} color="#34C759" />
            </View>
          </Animated.View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {displayTitle}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {displayMessage}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            {/* Primary CTA: Explore Gallery (nur für Supporter) */}
            {isSupporter && onExploreGallery && (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onExploreGallery();
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>
                  {t('thankYou.exploreGallery', 'Galerie erkunden')}
                </Text>
                <Feather name="arrow-right" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            )}

            {/* Secondary: Close */}
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
                },
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.secondaryButtonText, { color: colors.textPrimary }]}
              >
                {t('thankYou.close', 'Schließen')}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: Math.min(SCREEN_WIDTH - 40, 400),
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    // Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default ThankYouModal;
