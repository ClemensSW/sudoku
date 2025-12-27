// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.tsx
import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import {
  getRankTier,
  getRankTierName,
  getRankTierColor,
  getRankTierIcon,
  RankTier,
} from "@/utils/elo/eloCalculator";
import styles from "./PlayerStatsHero.styles";

// Duo Color - Professional Blue
const DUO_COLOR = "#4A6FA5";

// ELO thresholds for each tier
const TIER_THRESHOLDS: Record<RankTier, number> = {
  novice: 0,
  bronze: 1000,
  silver: 1200,
  gold: 1400,
  diamond: 1600,
  master: 1800,
  grandmaster: 2000,
};

// Next tier mapping
const NEXT_TIER: Record<RankTier, RankTier | null> = {
  novice: "bronze",
  bronze: "silver",
  silver: "gold",
  gold: "diamond",
  diamond: "master",
  master: "grandmaster",
  grandmaster: null,
};

interface PlayerStatsHeroProps {
  elo: number;
  wins: number;
  losses: number;
  winStreak: number;
  isLoggedIn?: boolean;
}

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const PlayerStatsHero: React.FC<PlayerStatsHeroProps> = ({
  elo,
  wins,
  losses,
  winStreak,
  isLoggedIn = true,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const statsScale = useSharedValue(1);

  // Pop animation on mount
  useEffect(() => {
    statsScale.value = withSequence(
      withTiming(1.05, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, []);

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsScale.value }],
  }));

  // Calculate rank info
  const tier = getRankTier(elo);
  const tierName = getRankTierName(tier);
  const tierColor = getRankTierColor(tier);
  const tierIcon = getRankTierIcon(tier) as keyof typeof Feather.glyphMap;
  const nextTier = NEXT_TIER[tier];

  // Calculate progress to next tier
  const getProgressText = (): string => {
    if (!nextTier) {
      return t("rank.maxRank", { defaultValue: "Maximaler Rang erreicht!" });
    }
    const nextThreshold = TIER_THRESHOLDS[nextTier];
    const pointsNeeded = nextThreshold - elo;
    const nextTierName = t(`rank.${nextTier}`, { defaultValue: getRankTierName(nextTier) });
    return t("rank.nextTier", {
      points: pointsNeeded,
      tier: nextTierName,
      defaultValue: `Noch ${pointsNeeded} ELO bis ${nextTierName}`,
    });
  };

  // Colors
  const tileBg = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : hexToRGBA(DUO_COLOR, 0.1);
  const badgeBg = theme.isDark
    ? "rgba(255,255,255,0.06)"
    : hexToRGBA(tierColor, 0.15);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 8,
          shadowColor: theme.isDark ? "transparent" : DUO_COLOR,
        },
      ]}
      entering={FadeIn.duration(400)}
    >
      <LinearGradient
        colors={
          theme.isDark
            ? [
                hexToRGBA(DUO_COLOR, 0.15),
                hexToRGBA(DUO_COLOR, 0.08),
                hexToRGBA(DUO_COLOR, 0),
              ]
            : [
                hexToRGBA(DUO_COLOR, 0.2),
                hexToRGBA(DUO_COLOR, 0.1),
                hexToRGBA(DUO_COLOR, 0),
              ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t("header.subtitle", { defaultValue: "ZWEI SPIELER MODUS" })}
          </Text>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {t("header.title", { defaultValue: "Sudoku Duo" })}
          </Text>
        </View>

        {isLoggedIn ? (
          <>
            {/* Stats Row */}
            <Animated.View style={[styles.statsRow, statsAnimatedStyle]}>
              {/* ELO Stat */}
              <View style={[styles.statTile, { backgroundColor: tileBg }]}>
                <Feather
                  name="star"
                  size={18}
                  color={tierColor}
                  style={styles.statIcon}
                />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {elo}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t("stats.elo", { defaultValue: "ELO" })}
                </Text>
              </View>

              {/* W-L Record */}
              <View style={[styles.statTile, { backgroundColor: tileBg }]}>
                <Feather
                  name="award"
                  size={18}
                  color={DUO_COLOR}
                  style={styles.statIcon}
                />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {wins}-{losses}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t("stats.record", { defaultValue: "W - N" })}
                </Text>
              </View>

              {/* Win Streak */}
              <View style={[styles.statTile, { backgroundColor: tileBg }]}>
                <Feather
                  name="zap"
                  size={18}
                  color="#FF9500"
                  style={styles.statIcon}
                />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {winStreak}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  {t("stats.streak", { defaultValue: "Serie" })}
                </Text>
              </View>
            </Animated.View>

            {/* Rank Badge */}
            <View style={[styles.rankBadge, { backgroundColor: badgeBg }]}>
              <View
                style={[
                  styles.rankIconContainer,
                  { backgroundColor: hexToRGBA(tierColor, 0.2) },
                ]}
              >
                <Feather name={tierIcon} size={20} color={tierColor} />
              </View>
              <View style={styles.rankTextContainer}>
                <Text style={[styles.rankName, { color: tierColor }]}>
                  {t(`rank.${tier}`, { defaultValue: tierName })}
                </Text>
                <Text style={[styles.rankProgress, { color: colors.textSecondary }]}>
                  {getProgressText()}
                </Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.loginPrompt}>
            <Feather
              name="user"
              size={32}
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.loginText, { color: colors.textSecondary }]}>
              {t("stats.loginPrompt", {
                defaultValue: "Melde dich an um deine Stats zu sehen",
              })}
            </Text>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default PlayerStatsHero;
