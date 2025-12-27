// screens/Duo/components/LeaderboardCard/LeaderboardCard.tsx
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import {
  getRankTierColor,
  getRankTierIcon,
  RankTier,
} from "@/utils/elo/eloCalculator";
import styles from "./LeaderboardCard.styles";

interface LeaderboardEntry {
  rank: number;
  name: string;
  rating: number;
  tier: RankTier;
  medal?: string;
}

// Dummy Top 3 entries with realistic data
const DUMMY_ENTRIES: LeaderboardEntry[] = [
  { rank: 1, name: "ProPlayer99", rating: 2147, tier: "grandmaster", medal: "🥇" },
  { rank: 2, name: "SudokuKing", rating: 1987, tier: "master", medal: "🥈" },
  { rank: 3, name: "QuickFingers", rating: 1823, tier: "diamond", medal: "🥉" },
];

// Dummy user position
const DUMMY_USER: LeaderboardEntry = {
  rank: 47,
  name: "Du",
  rating: 1247,
  tier: "gold",
};

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Short tier names for compact display
const SHORT_TIER_NAMES: Record<RankTier, string> = {
  novice: "NOV",
  bronze: "BRZ",
  silver: "SLV",
  gold: "GLD",
  diamond: "DIA",
  master: "MST",
  grandmaster: "GM",
};

const LeaderboardCard: React.FC = () => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  // Colors
  const cardBg = theme.isDark ? colors.surface : "#FFFFFF";
  const cardBorder = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const dividerColor = theme.isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(0,0,0,0.08)";
  const badgeBg = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : `${progressColor}15`;

  const userTierColor = getRankTierColor(DUMMY_USER.tier);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          shadowColor: theme.isDark ? "transparent" : progressColor,
        },
      ]}
      entering={FadeIn.duration(400).delay(100)}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="award" size={18} color={progressColor} />
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            {t("leaderboard.title", { defaultValue: "Rangliste" })}
          </Text>
        </View>
        <View style={[styles.comingSoonBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.comingSoonText, { color: progressColor }]}>
            {t("leaderboard.comingSoon", { defaultValue: "Demnächst" })}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {/* Top 3 Entries */}
      <View style={styles.entries}>
        {DUMMY_ENTRIES.map((entry, index) => {
          const tierColor = getRankTierColor(entry.tier);
          const tierIcon = getRankTierIcon(entry.tier) as keyof typeof Feather.glyphMap;

          return (
            <Animated.View
              key={entry.rank}
              style={[
                styles.entryRow,
                index < DUMMY_ENTRIES.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: dividerColor,
                },
              ]}
              entering={FadeInDown.duration(300).delay(150 + index * 50)}
            >
              <View style={styles.entryLeft}>
                {/* Medal */}
                <Text style={styles.medal}>{entry.medal}</Text>

                {/* Rank Number */}
                <Text style={[styles.rank, { color: colors.textSecondary }]}>
                  #{entry.rank}
                </Text>

                {/* Tier Badge */}
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: hexToRGBA(tierColor, 0.15) },
                  ]}
                >
                  <Feather name={tierIcon} size={10} color={tierColor} />
                  <Text style={[styles.tierText, { color: tierColor }]}>
                    {SHORT_TIER_NAMES[entry.tier]}
                  </Text>
                </View>

                {/* Name */}
                <Text
                  style={[styles.name, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {entry.name}
                </Text>
              </View>

              {/* Rating */}
              <Text style={[styles.rating, { color: colors.textSecondary }]}>
                {entry.rating}
              </Text>
            </Animated.View>
          );
        })}
      </View>

      {/* Dotted Separator */}
      <View style={styles.dottedSeparator}>
        <Text style={[styles.dots, { color: colors.textSecondary }]}>
          · · · · · · ·
        </Text>
      </View>

      {/* User Position (Highlighted) */}
      <Animated.View
        style={[
          styles.userRow,
          {
            backgroundColor: hexToRGBA(userTierColor, 0.08),
            borderColor: hexToRGBA(userTierColor, 0.3),
          },
        ]}
        entering={FadeInDown.duration(300).delay(350)}
      >
        <View style={styles.userRowContent}>
          <View style={styles.entryLeft}>
            {/* Star icon for user */}
            <Text style={styles.medal}>☆</Text>

            {/* Rank */}
            <Text style={[styles.rank, { color: colors.textSecondary }]}>
              #{DUMMY_USER.rank}
            </Text>

            {/* Tier Badge */}
            <View
              style={[
                styles.tierBadge,
                { backgroundColor: hexToRGBA(userTierColor, 0.15) },
              ]}
            >
              <Feather
                name={getRankTierIcon(DUMMY_USER.tier) as keyof typeof Feather.glyphMap}
                size={10}
                color={userTierColor}
              />
              <Text style={[styles.tierText, { color: userTierColor }]}>
                {SHORT_TIER_NAMES[DUMMY_USER.tier]}
              </Text>
            </View>

            {/* Name */}
            <Text
              style={[styles.name, { color: colors.textPrimary, fontWeight: "600" }]}
            >
              {DUMMY_USER.name}
            </Text>

            {/* "YOU" Badge */}
            <View
              style={[
                styles.youBadge,
                { backgroundColor: hexToRGBA(userTierColor, 0.2) },
              ]}
            >
              <Text style={[styles.youText, { color: userTierColor }]}>
                {t("leaderboard.you", { defaultValue: "DU" })}
              </Text>
            </View>
          </View>

          {/* Rating */}
          <Text style={[styles.rating, { color: userTierColor, fontWeight: "700" }]}>
            {DUMMY_USER.rating}
          </Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default LeaderboardCard;
