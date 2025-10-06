// components/GameCompletion/components/PathCard/PathCard.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import { GameStats } from "@/utils/storage";

// Components
import PathTrail from "./components/PathTrail";
import MilestoneNotification from "./components/MilestoneNotification";

// Hooks
import { usePathAnimations } from "./hooks/usePathAnimations";
import { useMilestoneHandling } from "./hooks/useMilestoneHandling";

// Styles
import styles from "./PathCard.styles";

// Milestone Levels
const MILESTONE_LEVELS = [5, 10, 15, 20];

interface PathCardProps {
  xp?: number;
  previousXp?: number;
  stats?: GameStats;
  justCompleted?: boolean;
  xpGain?: number;
  showPathDescription?: boolean;
}

const PathCard: React.FC<PathCardProps> = ({
  xp,
  previousXp,
  stats,
  justCompleted = false,
  xpGain,
  showPathDescription = true,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { t } = useTranslation('gameCompletion');

  // State
  const [pathDescExpanded, setPathDescExpanded] = useState(false);

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

  // Progress color
  const progressColor = levelInfo.currentPath.color;

  // Animation Hooks
  const { cardAnimatedStyle, trailAnimatedStyle } = usePathAnimations({
    currentLevel: levelInfo.currentLevel,
    previousLevel: previousLevelInfo.currentLevel,
    pathColor: progressColor,
  });

  // Milestone Hook
  const {
    showMilestone,
    milestoneMessage,
    milestoneLevel,
    closeMilestone,
  } = useMilestoneHandling({
    levelInfo,
    stats,
    showMilestones: true,
    levelUpTriggered: false, // PathCard doesn't need to wait for level up
  });

  const togglePathDescription = useCallback(() => {
    setPathDescExpanded((s) => !s);
    triggerHaptic("light");
  }, []);

  // Check if description needs fade gradient
  const pathDescription = levelInfo.currentPath.description;
  const needsFade = pathDescription.length > 200;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? "#1a1a1a" : "#ffffff",
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? "transparent" : progressColor,
        },
        cardAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Header Section - minimalistisch */}
      <View style={styles.headerSection}>
        <Feather name="map" size={16} color={progressColor} />
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
          {t('path.title')}
        </Text>
      </View>

      {/* Trail Section - luftig */}
      <View
        style={[
          styles.trailSection,
          {
            borderBottomColor: theme.isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Animated.View style={trailAnimatedStyle}>
          <PathTrail
            color={progressColor}
            isDark={theme.isDark}
            currentLevel={levelInfo.currentLevel}
            previousLevel={previousLevelInfo.currentLevel}
            milestoneLevels={MILESTONE_LEVELS}
          />
        </Animated.View>
      </View>

      {/* Path Details Section - wie "Dein Titel" */}
      {showPathDescription && (
        <View style={styles.pathSection}>
          <Pressable
            onPress={togglePathDescription}
            style={({ pressed }) => [
              styles.pathPressable,
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
            <View style={styles.pathHeader}>
              <View style={styles.pathHeaderLeft}>
                <Feather name="compass" size={16} color={progressColor} />
                <Text style={[styles.pathLabel, { color: colors.textSecondary }]}>
                  {t('path.currentPath')}
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={progressColor} />
            </View>

            {/* Path Name */}
            <Text
              style={[styles.pathName, { color: colors.textPrimary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {levelInfo.currentPath.name}
            </Text>

            {/* Description - expandable with fade */}
            {pathDescExpanded && (
              <Animated.View
                style={styles.pathDescriptionWrapper}
                entering={FadeIn.duration(200)}
              >
                <Text
                  style={[styles.pathDescription, { color: colors.textSecondary }]}
                  numberOfLines={5}
                  ellipsizeMode="tail"
                >
                  {pathDescription}
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

                {/* Rewards Placeholder (für Zukunft) */}
                <View
                  style={[
                    styles.rewardsPlaceholder,
                    {
                      borderColor: theme.isDark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.15)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.comingSoonText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {t('path.rewardsComingSoon')}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Pressable>
        </View>
      )}

      {/* Milestone Notification */}
      {showMilestone && (
        <MilestoneNotification
          visible={showMilestone}
          message={milestoneMessage}
          milestoneLevel={milestoneLevel}
          color={progressColor}
          isDark={theme.isDark}
          onClose={closeMilestone}
          textPrimaryColor={colors.textPrimary}
          textSecondaryColor={colors.textSecondary}
        />
      )}
    </Animated.View>
  );
};

export default React.memo(PathCard);
