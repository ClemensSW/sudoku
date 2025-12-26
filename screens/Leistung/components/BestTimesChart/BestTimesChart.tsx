// screens/LeistungScreen/components/BestTimesChart/BestTimesChart.tsx
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
import { useTranslation } from "react-i18next";
import { getPathColor } from "@/utils/pathColors";
import styles from "./BestTimesChart.styles";

interface BestTimesChartProps {
  stats: GameStats;
}

// Helper to format time (mm:ss)
const formatTime = (seconds: number): string => {
  if (seconds === Infinity || seconds === 0) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const getBestTime = (time: number): string => {
  return time === Infinity ? "--:--" : formatTime(time);
};

const BestTimesChart: React.FC<BestTimesChartProps> = ({ stats }) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  // Max time for scaling (use largest non-infinity time or default to 15 minutes)
  const validTimes = [
    stats.bestTimeEasy > 0 ? stats.bestTimeEasy : 0,
    stats.bestTimeMedium > 0 ? stats.bestTimeMedium : 0,
    stats.bestTimeHard > 0 ? stats.bestTimeHard : 0,
    stats.bestTimeExpert > 0 ? stats.bestTimeExpert : 0,
  ].filter((time) => time > 0);

  const maxTime = validTimes.length > 0 ? Math.max(...validTimes) : 900; // 15 minutes default

  // Calculate percentage directly - now returns a number between 0 and 1
  const getBarPercentage = (time: number): number => {
    if (time <= 0 || time === Infinity) return 0;
    return time / maxTime;
  };

  // Bar data with numeric percentages - using path colors
  const difficulties: {
    key: Difficulty;
    label: string;
    color: string;
    time: number;
    percentage: number;
  }[] = [
    {
      key: "easy",
      label: t('bestTimes.difficulties.easy'),
      color: getPathColor('blue', theme.isDark),
      time: stats.bestTimeEasy,
      percentage: getBarPercentage(stats.bestTimeEasy),
    },
    {
      key: "medium",
      label: t('bestTimes.difficulties.medium'),
      color: getPathColor('green', theme.isDark),
      time: stats.bestTimeMedium,
      percentage: getBarPercentage(stats.bestTimeMedium),
    },
    {
      key: "hard",
      label: t('bestTimes.difficulties.hard'),
      color: getPathColor('yellow', theme.isDark),
      time: stats.bestTimeHard,
      percentage: getBarPercentage(stats.bestTimeHard),
    },
    {
      key: "expert",
      label: t('bestTimes.difficulties.expert'),
      color: getPathColor('purple', theme.isDark),
      time: stats.bestTimeExpert,
      percentage: getBarPercentage(stats.bestTimeExpert),
    },
  ];

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? 'transparent' : progressColor,
        },
      ]}
      entering={FadeInDown.delay(400).duration(400)}
    >
      {/* Section Title */}
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
        {t('bestTimes.title')}
      </Text>

      {/* Time Rows */}
      {difficulties.map((diff, index) => (
        <Animated.View
          key={diff.key}
          style={[
            styles.row,
            index === difficulties.length - 1 && styles.rowLast,
          ]}
          entering={FadeInDown.delay(500 + index * 80).duration(300)}
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
              <View
                style={[
                  styles.progressFill,
                  {
                    backgroundColor: diff.color,
                    width: `${diff.percentage * 100}%`,
                  },
                ]}
              />
            </View>
          </View>

          {/* Time */}
          <Text style={[styles.timeText, { color: colors.textPrimary }]}>
            {getBestTime(diff.time)}
          </Text>
        </Animated.View>
      ))}
    </Animated.View>
  );
};

export default BestTimesChart;
