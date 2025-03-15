import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Difficulty } from "@/utils/sudoku";
import { CircularProgress } from "@/components/CircularProgress/CircularProgress";
import { GameStats } from "@/utils/storage";
import Button from "@/components/Button/Button";
import styles from "./GameCompletionModal.styles";
import { spacing } from "@/utils/theme";

interface GameCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  timeElapsed: number;
  difficulty: Difficulty;
  autoNotesUsed: boolean;
  stats?: GameStats | null;
}

// Helper to format time (MM:SS)
const formatTime = (seconds: number): string => {
  if (seconds === Infinity || seconds === 0) return "--:--";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Helper to get stars based on difficulty and time
const getStarsCount = (difficulty: Difficulty, timeElapsed: number): number => {
  // Schwellenwerte für Sterne basierend auf Schwierigkeit und Zeit
  const thresholds = {
    easy: { three: 120, two: 240, one: 360 }, // 2min, 4min, 6min
    medium: { three: 240, two: 360, one: 480 }, // 4min, 6min, 8min
    hard: { three: 360, two: 480, one: 600 }, // 6min, 8min, 10min
    expert: { three: 480, two: 600, one: 720 }, // 8min, 10min, 12min
  };

  const threshold = thresholds[difficulty];

  if (timeElapsed <= threshold.three) return 3;
  if (timeElapsed <= threshold.two) return 2;
  return 1;
};

// Helper to get motivational message based on stars
const getMotivationalMessage = (
  starsCount: number,
  isNewBestTime: boolean
): string => {
  if (isNewBestTime) {
    return "Fantastisch! Neuer persönlicher Rekord!";
  }

  const messages = {
    3: [
      "Beeindruckend! Du bist ein Sudoku-Meister!",
      "Unglaubliche Leistung! Du hast das voll drauf!",
      "Wow! Du bist in Bestform!",
    ],
    2: [
      "Sehr gut! Weiter so!",
      "Gut gemacht! Du wirst immer besser!",
      "Tolle Arbeit! Bleib dran!",
    ],
    1: [
      "Geschafft! Mit Übung wirst du noch schneller!",
      "Gut gelöst! Nächstes Mal schaffst du es noch schneller!",
      "Weiter so! Übung macht den Meister!",
    ],
  };

  // Zufällige Auswahl einer Nachricht passend zur Sternanzahl
  const messageOptions = messages[starsCount as keyof typeof messages];
  return messageOptions[Math.floor(Math.random() * messageOptions.length)];
};

const GameCompletionModal: React.FC<GameCompletionModalProps> = ({
  visible,
  onClose,
  onNewGame,
  onContinue,
  timeElapsed,
  difficulty,
  autoNotesUsed,
  stats,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const scale = useSharedValue(0.95);
  const opacity = useSharedValue(0);
  const starScale = useSharedValue(0);

  // Compute performance percentage compared to best time
  const getPerformancePercentage = (
    currentTime: number,
    bestTime: number
  ): number => {
    // If there's no previous best time, or auto notes were used, just return 100%
    if (bestTime === Infinity || bestTime === 0 || autoNotesUsed) {
      return 100;
    }

    // Calculate performance relative to best time
    // If current time is better (lower) than best time, this will be >100%
    const performance = (bestTime / currentTime) * 100;

    // Round to nearest integer and cap at reasonable limits
    return Math.min(Math.max(Math.round(performance), 1), 200);
  };

  // Compute stars, performance and prepare animations
  const starsCount = getStarsCount(difficulty, timeElapsed);
  const bestTimeKey = `bestTime${
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  }` as keyof GameStats;
  const previousBestTime = stats ? stats[bestTimeKey] : Infinity;

  // Calculate performance compared to best time
  const performancePercentage = getPerformancePercentage(
    timeElapsed,
    previousBestTime
  );

  // Check if it's a new best time
  const isNewBestTime =
    !autoNotesUsed && timeElapsed < previousBestTime && previousBestTime !== 0;

  // Prepare motivational message
  const motivationalMessage = getMotivationalMessage(starsCount, isNewBestTime);

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Trigger haptic feedback for success
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Verzögerung zur Vermeidung von Animationskonflikten
      setTimeout(() => {
        // Start animations
        scale.value = withTiming(1, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        opacity.value = withTiming(1, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        // Animate stars separately with delay
        starScale.value = withDelay(
          600,
          withSequence(
            withTiming(1.2, { duration: 300 }),
            withTiming(1, { duration: 200 })
          )
        );
      }, 100);

      // Debug-Ausgabe
      console.log("GameCompletionModal wurde eingeblendet");
    } else {
      // Reset animations when hidden
      scale.value = 0.95;
      opacity.value = 0;
      starScale.value = 0;

      // Debug-Ausgabe
      console.log("GameCompletionModal wurde ausgeblendet");
    }
  }, [visible]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const starAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: starScale.value }],
    };
  });

  // Don't render if not visible
  if (!visible) return null;

  // Get difficulty name in German
  const getDifficultyName = (diff: Difficulty): string => {
    const difficultyNames: Record<Difficulty, string> = {
      easy: "Leicht",
      medium: "Mittel",
      hard: "Schwer",
      expert: "Experte",
    };
    return difficultyNames[diff];
  };

  // Render stars based on count
  const renderStars = () => {
    return (
      <View style={{ flexDirection: "row", marginBottom: spacing.sm }}>
        {[1, 2, 3].map((i) => (
          <Feather
            key={i}
            name="star"
            size={40}
            color={i <= starsCount ? colors.warning : colors.buttonDisabled}
            style={styles.starIcon}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContainer,
          { backgroundColor: colors.card },
          containerStyle,
        ]}
      >
        {/* Header with congratulations and decorative elements */}
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Glückwunsch!
          </Text>
          {isNewBestTime && (
            <View
              style={[styles.headerBanner, { backgroundColor: colors.success }]}
            >
              <Feather
                name="award"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.headerBannerText}>Neuer Rekord!</Text>
            </View>
          )}
        </View>

        {/* Stats summary */}
        <View style={styles.statsContainer}>
          {/* Performance circle */}
          <View style={styles.performanceContainer}>
            <CircularProgress
              value={Math.min(performancePercentage, 100)} // Cap at 100% for visual display
              radius={50}
              strokeWidth={10}
              duration={1500}
              color={colors.primary}
              textStyle={{
                color:
                  performancePercentage > 100
                    ? colors.success
                    : colors.textPrimary,
                fontSize: 22,
                fontWeight: "700",
              }}
              max={100} // Always max at 100% for the circle
              showPercentage={true}
            />
            <Text
              style={[
                styles.performanceLabel,
                {
                  color:
                    performancePercentage > 100
                      ? colors.success
                      : colors.textSecondary,
                  fontWeight: performancePercentage > 100 ? "700" : "500",
                },
              ]}
            >
              Leistung
            </Text>
          </View>

          {/* Time stats */}
          <View style={styles.timeStatsContainer}>
            <View style={styles.timeStatItem}>
              <Text
                style={[styles.timeStatValue, { color: colors.textPrimary }]}
              >
                {formatTime(timeElapsed)}
              </Text>
              <Text
                style={[styles.timeStatLabel, { color: colors.textSecondary }]}
              >
                Deine Zeit
              </Text>
            </View>

            <View style={styles.timeStatDivider} />

            <View style={styles.timeStatItem}>
              <View style={styles.bestTimeValueContainer}>
                <Text
                  style={[
                    styles.timeStatValue,
                    {
                      color: isNewBestTime
                        ? colors.success
                        : colors.textPrimary,
                      fontWeight: isNewBestTime ? "800" : "700",
                    },
                  ]}
                >
                  {formatTime(
                    !autoNotesUsed && isNewBestTime
                      ? timeElapsed
                      : previousBestTime
                  )}
                </Text>
                {!autoNotesUsed && isNewBestTime && (
                  <View
                    style={[
                      styles.newRecordBadge,
                      { backgroundColor: colors.success },
                    ]}
                  >
                    <Text style={styles.newRecordText}>NEU</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.timeStatLabel,
                  {
                    color: isNewBestTime
                      ? colors.success
                      : colors.textSecondary,
                    fontWeight: isNewBestTime ? "600" : "500",
                  },
                ]}
              >
                Bestzeit
              </Text>
            </View>
          </View>
        </View>

        {/* Current Streak Badge - only if meaningful */}
        {stats && stats.currentStreak > 1 && !autoNotesUsed && (
          <View style={styles.streakContainer}>
            <View
              style={[
                styles.streakBadge,
                {
                  backgroundColor: colors.primary,
                  borderColor: colors.primaryLight,
                },
              ]}
            >
              <Feather
                name="zap"
                size={22}
                color="white"
                style={styles.streakIcon}
              />
              <Text style={styles.streakValue}>{stats.currentStreak}</Text>
            </View>
            <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>
              Spiele in Folge gewonnen
            </Text>
            {stats.currentStreak === stats.longestStreak &&
              stats.longestStreak > 2 && (
                <View
                  style={[
                    styles.recordStreakBadge,
                    { backgroundColor: colors.success },
                  ]}
                >
                  <Text style={styles.recordStreakText}>
                    Persönlicher Rekord
                  </Text>
                </View>
              )}
          </View>
        )}

        {/* Stars rating with difficulty tag */}
        <View style={styles.starsContainer}>
          {renderStars()}
          <View
            style={[
              styles.difficultyTag,
              {
                backgroundColor: colors.primary,
                borderColor: colors.primaryLight,
              },
            ]}
          >
            <Text style={styles.difficultyText}>
              {getDifficultyName(difficulty)}
            </Text>
          </View>
        </View>

        {/* Motivational message */}
        <View
          style={[
            styles.messageContainer,
            {
              backgroundColor: theme.isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.02)",
            },
          ]}
        >
          <Text
            style={[styles.motivationalMessage, { color: colors.textPrimary }]}
          >
            {motivationalMessage}
          </Text>
        </View>

        {/* Info about auto notes if used */}
        {autoNotesUsed && (
          <View
            style={[
              styles.autoNotesContainer,
              { backgroundColor: `${colors.warning}15` },
            ]}
          >
            <Feather
              name="info"
              size={20}
              color={colors.warning}
              style={styles.infoIcon}
            />
            <Text
              style={[styles.autoNotesText, { color: colors.textSecondary }]}
            >
              Da automatische Notizen verwendet wurden, wird dieses Spiel nicht
              in den Statistiken gezählt.
            </Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="Neues Spiel"
            onPress={onNewGame}
            variant="primary"
            style={styles.primaryButton}
            icon={<Feather name="play" size={20} color="white" />}
            iconPosition="left"
          />

          <Button
            title="Zum Menü"
            onPress={onContinue}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default GameCompletionModal;
