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
  // Titel des Spielers (optional)
  playerTitle?: string | null;
  // Liga-Farben
  leagueGradient: [string, string];
  leaguePrimary: string;
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
  playerTitle,
  leagueGradient,
  leaguePrimary,
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

  // Determine border color (Winner gets League Color with glow)
  const borderColor = isWinner ? leaguePrimary : colors.border;

  // Determine opacity (loser is slightly faded)
  const opacity = !isTie && !isWinner ? 0.7 : 1;

  // Glow-Effekt für Gewinner (mit Liga-Farbe)
  const glowStyle = isWinner
    ? {
        shadowColor: leaguePrimary,
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
      {/* Winner Badge - Innerhalb des Containers oben rechts */}
      {isWinner && (
        <View style={styles.winnerBadge}>
          <Text
            style={[
              styles.winnerText,
              { backgroundColor: leaguePrimary },
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

        {/* Name und Titel */}
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
          {/* Titel unter dem Namen */}
          {playerTitle && (
            <View style={styles.titleRow}>
              <Feather
                name="award"
                size={14}
                color={colors.textSecondary}
                style={styles.titleIcon}
              />
              <Text
                style={[styles.playerTitle, { color: colors.textSecondary }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {playerTitle}
              </Text>
            </View>
          )}
        </View>

        {/* Trophy for winner or tie */}
        {showTrophy && (
          <Animated.View style={[styles.trophyContainer, trophyStyle]}>
            <View
              style={[
                styles.trophyCircle,
                {
                  backgroundColor: isWinner
                    ? `${leaguePrimary}20`
                    : isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
            >
              <Feather
                name={isWinner ? "award" : "star"}
                size={isWinner ? 18 : 14}
                color={isWinner ? leaguePrimary : colors.textSecondary}
              />
            </View>
          </Animated.View>
        )}
      </View>

      {/* Progress Bar mit Liga-Gradient */}
      <View style={styles.progressContainer}>
        <DuoProgressBar
          percentage={completionPercentage}
          gradient={isWinner || isTie ? leagueGradient : undefined}
          color={isWinner || isTie ? undefined : colors.textSecondary}
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
    top: 10,
    right: 10,
    zIndex: 10,
  },
  winnerText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    overflow: "hidden",
    letterSpacing: 0.5,
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
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  titleIcon: {
    marginRight: 5,
  },
  playerTitle: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
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
