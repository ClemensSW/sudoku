// components/StreakHero.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import LightningIcon from '@/assets/svg/lightning.svg';
import { styles } from '../CurrentStreakCard.styles';

interface StreakHeroProps {
  currentStreak: number;
  longestStreak: number;
}

const StreakHero: React.FC<StreakHeroProps> = ({ currentStreak, longestStreak }) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const flameScale = useSharedValue(1);
  const flameOpacity = useSharedValue(0.8);
  const counterScale = useSharedValue(1);

  const isRecord = currentStreak === longestStreak && longestStreak > 2;

  // Flame animation
  useEffect(() => {
    if (currentStreak > 0) {
      flameScale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );

      flameOpacity.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.6, { duration: 1000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    }
  }, [currentStreak]);

  // Counter pop animation
  useEffect(() => {
    counterScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, [currentStreak]);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
    opacity: flameOpacity.value,
  }));

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  // Get motivational message with emoji separated
  const getMotivation = (): { emoji: string; text: string } => {
    // 🎖️ Check for milestone achievements first (priority)
    if (currentStreak >= 365) {
      return {
        emoji: t('streakTab.motivation.milestones.year.emoji'),
        text: t('streakTab.motivation.milestones.year.text')
      };
    }
    if (currentStreak === 100) {
      return {
        emoji: t('streakTab.motivation.milestones.hundred.emoji'),
        text: t('streakTab.motivation.milestones.hundred.text')
      };
    }
    if (currentStreak === 50) {
      return {
        emoji: t('streakTab.motivation.milestones.fifty.emoji'),
        text: t('streakTab.motivation.milestones.fifty.text')
      };
    }
    if (currentStreak === 21) {
      return {
        emoji: t('streakTab.motivation.milestones.threeWeeks.emoji'),
        text: t('streakTab.motivation.milestones.threeWeeks.text')
      };
    }

    // Regular milestone ranges
    if (currentStreak >= 30) {
      return {
        emoji: t('streakTab.motivation.milestones.legendary.emoji'),
        text: t('streakTab.motivation.milestones.legendary.text')
      };
    }
    if (currentStreak >= 14) {
      return {
        emoji: t('streakTab.motivation.milestones.twoWeeks.emoji'),
        text: t('streakTab.motivation.milestones.twoWeeks.text')
      };
    }
    if (currentStreak >= 7) {
      return {
        emoji: t('streakTab.motivation.milestones.oneWeek.emoji'),
        text: t('streakTab.motivation.milestones.oneWeek.text')
      };
    }
    if (currentStreak >= 3) {
      return {
        emoji: t('streakTab.motivation.milestones.keepGoing.emoji'),
        text: t('streakTab.motivation.milestones.keepGoing.text')
      };
    }
    if (currentStreak === 0) {
      return {
        emoji: t('streakTab.motivation.milestones.start.emoji'),
        text: t('streakTab.motivation.milestones.start.text')
      };
    }

    // 🔄 Rotating record messages for non-milestone records
    if (isRecord) {
      const rotationIndex = currentStreak % 5;
      return {
        emoji: t(`streakTab.motivation.recordRotation.${rotationIndex}.emoji`),
        text: t(`streakTab.motivation.recordRotation.${rotationIndex}.text`)
      };
    }

    // Default for 1-2 days
    return {
      emoji: t('streakTab.motivation.milestones.goodStart.emoji'),
      text: t('streakTab.motivation.milestones.goodStart.text')
    };
  };

  const motivation = getMotivation();

  return (
    <LinearGradient
      colors={
        theme.isDark
          ? ['rgba(255, 231, 133, 0.15)', 'rgba(255, 214, 102, 0.08)', 'rgba(255, 214, 102, 0)']
          : ['rgba(255, 220, 100, 0.20)', 'rgba(255, 200, 80, 0.10)', 'rgba(255, 200, 80, 0)']
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.heroHeader}
    >
      {/* Lightning Icon */}
      <Animated.View style={[styles.flameContainer, flameAnimatedStyle]}>
        <View
          style={[
            styles.flameGlow,
            {
              backgroundColor: currentStreak > 0
                ? (theme.isDark ? 'rgba(255, 231, 133, 0.15)' : 'rgba(255, 200, 80, 0.35)')
                : 'transparent',
            },
          ]}
        />
        {currentStreak > 0 ? (
          <LightningIcon width={56} height={56} />
        ) : (
          <Feather name="zap" size={56} color={colors.textSecondary} />
        )}
      </Animated.View>

      {/* Streak Counter */}
      <Animated.View style={counterAnimatedStyle}>
        <Text style={[styles.streakNumber, { color: colors.textPrimary }]}>
          {currentStreak}
        </Text>
        <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
          {currentStreak === 1
            ? t('streakTab.day', { defaultValue: 'Tag' })
            : t('streakTab.days', { defaultValue: 'Tage' })}
        </Text>
      </Animated.View>

      {/* Motivational Message - Emoji Centered Above, Text Below */}
      <View style={styles.motivationContainer}>
        <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
        <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
          {motivation.text}
        </Text>
      </View>
    </LinearGradient>
  );
};

export default StreakHero;
