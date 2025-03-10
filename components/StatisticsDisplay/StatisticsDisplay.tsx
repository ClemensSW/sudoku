import React, { useEffect } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { GameStats } from "@/utils/storage"; // Import von storage statt sudoku
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";
import styles from "./StatisticsDisplay.styles";

interface StatisticsDisplayProps {
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

// Bar chart for best times comparison - Direktere Implementierung
const BestTimesChart = ({ stats }: { stats: GameStats }) => {
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

  // Calculate percentage directly
  const getBarPercentage = (time: number): string => {
    if (time <= 0 || time === Infinity) return "0%";
    return `${Math.round((time / maxTime) * 100)}%`;
  };

  // Debugging percent values
  console.log("Calculated percentages:", {
    easy: getBarPercentage(stats.bestTimeEasy),
    medium: getBarPercentage(stats.bestTimeMedium),
    hard: getBarPercentage(stats.bestTimeHard),
    expert: getBarPercentage(stats.bestTimeExpert),
  });

  // Bar data with direct percentages
  const difficulties: {
    key: Difficulty;
    name: string;
    color: string;
    time: number;
    percentage: string;
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
      color: colors.secondary,
      time: stats.bestTimeExpert,
      percentage: getBarPercentage(stats.bestTimeExpert),
    },
  ];

  return (
    <Animated.View
      style={[styles.bestTimesContainer, { backgroundColor: colors.surface }]}
      entering={FadeInUp.delay(300).duration(500)}
    >
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        Bestzeiten
      </Text>

      <View style={styles.chartContainer}>
        {difficulties.map((diff, index) => {
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
                {/* Direkte Prozentangabe für die Balkenbreite */}
                <Animated.View
                  style={[
                    styles.chartBar,
                    {
                      backgroundColor: diff.color,
                      width: diff.percentage,
                    },
                  ]}
                  entering={FadeIn.delay(600 + index * 100).duration(600)}
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

// Main component
const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Calculate win rate percentage
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  // Calculate experience points and level
  const calculateExperience = () => {
    // Base XP: Each game completed gives 1 XP
    let totalXP = stats.gamesPlayed;

    // Bonus XP for wins based on difficulty
    // We don't have separate counters for each difficulty win, so we'll use a simplified approach
    // Assuming most wins give a modest bonus
    totalXP += stats.gamesWon * 2;

    return totalXP;
  };

  const totalXP = calculateExperience();

  // Level thresholds - increasing requirements for each level
  const levelThresholds = [0, 5, 15, 30, 50, 75, 105, 140, 180, 225, 275, 330];

  // Find current level based on XP
  const getCurrentLevel = () => {
    let level = 0;
    for (let i = 0; i < levelThresholds.length; i++) {
      if (totalXP >= levelThresholds[i]) {
        level = i;
      } else {
        break;
      }
    }
    return level;
  };

  const playerLevel = getCurrentLevel();

  // Get XP needed for next level
  const getNextLevelXP = () => {
    if (playerLevel >= levelThresholds.length - 1) {
      return levelThresholds[playerLevel] + 100; // If max level, just add more XP
    }
    return levelThresholds[playerLevel + 1];
  };

  const nextLevelXP = getNextLevelXP();

  // Calculate progress to next level
  const levelProgress = Math.min(
    100,
    Math.round(
      ((totalXP - levelThresholds[playerLevel]) /
        (nextLevelXP - levelThresholds[playerLevel])) *
        100
    )
  );

  // Level names
  const getLevelName = (level: number) => {
    const levelNames = [
      "Anfänger",
      "Lehrling",
      "Herausforderer",
      "Puzzler",
      "Taktiker",
      "Stratege",
      "Meister",
      "Großmeister",
      "Experte",
      "Virtuose",
      "Genie",
      "Sudoku-Legende",
    ];

    return level < levelNames.length ? levelNames[level] : "Sudoku-Gott";
  };

  const levelName = getLevelName(playerLevel);

  // Motivational text based on player progress
  const getMotivationalText = () => {
    if (stats.gamesPlayed === 0) return "Spiele dein erstes Sudoku!";
    if (stats.currentStreak > 2)
      return `Super! ${stats.currentStreak} Siege in Folge!`;
    if (levelProgress > 80) return "Fast am nächsten Level! Weiter so!";
    if (playerLevel === 0) return "Sammle XP durch lösen von Sudokus!";
    return `Auf zum Level ${playerLevel + 1}!`;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header with level and XP progress */}
      <Animated.View
        style={[styles.headerContainer, { backgroundColor: colors.primary }]}
        entering={FadeIn.duration(600)}
      >
        <View style={styles.winRateContainer}>
          <CircularProgress
            value={winRate}
            radius={45}
            strokeWidth={8}
            duration={1500}
            color="#ffffff"
            inActiveColor="rgba(255,255,255,0.2)"
            textStyle={{ color: "#ffffff", fontSize: 20, fontWeight: "700" }}
          />
          <Text style={styles.winRateLabel}>Gewinnrate</Text>
        </View>

        <View style={styles.profileContainer}>
          <View style={styles.levelContainer}>
            <Text style={styles.levelNumber}>Lvl {playerLevel}</Text>
            <Text style={styles.playerLevel}>{levelName}</Text>
          </View>
          <Text style={styles.motivationalText}>{getMotivationalText()}</Text>

          <View style={styles.levelProgressContainer}>
            <View style={styles.levelProgress}>
              <View
                style={[
                  styles.levelProgressFill,
                  { width: `${levelProgress}%` },
                ]}
              />
            </View>
            <Text style={styles.levelProgressText}>
              {totalXP} / {nextLevelXP} XP
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Current stats summary */}
      <View style={styles.statsGridContainer}>
        <Animated.View
          style={[styles.statBox, { backgroundColor: colors.surface }]}
          entering={FadeInUp.delay(200).duration(400)}
        >
          <Feather name="award" size={24} color={colors.primary} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.gamesWon}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Gewonnen
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.statBox, { backgroundColor: colors.surface }]}
          entering={FadeInUp.delay(250).duration(400)}
        >
          <Feather name="target" size={24} color={colors.info} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.gamesPlayed}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Gespielt
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.statBox, { backgroundColor: colors.surface }]}
          entering={FadeInUp.delay(300).duration(400)}
        >
          <Feather name="zap" size={24} color={colors.warning} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Serie
          </Text>
        </Animated.View>

        <Animated.View
          style={[styles.statBox, { backgroundColor: colors.surface }]}
          entering={FadeInUp.delay(350).duration(400)}
        >
          <Feather name="trending-up" size={24} color={colors.success} />
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Beste Serie
          </Text>
        </Animated.View>
      </View>

      {/* Best times chart */}
      <BestTimesChart stats={stats} />
    </ScrollView>
  );
};

export default StatisticsDisplay;
