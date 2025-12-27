// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { loadStats } from "@/utils/storage";
import { triggerHaptic } from "@/utils/haptics";
import {
  getRankTier,
  getRankTierName,
  getRankTierColor,
  getRankTierIcon,
  RankTier,
} from "@/utils/elo/eloCalculator";

// SVG Icons
import BattleIcon from "@/assets/svg/battle.svg";
import ZielIcon from "@/assets/svg/ziel.svg";
import LightningIcon from "@/assets/svg/lightning.svg";

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
  isLoggedIn = true,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  // Load real streak value from storage
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const loadStreak = async () => {
      try {
        const stats = await loadStats();
        setCurrentStreak(stats.dailyStreak?.currentStreak || 0);
      } catch (error) {
        console.error("Failed to load streak:", error);
      }
    };
    loadStreak();
  }, []);

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

  // Navigate to Serie tab on streak press
  const handleStreakPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/leistung?tab=streak");
  }, [router]);

  // Calculate rank info
  const tier = getRankTier(elo);
  const tierName = getRankTierName(tier);
  const tierColor = getRankTierColor(tier);
  const tierIcon = getRankTierIcon(tier) as keyof typeof Feather.glyphMap;
  const nextTier = NEXT_TIER[tier];

  // Streak label (Tag/Tage)
  const streakLabel =
    currentStreak === 1
      ? t("stats.day", { defaultValue: "Tag" })
      : t("stats.days", { defaultValue: "Tage" });

  // Calculate progress to next tier
  const getProgressText = (): string => {
    if (!nextTier) {
      return t("rank.maxRank", { defaultValue: "Maximaler Rang erreicht!" });
    }
    const nextThreshold = TIER_THRESHOLDS[nextTier];
    const pointsNeeded = nextThreshold - elo;
    const nextTierName = t(`rank.${nextTier}`, {
      defaultValue: getRankTierName(nextTier),
    });
    return t("rank.nextTier", {
      points: pointsNeeded,
      tier: nextTierName,
      defaultValue: `Noch ${pointsNeeded} ELO bis ${nextTierName}`,
    });
  };

  // Colors
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
        {/* Battle Icon - Duo Mode Identifier */}
        <View style={styles.battleIconContainer}>
          <BattleIcon width={56} height={56} />
        </View>

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
              {/* W-L Record */}
              <View style={styles.statTile}>
                <View
                  style={[
                    styles.statIconCircle,
                    { backgroundColor: hexToRGBA(DUO_COLOR, 0.2) },
                  ]}
                >
                  <ZielIcon width={22} height={22} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {wins}-{losses}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  {t("stats.record", { defaultValue: "W - N" })}
                </Text>
              </View>

              {/* Daily Streak (clickable) */}
              <Pressable onPress={handleStreakPress} style={styles.statTile}>
                <View
                  style={[
                    styles.statIconCircle,
                    { backgroundColor: "rgba(255, 184, 0, 0.2)" },
                  ]}
                >
                  <LightningIcon width={22} height={22} />
                </View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {currentStreak}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  {streakLabel}
                </Text>
              </Pressable>
            </Animated.View>

            {/* Rank Badge */}
            <View style={[styles.rankBadge, { backgroundColor: badgeBg }]}>
              <View
                style={[
                  styles.rankIconCircle,
                  { backgroundColor: hexToRGBA(tierColor, 0.2) },
                ]}
              >
                <Feather name={tierIcon} size={20} color={tierColor} />
              </View>
              <View style={styles.rankTextContainer}>
                <Text style={[styles.rankName, { color: tierColor }]}>
                  {t(`rank.${tier}`, { defaultValue: tierName })}
                </Text>
                <Text
                  style={[styles.rankProgress, { color: colors.textSecondary }]}
                >
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
