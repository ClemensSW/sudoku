// components/GameCompletion/components/LevelCard/LevelCard.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn, useSharedValue, useAnimatedStyle, withSequence, withTiming, withRepeat, Easing } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import { getLevels } from "../PlayerProgressionCard/utils/levelData";
import { GameStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";
import { hexToRGBA } from "@/screens/GameCompletion/shared/utils/colorUtils";

// Components
import LevelBadge from "./components/LevelBadge";
import TitleSelect from "./components/TitleSelect";
import LevelUpOverlay from "./components/LevelUpOverlay";

// Hooks
import { useLevelAnimations } from "./hooks/useLevelAnimations";
import { useProgressColor } from "@/hooks/useProgressColor";

// Styles
import styles from "./LevelCard.styles";

interface LevelCardProps {
  xp?: number;
  previousXp?: number;
  stats?: GameStats;
  difficulty?: Difficulty | string;
  justCompleted?: boolean;
  xpGain?: number;
  compact?: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  selectedTitle?: string | null;
  onTitleSelect?: (title: string | null) => void;
}

const LevelCard: React.FC<LevelCardProps> = ({
  xp,
  previousXp,
  stats,
  difficulty,
  justCompleted = false,
  xpGain,
  compact = false,
  onLevelUp,
  selectedTitle = null,
  onTitleSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { t } = useTranslation('gameCompletion');

  // State
  const [levelDescExpanded, setLevelDescExpanded] = useState(false);

  // Calculate XP values
  const calculatedXp = stats ? stats.totalXP : 0;
  const currentXp = xp !== undefined ? xp : calculatedXp;
  const prevXp =
    previousXp !== undefined
      ? previousXp
      : justCompleted && (xpGain ?? 0) > 0
      ? currentXp - (xpGain ?? 0)
      : currentXp;

  // Level Info
  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo = prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;

  const hasLevelChanged = levelInfo.currentLevel > previousLevelInfo.currentLevel;

  // Progress color - use custom selected color or default path color
  const progressColor = useProgressColor(currentXp);

  // Unlocked titles - call getLevels() to get fresh translations
  const unlockedTitles = getLevels().slice(0, levelInfo.currentLevel + 1)
    .map((l) => l.name)
    .reverse();

  // Animation Hook
  const {
    containerAnimatedStyle,
    progressAnimatedStyle,
    previousProgressAnimatedStyle,
    xpGainAnimatedStyle,
    badgeAnimatedStyle,
    gainIndicatorAnimatedStyle,
    previousProgressWidth,
    showLevelUpOverlay,
  } = useLevelAnimations({
    currentXp,
    prevXp,
    levelInfo,
    previousLevelInfo,
    xpGain,
    hasLevelChanged,
    onLevelUp,
  });

  const toggleLevelDescription = useCallback(() => {
    setLevelDescExpanded((s) => !s);
    triggerHaptic("light");
  }, []);

  // Get title description based on selected title
  const getTitleDescription = (): string => {
    if (!selectedTitle) {
      // Fallback to current level message
      return levelInfo.levelData.message;
    }

    // Find selected title in levels
    const allLevels = getLevels();
    const titleLevel = allLevels.find(l => l.name === selectedTitle);
    return titleLevel?.message || levelInfo.levelData.message;
  };

  const titleDescription = getTitleDescription();
  const needsFade = titleDescription.length > 120;

  // Helper function to darken color
  const darkenColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Shimmer animation for progress bar
  const shimmerTranslateX = useSharedValue(-100);

  React.useEffect(() => {
    if (justCompleted && (xpGain ?? 0) > 0) {
      shimmerTranslateX.value = withRepeat(
        withSequence(
          withTiming(100, { duration: 1500, easing: Easing.linear }),
          withTiming(-100, { duration: 0 })
        ),
        3,
        false
      );
    }
  }, [justCompleted, xpGain]);

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmerTranslateX.value }],
  }));

  // Removed: XP calculations no longer needed (simplified design)

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? "transparent" : progressColor,
        },
        containerAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Hero Header with Gradient Background */}
      <LinearGradient
        colors={
          theme.isDark
            ? [hexToRGBA(progressColor, 0.15), hexToRGBA(progressColor, 0.05)]
            : [hexToRGBA(progressColor, 0.08), hexToRGBA(progressColor, 0.02)]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.heroHeader}
      >
        {/* Badge (no glow - removed) */}
        <View style={styles.badgeContainer}>
          <Animated.View style={badgeAnimatedStyle}>
            <LevelBadge
              levelInfo={levelInfo}
              size={72}
              showAnimation={showLevelUpOverlay}
            />
          </Animated.View>
        </View>

        {/* Title */}
        <Text style={[styles.levelTitle, { color: colors.textPrimary }]}>
          {levelInfo.levelData.name}
        </Text>

        {/* Subtitle - Nur Level-Nummer */}
        <Text style={[styles.levelSubtitle, { color: colors.textSecondary }]}>
          {t('level.title')} {levelInfo.currentLevel + 1}
        </Text>
      </LinearGradient>

      {/* XP Progress Section */}
      <View
        style={[
          styles.progressSection,
          {
            borderBottomColor: theme.isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        {/* XP Header */}
        <View style={styles.progressHeader}>
          <Text style={[styles.xpValueText, { color: colors.textPrimary }]}>
            {(currentXp - levelInfo.levelData.xp).toLocaleString()} / {((levelInfo.nextLevelData?.xp ?? levelInfo.levelData.xp) - levelInfo.levelData.xp).toLocaleString()} EP
          </Text>
        </View>

        {/* Progress Bar Row (Bar + Badge inline) */}
        <View style={styles.progressBarRow}>
          {/* Progress Bar with Gradient */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBackground,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.10)"
                    : "rgba(0,0,0,0.06)",
                },
              ]}
            >
              {/* Previous Progress (dimmed) */}
              {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      height: "100%",
                      backgroundColor: theme.isDark
                        ? `${progressColor}40`
                        : `${progressColor}30`,
                      borderRadius: 8,
                      left: 0,
                      zIndex: 2,
                    },
                    previousProgressAnimatedStyle,
                  ]}
                />
              )}

              {/* Current Progress with Gradient */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    height: "100%",
                    left: 0,
                    zIndex: 1,
                    borderRadius: 8,
                    overflow: "hidden",
                  },
                  progressAnimatedStyle,
                ]}
              >
                <LinearGradient
                  colors={[progressColor, darkenColor(progressColor, 40)]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {/* Shimmer Effect */}
                  {justCompleted && (xpGain ?? 0) > 0 && (
                    <Animated.View
                      style={[
                        styles.progressShimmer,
                        shimmerAnimatedStyle,
                      ]}
                    />
                  )}
                </LinearGradient>
              </Animated.View>

              {/* XP Gain Highlight */}
              {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      height: "100%",
                      backgroundColor: "#ffffff80",
                      borderRadius: 8,
                      left: `${previousProgressWidth.value}%`,
                      width: `${
                        levelInfo.progressPercentage - previousProgressWidth.value
                      }%`,
                      zIndex: 3,
                      opacity: 1,
                    },
                    gainIndicatorAnimatedStyle,
                  ]}
                />
              )}
            </View>
          </View>

          {/* XP Gain Badge - Inline */}
          {(xpGain ?? 0) > 0 && justCompleted && (
            <Animated.View
              style={[
                styles.xpGainBadge,
                {
                  backgroundColor: progressColor,
                  shadowColor: progressColor,
                },
                xpGainAnimatedStyle,
              ]}
            >
              <Text style={styles.xpGainNumber}>+{xpGain}</Text>
              <Text style={styles.xpGainLabel}>EP</Text>
            </Animated.View>
          )}
        </View>

        {/* Next Level Preview - Neutral Design */}
        {levelInfo.nextLevelData && (
          <View
            style={[
              styles.nextLevelCard,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255, 255, 255, 0.04)"
                  : "rgba(0, 0, 0, 0.03)",
                borderColor: theme.isDark
                  ? "rgba(255, 255, 255, 0.1)"
                  : "rgba(0, 0, 0, 0.06)",
                borderLeftColor: progressColor,
              },
            ]}
          >
            <View style={styles.nextLevelHeader}>
              <Feather name="arrow-right-circle" size={16} color={progressColor} />
              <Text style={[styles.nextLevelHeaderText, { color: colors.textSecondary }]}>
                {t('level.nextLevel')}
              </Text>
            </View>
            <Text style={[styles.nextLevelTitle, { color: colors.textPrimary }]}>
              {t('level.title')} {levelInfo.currentLevel + 2} • {levelInfo.nextLevelData.name}
            </Text>
            <Text style={[styles.nextLevelXp, { color: colors.textSecondary }]}>
              {t('level.xpToUnlock', { count: levelInfo.xpForNextLevel })}
            </Text>
          </View>
        )}
      </View>

      {/* Title Section - Fully Tappable */}
      <View style={styles.titleSection}>
        <Pressable
          onPress={toggleLevelDescription}
          style={({ pressed }) => [
            styles.titlePressable,
            {
              backgroundColor: pressed
                ? theme.isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
            },
          ]}
        >
          {/* Header: Label + Chevron */}
          <View style={styles.titleHeader}>
            <View style={styles.titleHeaderLeft}>
              <Feather name="award" size={16} color={progressColor} />
              <Text style={[styles.titleLabel, { color: colors.textSecondary }]}>
                {t('level.yourTitleLabel')}
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color={progressColor} />
          </View>

          {/* Title Value */}
          <Text
            style={[styles.titleValue, { color: colors.textPrimary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectedTitle || t('level.chooseTitle')}
          </Text>

          {/* Title Description - Always visible, 3 lines max with fade */}
          <View style={styles.titleDescriptionWrapper}>
            <Text
              style={[styles.titleDescription, { color: colors.textSecondary }]}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {titleDescription}
            </Text>

            {/* Fade gradient for long texts */}
            {needsFade && (
              <LinearGradient
                colors={[
                  "transparent",
                  theme.isDark ? "#1a1a1a" : "#ffffff",
                ]}
                style={styles.descriptionFade}
                pointerEvents="none"
              />
            )}
          </View>
        </Pressable>

        {/* Title Selection Sheet (expandable) */}
        {levelDescExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.levelDetailsCard,
              {
                borderColor: theme.isDark
                  ? "rgba(255,255,255,0.12)"
                  : "rgba(0,0,0,0.08)",
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.03)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            {/* Title Selection */}
            <TitleSelect
              titles={unlockedTitles}
              selected={selectedTitle}
              onSelect={onTitleSelect || (() => {})}
              color={progressColor}
              isDark={theme.isDark}
            />
          </Animated.View>
        )}
      </View>

      {/* Level Up Overlay - SCOPED TO THIS CARD ONLY ✅ */}
      <LevelUpOverlay
        visible={showLevelUpOverlay}
        levelInfo={levelInfo}
        color={progressColor}
      />
    </Animated.View>
  );
};

export default React.memo(LevelCard);
