// screens/DuoGame/components/DuoGameCompletionModal/components/PlayerCard.tsx
import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import DuoProgressBar from "./DuoProgressBar";

interface PlayerCardProps {
  player: 1 | 2;
  isWinner: boolean;
  isTie: boolean;
  completionPercentage: number;
  progressColor: string;
  playerScale: Animated.SharedValue<number>;
  trophyScale: Animated.SharedValue<number>;
  // Neue Props für Avatar und Name
  playerName: string;
  avatarSource: ImageSourcePropType;
  // Position des Containers (für Badge-Platzierung)
  isBottomPlayer?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isWinner,
  isTie,
  completionPercentage,
  progressColor,
  playerScale,
  trophyScale,
  playerName,
  avatarSource,
  isBottomPlayer = false,
}) => {
  const { t } = useTranslation("duoGame");
  const { colors, isDark } = useTheme();

  const playerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playerScale.value }],
  }));

  const trophyStyle = useAnimatedStyle(() => ({
    transform: [{ scale: trophyScale.value }],
  }));

  // Trophy nur bei Unentschieden anzeigen (nicht beim Gewinner - der hat schon den Badge)
  const showTrophy = isTie;

  // Determine border color (Winner gets Path Color with glow)
  const borderColor = isWinner ? progressColor : colors.border;

  // Determine opacity (loser is slightly faded)
  const opacity = !isTie && !isWinner ? 0.7 : 1;

  // Glow-Effekt für Gewinner
  const glowStyle = isWinner
    ? {
        shadowColor: progressColor,
        shadowOpacity: isDark ? 0.5 : 0.3,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 0 },
        elevation: isDark ? 8 : 6,
      }
    : {};

  return (
    <Animated.View
      style={[
        styles.playerPanel,
        {
          backgroundColor: colors.numberPadButton,
          borderColor,
          opacity,
          ...glowStyle,
        },
        playerStyle,
      ]}
    >
      {/* Winner Badge - Position abhängig von isBottomPlayer */}
      {isWinner && (
        <View
          style={[
            styles.winnerBadge,
            isBottomPlayer ? styles.winnerBadgeBottom : styles.winnerBadgeTop,
          ]}
        >
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

      {/* Player Header mit Avatar und Name */}
      <View style={styles.playerHeader}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>

        {/* Name */}
        <View style={styles.nameContainer}>
          <Text
            style={[
              styles.playerName,
              { color: isDark ? "#FFFFFF" : "#202124" },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {playerName}
          </Text>
        </View>

        {/* Trophy for winner or tie */}
        {showTrophy && (
          <Animated.View style={[styles.trophyContainer, trophyStyle]}>
            <View
              style={[
                styles.trophyCircle,
                {
                  backgroundColor: isWinner
                    ? `${progressColor}20`
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Feather
                name={isWinner ? "award" : "star"}
                size={isWinner ? 18 : 14}
                color={isWinner ? progressColor : colors.textSecondary}
              />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <DuoProgressBar
          percentage={completionPercentage}
          color={isWinner || isTie ? progressColor : colors.textSecondary}
          height={10}
          showLabel={true}
          animated={true}
        />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  playerPanel: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    position: "relative",
  },
  winnerBadge: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  winnerBadgeTop: {
    top: -12,
  },
  winnerBadgeBottom: {
    bottom: -12,
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
    alignItems: "center",
    marginBottom: 16,
    minHeight: 56,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  avatar: {
    width: 56,
    height: 56,
  },
  nameContainer: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
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
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
  },
});

export default PlayerCard;
