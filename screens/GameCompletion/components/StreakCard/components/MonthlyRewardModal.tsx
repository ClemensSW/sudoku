// screens/Leistung/components/StreakTab/components/MonthlyRewardModal.tsx
import React, { useEffect } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, Dimensions } from 'react-native';
import Animated, {
  FadeIn,
  SlideInDown,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import * as Haptics from 'expo-haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface MonthlyRewardModalProps {
  visible: boolean;
  yearMonth: string; // Format: "2025-01"
  rewardType: 'bonus_shields' | 'ep_boost' | 'avatar_frame' | 'title_badge';
  rewardValue: any;
  onClaim: () => void;
  onClose: () => void;
}

const MonthlyRewardModal: React.FC<MonthlyRewardModalProps> = ({
  visible,
  yearMonth,
  rewardType,
  rewardValue,
  onClaim,
  onClose,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const badgeScale = useSharedValue(0);
  const badgeRotation = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  // Parse month name
  const getMonthName = (ym: string) => {
    const monthNames = [
      'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
      'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
    ];
    const [year, month] = ym.split('-').map(Number);
    return `${monthNames[month - 1]} ${year}`;
  };

  // Get reward info
  const getRewardInfo = () => {
    switch (rewardType) {
      case 'bonus_shields':
        return {
          icon: 'shield',
          color: '#4285F4',
          title: '+2 Bonus-Schutzschilder',
          description: 'Diese Schutzschilder bleiben dauerhaft verfügbar!',
        };
      case 'ep_boost':
        return {
          icon: 'zap',
          color: '#FF9500',
          title: `+${rewardValue} EP Boost`,
          description: 'Direkt auf dein Level-Konto gutgeschrieben!',
        };
      case 'avatar_frame':
        return {
          icon: 'award',
          color: '#FFD700',
          title: 'Exklusiver Avatar-Rahmen',
          description: 'Zeige allen deinen Erfolg!',
        };
      case 'title_badge':
        return {
          icon: 'star',
          color: '#7C4DFF',
          title: 'Spezielle Titel-Badge',
          description: `Streak Master ${getMonthName(yearMonth)}`,
        };
      default:
        return {
          icon: 'gift',
          color: colors.primary,
          title: 'Belohnung',
          description: 'Gratulation!',
        };
    }
  };

  const rewardInfo = getRewardInfo();

  // Trigger animations when visible
  useEffect(() => {
    if (visible) {
      // Badge entrance animation
      badgeScale.value = withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(1.5)) }),
        withTiming(1, { duration: 200 })
      );

      // Rotation animation
      badgeRotation.value = withSequence(
        withTiming(10, { duration: 200 }),
        withTiming(-10, { duration: 400 }),
        withTiming(0, { duration: 200 })
      );

      // Glow pulse
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1000 }),
          withTiming(0.3, { duration: 1000 })
        ),
        -1,
        true
      );

      // Success haptic
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      badgeScale.value = 0;
      glowOpacity.value = 0;
    }
  }, [visible]);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: badgeScale.value },
      { rotate: `${badgeRotation.value}deg` },
    ],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handleClaim = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onClaim();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <BlurView intensity={80} style={styles.blurContainer}>
        <Animated.View
          style={styles.overlay}
          entering={FadeIn.duration(300)}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

          <Animated.View
            style={styles.modalContainer}
            entering={SlideInDown.duration(400).springify()}
          >
            <LinearGradient
              colors={
                theme.isDark
                  ? ['rgba(30, 30, 30, 0.98)', 'rgba(20, 20, 20, 0.98)']
                  : ['rgba(255, 255, 255, 0.98)', 'rgba(245, 245, 245, 0.98)']
              }
              style={[
                styles.modalContent,
                {
                  shadowColor: rewardInfo.color,
                  borderColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                },
              ]}
            >
              {/* Close Button */}
              <Pressable
                onPress={onClose}
                style={styles.closeButton}
                hitSlop={10}
              >
                <Feather name="x" size={24} color={colors.textSecondary} />
              </Pressable>

              {/* Confetti Emoji */}
              <Text style={styles.confettiEmoji}>🎉</Text>

              {/* Title */}
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('streakTab.monthlyReward.title', { defaultValue: 'Gratulation!' })}
              </Text>

              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                {t('streakTab.monthlyReward.subtitle', {
                  month: getMonthName(yearMonth),
                  defaultValue: `Du hast den ${getMonthName(yearMonth)} vollständig abgeschlossen!`,
                })}
              </Text>

              {/* Animated Badge */}
              <View style={styles.badgeContainer}>
                <Animated.View
                  style={[
                    styles.badgeGlow,
                    glowAnimatedStyle,
                    { backgroundColor: `${rewardInfo.color}30` },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.badge,
                    badgeAnimatedStyle,
                    { backgroundColor: `${rewardInfo.color}20` },
                  ]}
                  entering={ZoomIn.duration(500).delay(200)}
                >
                  <Feather name={rewardInfo.icon as any} size={48} color={rewardInfo.color} />
                </Animated.View>
              </View>

              {/* Reward Info */}
              <View style={styles.rewardInfo}>
                <Text style={[styles.rewardTitle, { color: colors.textPrimary }]}>
                  {rewardInfo.title}
                </Text>
                <Text style={[styles.rewardDescription, { color: colors.textSecondary }]}>
                  {rewardInfo.description}
                </Text>
              </View>

              {/* Claim Button */}
              <Pressable
                onPress={handleClaim}
                style={({ pressed }) => [
                  styles.claimButton,
                  { backgroundColor: rewardInfo.color, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={styles.claimButtonText}>
                  {t('streakTab.monthlyReward.claim', { defaultValue: 'Belohnung einlösen' })}
                </Text>
                <Feather name="check" size={20} color="white" />
              </Pressable>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: Math.min(SCREEN_WIDTH - 48, 400),
    maxWidth: '90%',
  },
  modalContent: {
    borderRadius: radius.xxl,
    padding: spacing.xl,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 10,
    borderWidth: 1,
  },

  // Close Button
  closeButton: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    zIndex: 10,
  },

  // Confetti
  confettiEmoji: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },

  // Title
  title: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },

  // Badge
  badgeContainer: {
    position: 'relative',
    marginVertical: spacing.xl,
  },
  badgeGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    top: -40,
    left: -40,
  },
  badge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },

  // Reward Info
  rewardInfo: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    width: '100%',
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  rewardDescription: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Claim Button
  claimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.lg,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  claimButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
});

export default MonthlyRewardModal;
