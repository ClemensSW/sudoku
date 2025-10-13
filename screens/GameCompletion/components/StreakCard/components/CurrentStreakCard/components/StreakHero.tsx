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

  // Motivational message
  const getMotivationalText = () => {
    if (isRecord) return t('streakTab.motivation.record', { defaultValue: 'Neuer Rekord! 🏆' });
    if (currentStreak >= 30) return t('streakTab.motivation.legendary', { defaultValue: 'Legendär! 🌟' });
    if (currentStreak >= 14) return t('streakTab.motivation.twoWeeks', { defaultValue: '2 Wochen Streak! 💪' });
    if (currentStreak >= 7) return t('streakTab.motivation.oneWeek', { defaultValue: 'Eine Woche geschafft! 🔥' });
    if (currentStreak >= 3) return t('streakTab.motivation.keepGoing', { defaultValue: 'Weiter so! 👍' });
    if (currentStreak === 0) return t('streakTab.motivation.start', { defaultValue: 'Starte deinen Streak!' });
    return t('streakTab.motivation.goodStart', { defaultValue: 'Guter Start! 🎯' });
  };

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

      {/* Motivational Text */}
      <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
        {getMotivationalText()}
      </Text>

      {/* Record Badge */}
      {isRecord && (
        <Animated.View
          style={[styles.recordBadge, { backgroundColor: '#FFD700' }]}
          entering={FadeIn.duration(400).delay(200)}
        >
          <Feather name="award" size={14} color="white" />
          <Text style={styles.recordText}>Rekord!</Text>
        </Animated.View>
      )}

      {/* Longest Streak Info */}
      {!isRecord && longestStreak > 0 && (
        <View style={styles.recordInfo}>
          <Feather name="trending-up" size={14} color={colors.textSecondary} />
          <Text style={[styles.recordInfoText, { color: colors.textSecondary }]}>
            {t('streakTab.longestStreak', { defaultValue: 'Rekord' })}: {longestStreak}{' '}
            {longestStreak === 1 ? t('streakTab.day') : t('streakTab.days')}
          </Text>
        </View>
      )}
    </LinearGradient>
  );
};

export default StreakHero;
