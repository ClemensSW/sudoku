// components/GameCompletion/components/LevelCard/LevelCard.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import { levels as LEVELS } from "../PlayerProgressionCard/utils/levelData";
import { GameStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";
import { hexToRGBA } from "@/screens/GameCompletion/shared/utils/colorUtils";

// Components
import LevelBadge from "./components/LevelBadge";
import TitleSelect from "./components/TitleSelect";
import LevelUpOverlay from "./components/LevelUpOverlay";

// Hooks
import { useLevelAnimations } from "./hooks/useLevelAnimations";

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

  // Progress color
  const progressColor = levelInfo.currentPath.color;

  // Unlocked titles
  const unlockedTitles = LEVELS.slice(0, levelInfo.currentLevel + 1)
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

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
          elevation: theme.isDark ? 0 : 2,
        },
        containerAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Header (Badge + Title) */}
      <View style={[styles.header, { alignItems: "center", marginBottom: 18 }]}>
        <Animated.View style={badgeAnimatedStyle}>
          <LevelBadge
            levelInfo={levelInfo}
            size={compact ? 44 : 56}
            showAnimation={showLevelUpOverlay}
          />
        </Animated.View>

        <View style={styles.levelInfoContainer}>
          <Text style={[styles.levelName, { color: colors.textPrimary }]}>
            {levelInfo.levelData.name}
          </Text>
        </View>
      </View>

      {/* Gain Chip */}
      {(xpGain ?? 0) > 0 && justCompleted && (
        <Animated.View
          style={[
            styles.gainChip,
            {
              backgroundColor: theme.isDark
                ? hexToRGBA(progressColor, 0.9)
                : hexToRGBA(progressColor, 1),
              borderColor: theme.isDark
                ? hexToRGBA(progressColor, 0.55)
                : hexToRGBA(progressColor, 0.35),
            },
            xpGainAnimatedStyle,
          ]}
        >
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text style={[styles.gainChipText, { color: "#FFFFFF" }]}>
            {t('level.xpGain', { count: xpGain })}
          </Text>
        </Animated.View>
      )}

      {/* XP Progress */}
      <View style={styles.progressSection}>
        <View style={[styles.xpInfoRow, { marginBottom: 8 }]}>
          <Text style={[styles.xpText, { color: colors.textPrimary }]}>
            {t('level.title')} {levelInfo.currentLevel + 1}
          </Text>
          {levelInfo.nextLevelData && (
            <Text style={[styles.xpToGo, { color: colors.textSecondary }]}>
              {t('level.xpRemaining', { count: levelInfo.xpForNextLevel })}
            </Text>
          )}
        </View>

        <View style={[styles.progressBarContainer, { height: 12, borderRadius: 6 }]}>
          <View
            style={[
              styles.progressBackground,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(0,0,0,0.06)",
                borderRadius: 6,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            {/* Current Progress */}
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressColor,
                  borderRadius: 6,
                  position: "absolute",
                  height: "100%",
                  left: 0,
                  zIndex: 1,
                },
                progressAnimatedStyle,
              ]}
            />

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
                    borderRadius: 6,
                    left: 0,
                    zIndex: 2,
                  },
                  previousProgressAnimatedStyle,
                ]}
              />
            )}

            {/* XP Gain Highlight */}
            {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    height: "100%",
                    backgroundColor: "#ffffff80",
                    borderRadius: 6,
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
      </View>

      {/* Level Details + Title Selection (Dropdown) */}
      <Pressable
        onPress={toggleLevelDescription}
        accessibilityRole="button"
        accessibilityLabel="Levelbeschreibung und Titel-Auswahl anzeigen oder verbergen"
        hitSlop={8}
        style={({ pressed }) => [
          styles.levelDetailsCard,
          {
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.08)",
            backgroundColor: pressed
              ? theme.isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)"
              : theme.isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
          },
        ]}
      >
        <View style={styles.levelDetailsHeader}>
          <View style={styles.levelDetailsHeaderLeft}>
            <View
              style={[
                styles.levelColorDot,
                { backgroundColor: progressColor },
              ]}
            />
            <Text
              style={[
                styles.levelDetailsTitle,
                { color: colors.textPrimary },
              ]}
            >
              {t('level.yourTitle')}
            </Text>
          </View>
          <Feather
            name={levelDescExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textSecondary}
          />
        </View>

        {levelDescExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.levelDescriptionBody,
              {
                borderLeftColor: progressColor,
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.035)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            {/* Description */}
            <Text
              style={[
                styles.levelMessage,
                { color: colors.textSecondary, marginBottom: 12 },
              ]}
            >
              {levelInfo.levelData.message}
            </Text>

            {/* Current Title */}
            <View style={styles.titleCurrentBlock}>
              <View style={styles.titleCurrentHeader}>
                <Feather name="award" size={16} color={progressColor} />
                <Text
                  style={[
                    styles.titleCurrentText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {t('level.currentTitle')}
                </Text>
              </View>

              <View
                style={[
                  styles.titlePill,
                  {
                    backgroundColor: hexToRGBA(
                      progressColor,
                      theme.isDark ? 0.25 : 0.15
                    ),
                    borderColor: hexToRGBA(
                      progressColor,
                      theme.isDark ? 0.45 : 0.3
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titlePillText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {selectedTitle || "—"}
                </Text>
              </View>
            </View>

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
      </Pressable>

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
