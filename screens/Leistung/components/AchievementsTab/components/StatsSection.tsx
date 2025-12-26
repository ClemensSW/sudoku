// screens/Leistung/components/AchievementsTab/components/StatsSection.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { statsSectionStyles as styles } from '../AchievementsTab.styles';

// Erfolge Container Color - Deep Wine (matches GamesHero)
const ERFOLGE_COLOR = '#8B4F56';

interface StatsSectionProps {
  // Games stats
  easy: number;
  medium: number;
  hard: number;
  expert: number;
  // Times stats
  bestTimeEasy: number;
  bestTimeMedium: number;
  bestTimeHard: number;
  bestTimeExpert: number;
}

// Helper to format time (mm:ss)
const formatTime = (seconds: number): string => {
  if (seconds === Infinity || seconds === 0) return '--:--';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
    .toString()
    .padStart(2, '0')}`;
};

const StatsSection: React.FC<StatsSectionProps> = ({
  easy,
  medium,
  hard,
  expert,
  bestTimeEasy,
  bestTimeMedium,
  bestTimeHard,
  bestTimeExpert,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;

  const [activeTab, setActiveTab] = useState<'games' | 'times'>('games');

  // Animation values for progress bars
  const bar1Width = useSharedValue(0);
  const bar2Width = useSharedValue(0);
  const bar3Width = useSharedValue(0);
  const bar4Width = useSharedValue(0);

  // Calculate max for relative scaling (games)
  const maxGames = Math.max(easy, medium, hard, expert, 1);

  // Calculate max for relative scaling (times)
  const validTimes = [
    bestTimeEasy > 0 && bestTimeEasy !== Infinity ? bestTimeEasy : 0,
    bestTimeMedium > 0 && bestTimeMedium !== Infinity ? bestTimeMedium : 0,
    bestTimeHard > 0 && bestTimeHard !== Infinity ? bestTimeHard : 0,
    bestTimeExpert > 0 && bestTimeExpert !== Infinity ? bestTimeExpert : 0,
  ].filter((time) => time > 0);
  const maxTime = validTimes.length > 0 ? Math.max(...validTimes) : 900;

  // Get bar percentage for times
  const getTimeBarPercentage = (time: number): number => {
    if (time <= 0 || time === Infinity) return 0;
    return time / maxTime;
  };

  // Difficulties data
  const difficulties = [
    { key: 'easy', label: t('achievementsTab.difficulty.easy') },
    { key: 'medium', label: t('achievementsTab.difficulty.medium') },
    { key: 'hard', label: t('achievementsTab.difficulty.hard') },
    { key: 'expert', label: t('achievementsTab.difficulty.expert') },
  ];

  // Animate bars when tab changes or data changes
  useEffect(() => {
    const timing = {
      duration: 600,
      easing: Easing.out(Easing.cubic),
    };

    if (activeTab === 'games') {
      bar1Width.value = withDelay(100, withTiming((easy / maxGames) * 100, timing));
      bar2Width.value = withDelay(150, withTiming((medium / maxGames) * 100, timing));
      bar3Width.value = withDelay(200, withTiming((hard / maxGames) * 100, timing));
      bar4Width.value = withDelay(250, withTiming((expert / maxGames) * 100, timing));
    } else {
      bar1Width.value = withDelay(100, withTiming(getTimeBarPercentage(bestTimeEasy) * 100, timing));
      bar2Width.value = withDelay(150, withTiming(getTimeBarPercentage(bestTimeMedium) * 100, timing));
      bar3Width.value = withDelay(200, withTiming(getTimeBarPercentage(bestTimeHard) * 100, timing));
      bar4Width.value = withDelay(250, withTiming(getTimeBarPercentage(bestTimeExpert) * 100, timing));
    }
  }, [activeTab, easy, medium, hard, expert, bestTimeEasy, bestTimeMedium, bestTimeHard, bestTimeExpert, maxGames]);

  const animatedStyles = [
    useAnimatedStyle(() => ({ width: `${bar1Width.value}%` })),
    useAnimatedStyle(() => ({ width: `${bar2Width.value}%` })),
    useAnimatedStyle(() => ({ width: `${bar3Width.value}%` })),
    useAnimatedStyle(() => ({ width: `${bar4Width.value}%` })),
  ];

  // Get display value for each row
  const getDisplayValue = (index: number): string => {
    if (activeTab === 'games') {
      const counts = [easy, medium, hard, expert];
      return counts[index].toString();
    } else {
      const times = [bestTimeEasy, bestTimeMedium, bestTimeHard, bestTimeExpert];
      return formatTime(times[index]);
    }
  };

  return (
    <View style={styles.container}>
      {/* Tab Toggle */}
      <View style={styles.tabRow}>
        <Pressable
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'games'
                ? (theme.isDark ? 'rgba(139, 79, 86, 0.2)' : 'rgba(139, 79, 86, 0.15)')
                : 'transparent',
              borderColor: activeTab === 'games' ? ERFOLGE_COLOR : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('games')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'games' ? ERFOLGE_COLOR : colors.textSecondary,
                fontWeight: activeTab === 'games' ? '700' : '500',
              },
            ]}
          >
            {t('achievementsTab.stats.games')}
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.tab,
            {
              backgroundColor: activeTab === 'times'
                ? (theme.isDark ? 'rgba(139, 79, 86, 0.2)' : 'rgba(139, 79, 86, 0.15)')
                : 'transparent',
              borderColor: activeTab === 'times' ? ERFOLGE_COLOR : 'transparent',
            },
          ]}
          onPress={() => setActiveTab('times')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: activeTab === 'times' ? ERFOLGE_COLOR : colors.textSecondary,
                fontWeight: activeTab === 'times' ? '700' : '500',
              },
            ]}
          >
            {t('achievementsTab.stats.times')}
          </Text>
        </Pressable>
      </View>

      {/* Stats Rows */}
      {difficulties.map((diff, index) => (
        <View
          key={diff.key}
          style={[
            styles.row,
            index === difficulties.length - 1 && styles.rowLast,
          ]}
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
                  { backgroundColor: ERFOLGE_COLOR },
                  animatedStyles[index],
                ]}
              />
            </View>
          </View>

          {/* Value */}
          <Text style={[styles.valueText, { color: colors.textPrimary }]}>
            {getDisplayValue(index)}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default StatsSection;
