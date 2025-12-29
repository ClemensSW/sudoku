// screens/Duo/components/DuoTutorialOverlay/DuoTutorialOverlay.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, Pressable } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import { RankTier, getRankTierName } from "@/utils/elo/eloCalculator";
import { getLeagueColors } from "@/utils/elo/leagueColors";

// SVG Icons
import UnterstutzungIcon from "@/assets/svg/unterstutzung.svg";
import HappyIcon from "@/assets/svg/happy.svg";
import ZielIcon from "@/assets/svg/ziel.svg";
import SilverBadgeIcon from "@/assets/svg/silver-badge.svg";

import styles from "./DuoTutorialOverlay.styles";

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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

// All ranks ordered from highest to lowest
const ALL_RANKS: RankTier[] = [
  "grandmaster",
  "master",
  "diamond",
  "gold",
  "silver",
  "bronze",
  "novice",
];

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

interface Feature {
  icon: React.FC<{ width: number; height: number; fill?: string }>;
  titleKey: string;
  descriptionKey: string;
}

// Get rank icon - SilverBadgeIcon for silver, Feather placeholders for others
const getRankIcon = (rankTier: RankTier): { type: "svg" | "feather"; name?: string; component?: React.FC<{ width: number; height: number }> } => {
  switch (rankTier) {
    case "silver":
      return { type: "svg", component: SilverBadgeIcon };
    case "grandmaster":
    case "master":
    case "gold":
    case "bronze":
      return { type: "feather", name: "award" };
    case "diamond":
      return { type: "feather", name: "hexagon" };
    case "novice":
      return { type: "feather", name: "circle" };
    default:
      return { type: "feather", name: "circle" };
  }
};

interface DuoTutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
  elo?: number;
}

const DuoTutorialOverlay: React.FC<DuoTutorialOverlayProps> = ({
  visible,
  onClose,
  elo = 1247,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const { tier, colors: leagueColors } = useCurrentLeague();

  // Multi-page state
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = 2;

  // Page titles
  const pageTitles = [
    t("features.title", { defaultValue: "So funktioniert's" }),
    t("tutorial.leagues.title", { defaultValue: "Das Liga-System" }),
  ];

  // Hide/show bottom nav when overlay opens/closes
  useEffect(() => {
    if (visible) {
      hideBottomNav();
      setCurrentPage(0); // Reset to first page when opening
    } else {
      resetBottomNav();
    }

    return () => {
      if (visible) {
        resetBottomNav();
      }
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  // Navigation handlers
  const goNext = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
    } else {
      onClose();
    }
  }, [currentPage, totalPages, onClose]);

  const goBack = useCallback(() => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  // Features content
  const features: Feature[] = [
    {
      icon: UnterstutzungIcon,
      titleKey: "features.items.playTogether.title",
      descriptionKey: "features.items.playTogether.description",
    },
    {
      icon: HappyIcon,
      titleKey: "features.items.challengingLayout.title",
      descriptionKey: "features.items.challengingLayout.description",
    },
    {
      icon: ZielIcon,
      titleKey: "features.items.strategyTeamwork.title",
      descriptionKey: "features.items.strategyTeamwork.description",
    },
  ];

  // Calculate points to next tier
  const nextTier = NEXT_TIER[tier];
  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - elo : 0;

  if (!visible) return null;

  // Render Features Page (Page 0)
  const renderFeaturesPage = () => (
    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <Animated.View
            key={`feature-${index}`}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.surface,
                borderColor: hexToRGBA(leagueColors.primary, theme.isDark ? 0.15 : 0.1),
                borderWidth: 1,
              },
            ]}
            entering={FadeInDown.duration(300).delay(100 * index)}
          >
            <View
              style={[
                styles.featureIconContainer,
                { backgroundColor: hexToRGBA(leagueColors.accent, theme.isDark ? 0.2 : 0.12) },
              ]}
            >
              <IconComponent width={32} height={32} fill={leagueColors.accent} />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
                {t(feature.titleKey)}
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                {t(feature.descriptionKey)}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </ScrollView>
  );

  // Render Leagues Page (Page 1)
  const renderLeaguesPage = () => (
    <ScrollView
      style={styles.scrollContent}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Intro text */}
      <Text style={[styles.leagueIntro, { color: colors.textSecondary }]}>
        {t("tutorial.leagues.intro", { defaultValue: "Steige durch 7 Ränge auf:" })}
      </Text>

      {/* Ranks list */}
      <View
        style={[
          styles.ranksContainer,
          {
            backgroundColor: colors.surface,
            borderColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {ALL_RANKS.map((rankTier, index) => {
          const isCurrentTier = tier === rankTier;
          const rankColors = getLeagueColors(rankTier, theme.isDark);
          const threshold = TIER_THRESHOLDS[rankTier];
          const icon = getRankIcon(rankTier);

          return (
            <Animated.View
              key={rankTier}
              style={[
                styles.rankRow,
                isCurrentTier && {
                  backgroundColor: hexToRGBA(rankColors.primary, theme.isDark ? 0.15 : 0.1),
                  borderRadius: 12,
                  marginHorizontal: -8,
                  paddingHorizontal: 8,
                },
                index < ALL_RANKS.length - 1 && !isCurrentTier && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.04)",
                },
              ]}
              entering={FadeInDown.duration(300).delay(50 * index)}
            >
              {/* Rank icon container */}
              <View
                style={[
                  styles.rankIconContainer,
                  { backgroundColor: hexToRGBA(rankColors.primary, theme.isDark ? 0.2 : 0.12) },
                ]}
              >
                {icon.type === "svg" && icon.component ? (
                  <icon.component width={22} height={22} />
                ) : (
                  <Feather
                    name={icon.name as any}
                    size={16}
                    color={rankColors.primary}
                  />
                )}
              </View>

              {/* Rank name */}
              <Text
                style={[
                  styles.rankName,
                  {
                    color: isCurrentTier ? rankColors.primary : colors.textPrimary,
                    fontWeight: isCurrentTier ? "700" : "500",
                  },
                ]}
              >
                {t(`rank.${rankTier}`, { defaultValue: getRankTierName(rankTier) })}
              </Text>

              {/* ELO threshold */}
              <Text
                style={[
                  styles.rankElo,
                  { color: isCurrentTier ? rankColors.accent : colors.textSecondary },
                ]}
              >
                {threshold}+ ELO
              </Text>

              {/* Current tier indicator */}
              {isCurrentTier && (
                <View style={styles.currentIndicator}>
                  <Feather name="arrow-left" size={14} color={rankColors.primary} />
                </View>
              )}
            </Animated.View>
          );
        })}
      </View>

      {/* Current rank info */}
      <Animated.View
        style={[
          styles.currentRankCard,
          {
            backgroundColor: hexToRGBA(leagueColors.primary, theme.isDark ? 0.12 : 0.08),
            borderColor: hexToRGBA(leagueColors.primary, theme.isDark ? 0.25 : 0.2),
          },
        ]}
        entering={FadeInDown.duration(300).delay(400)}
      >
        <View style={styles.currentRankBadge}>
          <SilverBadgeIcon width={36} height={36} />
        </View>
        <View style={styles.currentRankText}>
          <Text style={[styles.currentRankLabel, { color: colors.textSecondary }]}>
            {t("tutorial.leagues.currentRank", { defaultValue: "Dein aktueller Rang:" })}
          </Text>
          <Text
            style={[
              styles.currentRankValue,
              { color: theme.isDark ? leagueColors.primary : leagueColors.accent },
            ]}
          >
            {t(`rank.${tier}`, { defaultValue: getRankTierName(tier) }).toUpperCase()}
          </Text>
          {nextTier && (
            <Text style={[styles.pointsToNext, { color: colors.textSecondary }]}>
              {t("tutorial.leagues.pointsToNext", {
                defaultValue: "{{points}} Punkte bis {{rank}}",
                points: pointsToNext,
                rank: t(`rank.${nextTier}`, { defaultValue: getRankTierName(nextTier) }),
              })}
            </Text>
          )}
        </View>
      </Animated.View>
    </ScrollView>
  );

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.background }]}
      entering={FadeIn.duration(250)}
    >
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}
      >
        <View style={styles.headerSpacer} />

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {pageTitles[currentPage]}
        </Text>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Dot Indicators - positioned under header */}
      <View style={styles.progressContainer}>
        {Array.from({ length: totalPages }).map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[
              styles.dot,
              {
                backgroundColor:
                  index === currentPage
                    ? leagueColors.accent
                    : theme.isDark
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(0,0,0,0.12)",
                transform: [{ scale: index === currentPage ? 1.2 : 1 }],
              },
            ]}
          />
        ))}
      </View>

      {/* Page Content */}
      {currentPage === 0 && renderFeaturesPage()}
      {currentPage === 1 && renderLeaguesPage()}

      {/* Footer with Buttons */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 8, 24) },
        ]}
      >
        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Back Button (only on page > 0) */}
          {currentPage > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.backButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: theme.isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.1)",
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={goBack}
            >
              <Text style={[styles.backButtonText, { color: colors.textPrimary }]}>
                {t("tutorial.back", { defaultValue: "Zurück" })}
              </Text>
            </Pressable>
          )}

          {/* Next/Understood Button */}
          <Pressable
            style={({ pressed }) => [
              styles.nextButton,
              currentPage > 0 && styles.nextButtonWithBack,
              {
                backgroundColor: leagueColors.accent,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={goNext}
          >
            <Text style={[styles.nextButtonText, { color: leagueColors.text }]}>
              {currentPage === totalPages - 1
                ? t("tutorial.understood", { defaultValue: "Verstanden" })
                : t("tutorial.next", { defaultValue: "Weiter" })}
            </Text>
            {currentPage < totalPages - 1 && (
              <Feather name="chevron-right" size={20} color={leagueColors.text} />
            )}
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

export default DuoTutorialOverlay;
