// screens/Leistung/components/AchievementsTab/components/DifficultyBreakdown.tsx
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { getPathColor } from '@/utils/pathColors';
import { difficultyStyles as styles } from '../AchievementsTab.styles';

interface DifficultyBreakdownProps {
  easy: number;
  medium: number;
  hard: number;
  expert: number;
}

interface DifficultyData {
  key: string;
  label: string;
  count: number;
  color: string;
}

const DifficultyBreakdown: React.FC<DifficultyBreakdownProps> = ({
  easy,
  medium,
  hard,
  expert,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values for progress bars
  const easyWidth = useSharedValue(0);
  const mediumWidth = useSharedValue(0);
  const hardWidth = useSharedValue(0);
  const expertWidth = useSharedValue(0);

  // Calculate max for relative scaling
  const maxCount = Math.max(easy, medium, hard, expert, 1);

  // Difficulty data with path colors
  const difficulties: DifficultyData[] = [
    {
      key: 'easy',
      label: t('achievementsTab.difficulty.easy'),
      count: easy,
      color: getPathColor('blue', theme.isDark),
    },
    {
      key: 'medium',
      label: t('achievementsTab.difficulty.medium'),
      count: medium,
      color: getPathColor('green', theme.isDark),
    },
    {
      key: 'hard',
      label: t('achievementsTab.difficulty.hard'),
      count: hard,
      color: getPathColor('yellow', theme.isDark),
    },
    {
      key: 'expert',
      label: t('achievementsTab.difficulty.expert'),
      count: expert,
      color: getPathColor('purple', theme.isDark),
    },
  ];

  // Animate bars on mount
  useEffect(() => {
    const timing = {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    };

    easyWidth.value = withDelay(100, withTiming((easy / maxCount) * 100, timing));
    mediumWidth.value = withDelay(200, withTiming((medium / maxCount) * 100, timing));
    hardWidth.value = withDelay(300, withTiming((hard / maxCount) * 100, timing));
    expertWidth.value = withDelay(400, withTiming((expert / maxCount) * 100, timing));
  }, [easy, medium, hard, expert, maxCount]);

  const animatedStyles = {
    easy: useAnimatedStyle(() => ({ width: `${easyWidth.value}%` })),
    medium: useAnimatedStyle(() => ({ width: `${mediumWidth.value}%` })),
    hard: useAnimatedStyle(() => ({ width: `${hardWidth.value}%` })),
    expert: useAnimatedStyle(() => ({ width: `${expertWidth.value}%` })),
  };

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          elevation: theme.isDark ? 0 : 4,
        },
      ]}
      entering={FadeInDown.delay(200).duration(400)}
    >
      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('achievementsTab.difficulty.title')}
      </Text>

      {/* Difficulty Rows */}
      {difficulties.map((diff, index) => (
        <Animated.View
          key={diff.key}
          style={[
            styles.row,
            index === difficulties.length - 1 && styles.rowLast,
          ]}
          entering={FadeInDown.delay(300 + index * 80).duration(300)}
        >
          {/* Label */}
          <Text style={[styles.difficultyLabel, { color: colors.textPrimary }]}>
            {diff.label}
          </Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.progressFill,
                  { backgroundColor: diff.color },
                  animatedStyles[diff.key as keyof typeof animatedStyles],
                ]}
              />
            </View>
          </View>

          {/* Count */}
          <Text style={[styles.countText, { color: colors.textPrimary }]}>
            {diff.count}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

export default DifficultyBreakdown;
