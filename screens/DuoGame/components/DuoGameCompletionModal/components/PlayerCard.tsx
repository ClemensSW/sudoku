// screens/DuoGame/components/DuoGameCompletionModal/components/PlayerCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import DuoCircularProgress from "../../DuoCircularProgress";
import PlayerStats from "./PlayerStats";

interface PlayerCardProps {
  player: 1 | 2;
  isWinner: boolean;
  isTie: boolean;
  completionPercentage: number;
  errorsRemaining: number;
  hintsRemaining: number;
  maxErrors: number;
  maxHints: number;
  progressColor: string;
  playerScale: Animated.SharedValue<number>;
  trophyScale: Animated.SharedValue<number>;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isWinner,
  isTie,
  completionPercentage,
  errorsRemaining,
  hintsRemaining,
  maxErrors,
  maxHints,
  progressColor,
  playerScale,
  trophyScale,
}) => {
  const { t } = useTranslation("duoGame");
  const { colors, isDark } = useTheme();

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerScale.value }],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  // Determine if trophy should be shown
  const showTrophy = isWinner || isTie;

  // Determine border color (Winner gets Path Color)
  const borderColor = isWinner ? progressColor : colors.border;

  // Determine opacity (loser is slightly faded)
  const opacity = !isTie && !isWinner ? 0.7 : 1;

  return (
    <Animated.View
      style={[
        styles.playerPanel,
        {
          backgroundColor: colors.numberPadButton, // Neutral (beide identisch!)
          borderColor,
          opacity,
        },
        playerStyle,
      ]}
    >
      {/* Winner Badge */}
      {isWinner && (
        <View style={styles.winnerBadge}>
          <Text
            style={[
              styles.winnerText,
              { backgroundColor: progressColor },
            ]}
          >
            {t("completion.winner")}
          </Text>
        </View>
      )}

      {/* Player Header */}
      <View style={styles.playerHeader}>
        <Text
          style={[
            styles.playerName,
            { color: isDark ? "#FFFFFF" : "#202124" },
          ]}
        >
          {t(`players.player${player}`)}
        </Text>

        {/* Trophy for winner or tie */}
        {showTrophy && (
          <Animated.View style={[styles.trophyContainer, trophyStyle]}>
            <View
              style={[
                styles.trophyCircle,
                {
                  backgroundColor: isWinner
                    ? `${progressColor}20` // 20% opacity
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Feather
                name={isWinner ? "award" : "star"}
                size={isWinner ? 20 : 16}
                color={isWinner ? progressColor : colors.textSecondary}
              />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Performance Container */}
      <View style={styles.performanceContainer}>
        {/* Circular Progress */}
        <View style={styles.progressCircleContainer}>
          <DuoCircularProgress
            percentage={completionPercentage}
            size={90}
            strokeWidth={8}
            color={isWinner ? progressColor : colors.textSecondary}
            bgColor={
              isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"
            }
            textColor={isWinner ? progressColor : colors.textPrimary}
          />

          {/* Status text below the circle */}
          <Text
            style={[
              styles.progressStatusText,
              { color: isDark ? colors.textSecondary : "#5F6368" },
            ]}
          >
            {completionPercentage === 100
              ? t("completion.complete")
              : t("completion.filled")}
          </Text>
        </View>

        {/* Stats Row */}
        <PlayerStats
          errorsRemaining={errorsRemaining}
          hintsRemaining={hintsRemaining}
          maxErrors={maxErrors}
          maxHints={maxHints}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerPanel: {
    width: "45%",
    height: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    justifyContent: "flex-start",
    position: "relative",
  },
  winnerBadge: {
    position: "absolute",
    top: -12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  winnerText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    minHeight: 28,
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
  },
  trophyContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  trophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  performanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 140,
    width: "100%",
  },
  progressCircleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  progressStatusText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default PlayerCard;
