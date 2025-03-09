import React, { useEffect } from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameStats, Difficulty } from "@/utils/sudoku";
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

// Bar chart for best times comparison
const BestTimesChart = ({ stats }: { stats: GameStats }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { width } = Dimensions.get("window");
  const chartWidth = width - 64;

  // Max time for scaling (use largest non-infinity time or default to 15 minutes)
  const timesArray = [
    stats.bestTimeEasy === Infinity ? 0 : stats.bestTimeEasy,
    stats.bestTimeMedium === Infinity ? 0 : stats.bestTimeMedium,
    stats.bestTimeHard === Infinity ? 0 : stats.bestTimeHard,
    stats.bestTimeExpert === Infinity ? 0 : stats.bestTimeExpert,
  ];

  const maxTime = Math.max(...timesArray) || 900; // 15 minutes default if all are Infinity

  // Animation values
  const barWidth1 = useSharedValue(0);
  const barWidth2 = useSharedValue(0);
  const barWidth3 = useSharedValue(0);
  const barWidth4 = useSharedValue(0);

  // Start animations when component mounts
  useEffect(() => {
    const easyWidth =
      stats.bestTimeEasy === Infinity
        ? 0
        : (stats.bestTimeEasy / maxTime) * chartWidth;
    const mediumWidth =
      stats.bestTimeMedium === Infinity
        ? 0
        : (stats.bestTimeMedium / maxTime) * chartWidth;
    const hardWidth =
      stats.bestTimeHard === Infinity
        ? 0
        : (stats.bestTimeHard / maxTime) * chartWidth;
    const expertWidth =
      stats.bestTimeExpert === Infinity
        ? 0
        : (stats.bestTimeExpert / maxTime) * chartWidth;

    setTimeout(() => {
      barWidth1.value = withTiming(easyWidth, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
      barWidth2.value = withTiming(mediumWidth, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
      barWidth3.value = withTiming(hardWidth, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
      barWidth4.value = withTiming(expertWidth, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      });
    }, 300);
  }, []);

  // Animated styles
  const barStyle1 = useAnimatedStyle(() => ({ width: barWidth1.value }));
  const barStyle2 = useAnimatedStyle(() => ({ width: barWidth2.value }));
  const barStyle3 = useAnimatedStyle(() => ({ width: barWidth3.value }));
  const barStyle4 = useAnimatedStyle(() => ({ width: barWidth4.value }));

  const difficulties: {
    key: Difficulty;
    name: string;
    color: string;
    style: any;
  }[] = [
    { key: "easy", name: "Leicht", color: colors.success, style: barStyle1 },
    { key: "medium", name: "Mittel", color: colors.warning, style: barStyle2 },
    { key: "hard", name: "Schwer", color: colors.error, style: barStyle3 },
    {
      key: "expert",
      name: "Experte",
      color: colors.secondary,
      style: barStyle4,
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
          const time =
            diff.key === "easy"
              ? stats.bestTimeEasy
              : diff.key === "medium"
              ? stats.bestTimeMedium
              : diff.key === "hard"
              ? stats.bestTimeHard
              : stats.bestTimeExpert;

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
                <Animated.View
                  style={[
                    styles.chartBar,
                    { backgroundColor: diff.color },
                    diff.style,
                  ]}
                />
              </View>

              <Text style={[styles.chartValue, { color: colors.textPrimary }]}>
                {getBestTime(time)}
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
