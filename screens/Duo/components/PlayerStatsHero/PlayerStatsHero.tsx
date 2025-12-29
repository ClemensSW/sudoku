// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
  FadeInDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  isLoggedIn?: boolean;
  onTutorialPress?: () => void;
  onLeaderboardPress?: () => void;
  onLocalPlay?: () => void;
  onOnlinePlay?: () => void;
  isOnlineDisabled?: boolean;
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
  isLoggedIn = true,
  onTutorialPress,
  onLeaderboardPress,
  onLocalPlay,
  onOnlinePlay,
  isOnlineDisabled = false,
}) => {
  const { t } = useTranslation("duo");
  const { colors, typography, isDark } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { tier, colors: leagueColors } = useCurrentLeague();

  // Load real stats from storage
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameStats, setGameStats] = useState({ wins: 0, losses: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        const stats = await loadStats();
        setCurrentStreak(stats.dailyStreak?.currentStreak || 0);
        setGameStats({
          wins: stats.gamesWon || 0,
          losses: (stats.gamesPlayed || 0) - (stats.gamesWon || 0),
        });
      } catch (error) {
        console.error("Failed to load stats:", error);
      }
    };
    loadData();
  }, []);

  // Animation values
  const progressWidth = useSharedValue(0);
  const shinePosition = useSharedValue(-150);

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

  return (
    <LinearGradient
      colors={
        isDark
          ? [
              hexToRGBA(leagueColors.accent, 0.15),
              hexToRGBA(leagueColors.accent, 0.05),
              "transparent",
            ]
          : [
              hexToRGBA(leagueColors.accent, 0.2),
              hexToRGBA(leagueColors.accent, 0.08),
              "transparent",
            ]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.heroSection, { paddingTop: insets.top + 40 }]}
    >
      {/* Battle Icon - Duo Mode Identifier */}
      <View style={styles.battleIconContainer}>
        <BattleIcon width={120} height={120} />
      </View>

      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          {t("header.subtitle", { defaultValue: "ZWEI SPIELER MODUS" })}
        </Text>
        <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.xxl }]}>
          {t("header.title", { defaultValue: "Sudoku Duo" })}
        </Text>
      </View>

      {isLoggedIn ? (
        <>
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
                    borderColor: hexToRGBA(leagueColors.primary, isDark ? 0.3 : 0.4),
                    shadowColor: leagueColors.primary,
                    elevation: isDark ? 0 : 4,
                  },
                ]}
                entering={FadeInDown.duration(400).delay(100)}
              >
                {/* Subtle Tier-tinted Gradient Background */}
                <LinearGradient
                  colors={getTierGradientColors(leagueColors.primary, isDark)}
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
                        backgroundColor: isDark
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
                        { backgroundColor: hexToRGBA(leagueColors.primary, isDark ? 0.3 : 0.4) },
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
                        { color: isDark ? leagueColors.primary : leagueColors.accent, fontSize: typography.size.sm },
                      ]}
                    >
                      {t(`rank.${tier}`, { defaultValue: tierName })}
                    </Text>

                    {/* ELO Value - Prominent Display */}
                    <Text style={[styles.eloValue, { color: colors.textPrimary, fontSize: typography.size.xxl }]}>
                      {elo.toLocaleString()}
                      <Text style={[styles.eloLabel, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                        {" "}ELO
                      </Text>
                    </Text>

                    {/* Progress Bar with Gradient Fill */}
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressTrack,
                          {
                            backgroundColor: isDark
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
                      <Text style={[styles.progressText, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
                        {nextTier
                          ? `${pointsToNext} → ${nextTierName}`
                          : t("rank.maxRank", { defaultValue: "Max erreicht!" })}
                      </Text>
                    </View>
                  </View>

                </LinearGradient>
              </Animated.View>
            </Pressable>

            {/* Stats Inline - Compact horizontal display */}
            <Animated.View
              style={styles.statsInline}
              entering={FadeInDown.duration(400).delay(200)}
            >
              {/* W-L Record (clickable -> Erfolge Tab) */}
              <Pressable onPress={handleRecordPress} style={styles.statsInlineItem}>
                <ZielIcon width={20} height={20} />
                <Text style={[styles.statsInlineValue, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                  {gameStats.wins}-{gameStats.losses}
                </Text>
                <Text style={[styles.statsInlineLabel, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                  {t("stats.record", { defaultValue: "Bilanz" })}
                </Text>
              </Pressable>

              {/* Divider */}
              <Text style={[styles.statsInlineDivider, { color: colors.textSecondary, fontSize: typography.size.md }]}>
                •
              </Text>

              {/* Daily Streak (clickable) */}
              <Pressable onPress={handleStreakPress} style={styles.statsInlineItem}>
                <LightningIcon width={20} height={20} />
                <Text style={[styles.statsInlineValue, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                  {currentStreak}
                </Text>
                <Text style={[styles.statsInlineLabel, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                  {streakLabel}
                </Text>
              </Pressable>

              {/* Tutorial Link */}
              {onTutorialPress && (
                <>
                  <Text style={[styles.statsInlineDivider, { color: colors.textSecondary, fontSize: typography.size.md }]}>
                    •
                  </Text>
                  <Pressable onPress={onTutorialPress} style={styles.statsInlineItem}>
                    <Feather name="info" size={18} color={colors.textSecondary} />
                    <Text style={[styles.statsInlineLabel, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                      {t("features.short", { defaultValue: "Info" })}
                    </Text>
                  </Pressable>
                </>
              )}
            </Animated.View>

            {/* Action Buttons Row */}
            {(onLocalPlay || onOnlinePlay) && (
              <View style={styles.actionButtonsRow}>
                {onLocalPlay && (
                  <Pressable
                    onPress={onLocalPlay}
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                        shadowColor: isDark ? "transparent" : leagueColors.accent,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                      {t("gameModeModal.local.title", { defaultValue: "Lokal spielen" })}
                    </Text>
                  </Pressable>
                )}
                {onOnlinePlay && (
                  <Pressable
                    onPress={onOnlinePlay}
                    disabled={isOnlineDisabled}
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        backgroundColor: colors.surface,
                        borderColor: isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.06)",
                        shadowColor: isDark ? "transparent" : leagueColors.accent,
                        opacity: isOnlineDisabled ? 0.5 : pressed ? 0.9 : 1,
                      },
                    ]}
                  >
                    <Text style={[styles.actionButtonText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                      {t("gameModeModal.online.title", { defaultValue: "Online spielen" })}
                    </Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.loginPrompt}>
            <Feather
              name="user"
              size={32}
              color={colors.textSecondary}
              style={{ marginBottom: 8 }}
            />
            <Text style={[styles.loginText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
              {t("stats.loginPrompt", {
                defaultValue: "Melde dich an um deine Stats zu sehen",
              })}
            </Text>
          </View>
        )}

    </LinearGradient>
  );
};

export default PlayerStatsHero;
