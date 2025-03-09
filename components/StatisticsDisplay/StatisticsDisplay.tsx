import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameStats } from "@/utils/storage";
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";
import styles from "./StatisticsDisplay.styles";

interface StatisticsDisplayProps {
  stats: GameStats;
}

const StatisticsDisplay: React.FC<StatisticsDisplayProps> = ({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Berechne Gewinnrate (in Prozent)
  const winRate =
    stats.gamesPlayed > 0
      ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
      : 0;

  // Format time (mm:ss)
  const formatTime = (seconds: number): string => {
    if (seconds === Infinity || seconds === 0) return "--:--";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Bestzeiten bekommen mit formatierter Fallback-Anzeige
  const getBestTime = (time: number): string => {
    return time === Infinity ? "--:--" : formatTime(time);
  };

  return (
    <View style={styles.container}>
      {/* Haupt-Statistiken */}
      <View style={styles.statsRow}>
        {/* Gewinnrate */}
        <Animated.View
          style={[styles.winRateContainer, { borderColor: colors.primary }]}
          entering={FadeIn.delay(100).duration(500)}
        >
          <CircularProgress
            value={winRate}
            radius={40}
            strokeWidth={8}
            duration={1000}
            color={colors.primary}
            inActiveColor={`${colors.primary}30`}
            textStyle={{ color: colors.textPrimary }}
          />
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Gewinnrate
          </Text>
        </Animated.View>

        {/* Spiel-Details */}
        <View style={styles.statsDetails}>
          {/* Gespielte Spiele */}
          <Animated.View
            style={styles.statItem}
            entering={FadeIn.delay(200).duration(500)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.info}15` },
              ]}
            >
              <Feather name="target" size={16} color={colors.info} />
            </View>
            <View style={styles.statItemContent}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {stats.gamesPlayed}
              </Text>
              <Text
                style={[styles.statItemLabel, { color: colors.textSecondary }]}
              >
                Spiele
              </Text>
            </View>
          </Animated.View>

          {/* Gewonnene Spiele */}
          <Animated.View
            style={styles.statItem}
            entering={FadeIn.delay(300).duration(500)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.success}15` },
              ]}
            >
              <Feather name="check-circle" size={16} color={colors.success} />
            </View>
            <View style={styles.statItemContent}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {stats.gamesWon}
              </Text>
              <Text
                style={[styles.statItemLabel, { color: colors.textSecondary }]}
              >
                Gewonnen
              </Text>
            </View>
          </Animated.View>

          {/* Siege in Folge */}
          <Animated.View
            style={styles.statItem}
            entering={FadeIn.delay(400).duration(500)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.warning}15` },
              ]}
            >
              <Feather name="zap" size={16} color={colors.warning} />
            </View>
            <View style={styles.statItemContent}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {stats.currentStreak}
              </Text>
              <Text
                style={[styles.statItemLabel, { color: colors.textSecondary }]}
              >
                Aktuelle Serie
              </Text>
            </View>
          </Animated.View>

          {/* Längste Siegessträhne */}
          <Animated.View
            style={styles.statItem}
            entering={FadeIn.delay(500).duration(500)}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${colors.secondary}15` },
              ]}
            >
              <Feather name="award" size={16} color={colors.secondary} />
            </View>
            <View style={styles.statItemContent}>
              <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                {stats.longestStreak}
              </Text>
              <Text
                style={[styles.statItemLabel, { color: colors.textSecondary }]}
              >
                Beste Serie
              </Text>
            </View>
          </Animated.View>
        </View>
      </View>

      {/* Bestzeiten */}
      <Animated.View
        style={[
          styles.bestTimesContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        entering={FadeIn.delay(600).duration(500)}
      >
        <Text style={[styles.bestTimesTitle, { color: colors.textPrimary }]}>
          Bestzeiten
        </Text>

        <View style={styles.bestTimesGrid}>
          {/* Leicht */}
          <View style={styles.bestTimeItem}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: colors.success },
              ]}
            >
              <Text style={styles.difficultyText}>Leicht</Text>
            </View>
            <Text style={[styles.bestTimeValue, { color: colors.textPrimary }]}>
              {getBestTime(stats.bestTimeEasy)}
            </Text>
          </View>

          {/* Mittel */}
          <View style={styles.bestTimeItem}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: colors.warning },
              ]}
            >
              <Text style={styles.difficultyText}>Mittel</Text>
            </View>
            <Text style={[styles.bestTimeValue, { color: colors.textPrimary }]}>
              {getBestTime(stats.bestTimeMedium)}
            </Text>
          </View>

          {/* Schwer */}
          <View style={styles.bestTimeItem}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: colors.error },
              ]}
            >
              <Text style={styles.difficultyText}>Schwer</Text>
            </View>
            <Text style={[styles.bestTimeValue, { color: colors.textPrimary }]}>
              {getBestTime(stats.bestTimeHard)}
            </Text>
          </View>

          {/* Experte */}
          <View style={styles.bestTimeItem}>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: colors.secondary },
              ]}
            >
              <Text style={styles.difficultyText}>Experte</Text>
            </View>
            <Text style={[styles.bestTimeValue, { color: colors.textPrimary }]}>
              {getBestTime(stats.bestTimeExpert || Infinity)}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default StatisticsDisplay;
