// screens/LeistungScreen/components/BestTimesChart/BestTimesChart.tsx
import React from "react";
import { View, Text } from "react-native";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage";
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
  const theme = useTheme();
  const colors = theme.colors;

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

  // Bar data with numeric percentages
  const difficulties: {
    key: Difficulty;
    name: string;
    color: string;
    time: number;
    percentage: number;
  }[] = [
    {
      key: "easy",
      name: "Leicht",
      color: colors.success,
      time: stats.bestTimeEasy,
      percentage: getBarPercentage(stats.bestTimeEasy),
    },
    {
      key: "medium",
      name: "Mittel",
      color: colors.warning,
      time: stats.bestTimeMedium,
      percentage: getBarPercentage(stats.bestTimeMedium),
    },
    {
      key: "hard",
      name: "Schwer",
      color: colors.error,
      time: stats.bestTimeHard,
      percentage: getBarPercentage(stats.bestTimeHard),
    },
    {
      key: "expert",
      name: "Experte",
      color: colors.info,
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
          elevation: theme.isDark ? 0 : 2, // Elevation nur im Light Mode
        },
      ]}
      entering={FadeInUp.delay(300).duration(500)}
    >
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Bestzeiten
      </Text>

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
