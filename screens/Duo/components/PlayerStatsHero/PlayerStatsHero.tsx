// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { loadStats } from "@/utils/storage";
import { triggerHaptic } from "@/utils/haptics";
import { getRankTierName, RankTier } from "@/utils/elo/eloCalculator";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";

// SVG Icons
import BattleIcon from "@/assets/svg/battle.svg";
import ZielIcon from "@/assets/svg/ziel.svg";
import LightningIcon from "@/assets/svg/lightning.svg";
import SilverBadgeIcon from "@/assets/svg/silver-badge.svg";

import styles from "./PlayerStatsHero.styles";

// Erfolge Color - Deep Wine (matches Leistungsscreen)
const ERFOLGE_COLOR = "#8B4F56";

// Serien Color - Golden Amber (matches Leistungsscreen Streak section)
const SERIEN_COLOR = "#FFC850";

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
  onTutorialPress?: () => void;
  onLeaderboardPress?: () => void;
}

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Subtle tier gradient - uses tier color as a hint, keeps cohesive with DUO theme
const getTierGradientColors = (
  tierColor: string,
  isDark: boolean
): [string, string, string] => {
  // Very subtle tier color overlay - blends with the card background
  if (isDark) {
    return [
      hexToRGBA(tierColor, 0.12),
      hexToRGBA(tierColor, 0.06),
      "transparent",
    ];
  }
  return [
    hexToRGBA(tierColor, 0.15),
    hexToRGBA(tierColor, 0.08),
    "transparent",
  ];
};

const PlayerStatsHero: React.FC<PlayerStatsHeroProps> = ({
  elo,
  wins,
  losses,
  isLoggedIn = true,
  onTutorialPress,
  onLeaderboardPress,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const { tier, colors: leagueColors } = useCurrentLeague();

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
  const progressWidth = useSharedValue(0);
  const shinePosition = useSharedValue(-150);

  // Pop animation on mount
  useEffect(() => {
    statsScale.value = withSequence(
      withTiming(1.03, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, []);

  // Shine animation for RankCard (periodic metallic gleam)
  useEffect(() => {
    const animateShine = () => {
      shinePosition.value = -150;
      shinePosition.value = withDelay(
        2000 + Math.random() * 3000,
        withTiming(400, {
          duration: 1200,
          easing: Easing.out(Easing.ease),
        })
      );
      // Schedule next animation
      const timeoutId = setTimeout(animateShine, 6000 + Math.random() * 3000);
      return timeoutId;
    };
    const timeoutId = animateShine();
    return () => clearTimeout(timeoutId);
  }, []);

  const shineAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shinePosition.value }, { rotate: "25deg" }],
  }));

  const statsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsScale.value }],
  }));

  // Navigate to Erfolge tab on record press
  const handleRecordPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/leistung?tab=times");
  }, [router]);

  // Navigate to Serie tab on streak press
  const handleStreakPress = useCallback(() => {
    triggerHaptic("light");
    router.push("/leistung?tab=streak");
  }, [router]);

  // Handle leaderboard press (scroll to LeaderboardCard)
  const handleLeaderboardPress = useCallback(() => {
    triggerHaptic("light");
    onLeaderboardPress?.();
  }, [onLeaderboardPress]);

  // Calculate rank info - tier comes from useCurrentLeague
  const tierName = getRankTierName(tier);
  const nextTier = NEXT_TIER[tier];

  // Calculate progress percentage
  const currentThreshold = TIER_THRESHOLDS[tier];
  const nextThreshold = nextTier ? TIER_THRESHOLDS[nextTier] : currentThreshold;
  const tierRange = nextThreshold - currentThreshold;
  const progressInTier = elo - currentThreshold;
  const progressPercent = nextTier
    ? Math.min(100, Math.max(0, (progressInTier / tierRange) * 100))
    : 100;

  // Animate progress bar
  useEffect(() => {
    progressWidth.value = withDelay(
      400,
      withTiming(progressPercent, { duration: 800 })
    );
  }, [progressPercent]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  // Streak label (Tag/Tage)
  const streakLabel =
    currentStreak === 1
      ? t("stats.day", { defaultValue: "Tag" })
      : t("stats.days", { defaultValue: "Tage" });

  // Calculate points needed for next tier
  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - elo : 0;
  const nextTierName = nextTier
    ? t(`rank.${nextTier}`, { defaultValue: getRankTierName(nextTier) })
    : "";

  // Icon colors - solid backgrounds to avoid elevation artifacts
  const iconCircleBg = theme.isDark ? colors.surface : "#FFFFFF";

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 8,
          shadowColor: theme.isDark ? "transparent" : leagueColors.accent,
        },
      ]}
      entering={FadeIn.duration(400)}
    >
      <LinearGradient
        colors={
          theme.isDark
            ? [
                hexToRGBA(leagueColors.accent, 0.15),
                hexToRGBA(leagueColors.accent, 0.08),
                hexToRGBA(leagueColors.accent, 0),
              ]
            : [
                hexToRGBA(leagueColors.accent, 0.2),
                hexToRGBA(leagueColors.accent, 0.1),
                hexToRGBA(leagueColors.accent, 0),
              ]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Battle Icon - Duo Mode Identifier */}
        <View style={styles.battleIconContainer}>
          <BattleIcon width={88} height={88} />
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
            {/* Stats Row - Premium Cards */}
            <Animated.View style={[styles.statsRow, statsAnimatedStyle]}>
              {/* W-L Record Card (clickable -> Erfolge Tab) */}
              <Pressable onPress={handleRecordPress} style={styles.statCardWrapper}>
                <Animated.View
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: hexToRGBA(ERFOLGE_COLOR, theme.isDark ? 0.3 : 0.4),
                      shadowColor: ERFOLGE_COLOR,
                      elevation: theme.isDark ? 0 : 4,
                    },
                  ]}
                  entering={FadeInDown.duration(400).delay(100)}
                >
                  <LinearGradient
                    colors={getTierGradientColors(ERFOLGE_COLOR, theme.isDark)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.statCardGradient}
                  >
                    {/* Icon (no glow for stat cards) */}
                    <View style={[styles.statIconCircle, { backgroundColor: iconCircleBg }]}>
                      <ZielIcon width={28} height={28} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                      {wins}-{losses}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {t("stats.record", { defaultValue: "Bilanz" })}
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>

              {/* Daily Streak Card (clickable) */}
              <Pressable onPress={handleStreakPress} style={styles.statCardWrapper}>
                <Animated.View
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: hexToRGBA(SERIEN_COLOR, theme.isDark ? 0.5 : 0.6),
                      shadowColor: SERIEN_COLOR,
                      elevation: theme.isDark ? 0 : 4,
                    },
                  ]}
                  entering={FadeInDown.duration(400).delay(200)}
                >
                  <LinearGradient
                    colors={getTierGradientColors(SERIEN_COLOR, theme.isDark)}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.statCardGradient}
                  >
                    {/* Icon (no glow for stat cards) */}
                    <View style={[styles.statIconCircle, { backgroundColor: iconCircleBg }]}>
                      <LightningIcon width={28} height={28} />
                    </View>
                    <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                      {currentStreak}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                      {streakLabel}
                    </Text>
                  </LinearGradient>
                </Animated.View>
              </Pressable>
            </Animated.View>

            {/* Metallic Rank Card with Progress Bar (clickable -> scroll to LeaderboardCard) */}
            <Pressable
              onPress={handleLeaderboardPress}
              disabled={!onLeaderboardPress}
              style={{ width: "100%" }}
            >
              <Animated.View
                style={[
                  styles.rankCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: hexToRGBA(leagueColors.primary, theme.isDark ? 0.3 : 0.4),
                    shadowColor: leagueColors.primary,
                    elevation: theme.isDark ? 0 : 4,
                  },
                ]}
                entering={FadeInDown.duration(400).delay(300)}
              >
                {/* Subtle Tier-tinted Gradient Background */}
                <LinearGradient
                  colors={getTierGradientColors(leagueColors.primary, theme.isDark)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.rankCardGradient}
                >
                  {/* Animated Shine Effect */}
                  <Animated.View
                    style={[
                      styles.shine,
                      shineAnimatedStyle,
                      {
                        backgroundColor: theme.isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.4)",
                      },
                    ]}
                  />

                  {/* Badge with Glow */}
                  <View style={styles.rankBadgeContainer}>
                    <View
                      style={[
                        styles.rankBadgeGlow,
                        { backgroundColor: hexToRGBA(leagueColors.primary, theme.isDark ? 0.3 : 0.4) },
                      ]}
                    />
                    <SilverBadgeIcon width={52} height={52} />
                  </View>

                  {/* Text and Progress */}
                  <View style={styles.rankTextContainer}>
                    {/* Tier Name */}
                    <Text
                      style={[
                        styles.rankName,
                        { color: theme.isDark ? leagueColors.primary : leagueColors.accent },
                      ]}
                    >
                      {t(`rank.${tier}`, { defaultValue: tierName })}
                    </Text>

                    {/* ELO Value - Prominent Display */}
                    <Text style={[styles.eloValue, { color: colors.textPrimary }]}>
                      {elo.toLocaleString()}
                      <Text style={[styles.eloLabel, { color: colors.textSecondary }]}>
                        {" "}ELO
                      </Text>
                    </Text>

                    {/* Progress Bar with Gradient Fill */}
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressTrack,
                          {
                            backgroundColor: theme.isDark
                              ? "rgba(255,255,255,0.15)"
                              : "rgba(0,0,0,0.1)",
                          },
                        ]}
                      >
                        <Animated.View style={[{ height: "100%" }, progressAnimatedStyle]}>
                          <LinearGradient
                            colors={leagueColors.gradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.progressFillGradient}
                          />
                        </Animated.View>
                      </View>
                      <Text style={[styles.progressText, { color: colors.textSecondary }]}>
                        {nextTier
                          ? `${pointsToNext} → ${nextTierName}`
                          : t("rank.maxRank", { defaultValue: "Max erreicht!" })}
                      </Text>
                    </View>
                  </View>

                  {/* Chevron Indicator */}
                  {onLeaderboardPress && (
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={colors.textSecondary}
                      style={styles.rankChevron}
                    />
                  )}
                </LinearGradient>
              </Animated.View>
            </Pressable>
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

        {/* Footer with Tutorial Link */}
        {onTutorialPress && (
          <View style={styles.footer}>
            <Pressable
              style={({ pressed }) => [
                styles.tutorialButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              onPress={onTutorialPress}
            >
              <Feather name="info" size={16} color={colors.textSecondary} />
              <Text
                style={[styles.tutorialButtonText, { color: colors.textSecondary }]}
              >
                {t("features.title", { defaultValue: "So funktioniert's" })}
              </Text>
            </Pressable>
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

export default PlayerStatsHero;
