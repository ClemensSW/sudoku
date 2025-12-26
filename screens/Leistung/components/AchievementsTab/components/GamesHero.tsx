// screens/Leistung/components/AchievementsTab/components/GamesHero.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { heroStyles as styles } from '../AchievementsTab.styles';
import StatsSection from './StatsSection';

import ZielIcon from '@/assets/svg/ziel.svg';

// Erfolge Container Color - Deep Wine (elegant, professional)
const ERFOLGE_COLOR = '#8B4F56';

interface GamesHeroProps {
  gamesPlayed: number;
  gamesWon: number;
  // Stats props (integrated like calendar in Serie)
  completedEasy: number;
  completedMedium: number;
  completedHard: number;
  completedExpert: number;
  bestTimeEasy: number;
  bestTimeMedium: number;
  bestTimeHard: number;
  bestTimeExpert: number;
}

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const GamesHero: React.FC<GamesHeroProps> = ({
  gamesPlayed,
  gamesWon,
  completedEasy,
  completedMedium,
  completedHard,
  completedExpert,
  bestTimeEasy,
  bestTimeMedium,
  bestTimeHard,
  bestTimeExpert,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const counterScale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  // Calculate win rate
  const winRate = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

  // Counter pop animation on mount
  useEffect(() => {
    counterScale.value = withSequence(
      withTiming(1.1, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    iconScale.value = withSequence(
      withTiming(1.15, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  }, [gamesPlayed]);

  const counterAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: counterScale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  // Get motivational message based on win rate
  const getMotivation = (): { emoji: string; text: string } => {
    if (gamesPlayed === 0) {
      return {
        emoji: t('achievementsTab.motivation.start.emoji'),
        text: t('achievementsTab.motivation.start.text'),
      };
    }
    if (winRate >= 90) {
      return {
        emoji: t('achievementsTab.motivation.masterful.emoji'),
        text: t('achievementsTab.motivation.masterful.text'),
      };
    }
    if (winRate >= 75) {
      return {
        emoji: t('achievementsTab.motivation.strong.emoji'),
        text: t('achievementsTab.motivation.strong.text'),
      };
    }
    if (winRate >= 60) {
      return {
        emoji: t('achievementsTab.motivation.good.emoji'),
        text: t('achievementsTab.motivation.good.text'),
      };
    }
    if (winRate >= 40) {
      return {
        emoji: t('achievementsTab.motivation.keepGoing.emoji'),
        text: t('achievementsTab.motivation.keepGoing.text'),
      };
    }
    if (winRate >= 20) {
      return {
        emoji: t('achievementsTab.motivation.improving.emoji'),
        text: t('achievementsTab.motivation.improving.text'),
      };
    }
    return {
      emoji: t('achievementsTab.motivation.practice.emoji'),
      text: t('achievementsTab.motivation.practice.text'),
    };
  };

  const motivation = getMotivation();

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 8,
          shadowColor: theme.isDark ? 'transparent' : ERFOLGE_COLOR,
        },
      ]}
      entering={FadeIn.duration(400)}
    >
      <LinearGradient
        colors={
          theme.isDark
            ? [hexToRGBA(ERFOLGE_COLOR, 0.15), hexToRGBA(ERFOLGE_COLOR, 0.08), hexToRGBA(ERFOLGE_COLOR, 0)]
            : [hexToRGBA(ERFOLGE_COLOR, 0.20), hexToRGBA(ERFOLGE_COLOR, 0.10), hexToRGBA(ERFOLGE_COLOR, 0)]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Icon with Glow */}
        <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
          <View
            style={[
              styles.iconGlow,
              {
                backgroundColor: theme.isDark
                  ? hexToRGBA(ERFOLGE_COLOR, 0.15)
                  : hexToRGBA(ERFOLGE_COLOR, 0.35),
              },
            ]}
          />
          <ZielIcon width={56} height={56} />
        </Animated.View>

        {/* Main Counter */}
        <Animated.View style={counterAnimatedStyle}>
          <Text style={[styles.mainNumber, { color: colors.textPrimary }]}>
            {gamesPlayed}
          </Text>
          <Text style={[styles.mainLabel, { color: colors.textSecondary }]}>
            {gamesPlayed === 1
              ? t('achievementsTab.hero.game')
              : t('achievementsTab.hero.games')}
          </Text>
        </Animated.View>

        {/* Separator */}
        <View
          style={[
            styles.separator,
            { backgroundColor: hexToRGBA(ERFOLGE_COLOR, 0.3) },
          ]}
        />

        {/* Secondary Stats */}
        <View style={styles.secondaryStats}>
          <Text style={[styles.secondaryText, { color: colors.textSecondary }]}>
            {gamesWon} {t('achievementsTab.hero.won')}
          </Text>
          <Text style={[styles.dotSeparator, { color: colors.textSecondary }]}>
            ·
          </Text>
          <Text style={[styles.winRateText, { color: ERFOLGE_COLOR }]}>
            {winRate}%
          </Text>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationContainer}>
          <Text style={styles.motivationEmoji}>{motivation.emoji}</Text>
          <Text style={[styles.motivationText, { color: colors.textSecondary }]}>
            {motivation.text}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats Section (integrated like calendar in Serie) */}
      <StatsSection
        easy={completedEasy}
        medium={completedMedium}
        hard={completedHard}
        expert={completedExpert}
        bestTimeEasy={bestTimeEasy}
        bestTimeMedium={bestTimeMedium}
        bestTimeHard={bestTimeHard}
        bestTimeExpert={bestTimeExpert}
      />
    </Animated.View>
  );
};

export default GamesHero;
