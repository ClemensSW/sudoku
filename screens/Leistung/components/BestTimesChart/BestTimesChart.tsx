// screens/LeistungScreen/components/BestTimesChart/BestTimesChart.tsx
import React from "react";
import { View, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
import { useTranslation } from "react-i18next";
import { useProgressColor } from "@/hooks/useProgressColor";
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

  console.log("Raw best times:", {
    easy: stats.bestTimeEasy,
    medium: stats.bestTimeMedium,
    hard: stats.bestTimeHard,
    expert: stats.bestTimeExpert,
  });

  console.log("Max time for scaling:", maxTime);

  // Calculate percentage directly - now returns a number between 0 and 1
  const getBarPercentage = (time: number): number => {
    if (time <= 0 || time === Infinity) return 0;
    return time / maxTime;
  };

  // Debugging percent values
  console.log("Calculated percentages:", {
    easy: getBarPercentage(stats.bestTimeEasy),
    medium: getBarPercentage(stats.bestTimeMedium),
    hard: getBarPercentage(stats.bestTimeHard),
    expert: getBarPercentage(stats.bestTimeExpert),
  });

  // Bar data with numeric percentages - using path colors
  const difficulties: {
    key: Difficulty;
    name: string;
    color: string;
    time: number;
    percentage: number;
  }[] = [
    {
      key: "easy",
      name: t('bestTimes.difficulties.easy'),
      color: getPathColor('blue', theme.isDark),
      time: stats.bestTimeEasy,
      percentage: getBarPercentage(stats.bestTimeEasy),
    },
    {
      key: "medium",
      name: t('bestTimes.difficulties.medium'),
      color: getPathColor('green', theme.isDark),
      time: stats.bestTimeMedium,
      percentage: getBarPercentage(stats.bestTimeMedium),
    },
    {
      key: "hard",
      name: t('bestTimes.difficulties.hard'),
      color: getPathColor('yellow', theme.isDark),
      time: stats.bestTimeHard,
      percentage: getBarPercentage(stats.bestTimeHard),
    },
    {
      key: "expert",
      name: t('bestTimes.difficulties.expert'),
      color: getPathColor('purple', theme.isDark),
      time: stats.bestTimeExpert,
      percentage: getBarPercentage(stats.bestTimeExpert),
    },
  ];

  // Berechne die maximale Breite für die Skalierung
  const MAX_BAR_WIDTH = 200;

  return (
    <Animated.View
      style={[
        styles.bestTimesContainer,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4, // Elevation nur im Light Mode (wie ShieldIndicator)
        },
      ]}
      entering={FadeInUp.delay(300).duration(500)}
    >
      {/* Header with Icon */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="clock" size={20} color={progressColor} />
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            {t('bestTimes.title')}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {difficulties.map((diff, index) => {
          // Berechne die reale Breite basierend auf dem Prozentsatz
          const barWidth = diff.percentage * MAX_BAR_WIDTH;

          return (
            <Animated.View
              key={diff.key}
              style={styles.chartRow}
              entering={FadeInDown.delay(400 + index * 100).duration(400)}
            >
              <View style={styles.chartLabelContainer}>
                <Text
                  style={[styles.chartLabel, { color: colors.textPrimary }]}
                >
                  {diff.name}
                </Text>
              </View>

              <View
                style={[
                  styles.chartBarBackground,
                  {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
              >
                {/* Verwende reguläre View mit fester Anzahl an Pixeln */}
                <View
                  style={[
                    styles.chartBar,
                    {
                      backgroundColor: diff.color,
                      width: barWidth,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.chartValue, { color: colors.textPrimary }]}>
                {getBestTime(diff.time)}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default BestTimesChart;
