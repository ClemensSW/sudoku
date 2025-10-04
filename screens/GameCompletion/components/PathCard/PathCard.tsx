// components/GameCompletion/components/PathCard/PathCard.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import { GameStats } from "@/utils/storage";
import { hexToRGBA } from "@/screens/GameCompletion/shared/utils/colorUtils";

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

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
          elevation: theme.isDark ? 0 : 2,
        },
        cardAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIconWrap,
              {
                backgroundColor: theme.isDark
                  ? hexToRGBA(progressColor, 0.2)
                  : hexToRGBA(progressColor, 0.12),
                borderColor: theme.isDark
                  ? hexToRGBA(progressColor, 0.35)
                  : hexToRGBA(progressColor, 0.25),
              },
            ]}
          >
            <Feather name="map" size={14} color={progressColor} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Deine Reise
          </Text>
        </View>
      </View>

      {/* Trail */}
      <Animated.View style={trailAnimatedStyle}>
        <PathTrail
          color={progressColor}
          isDark={theme.isDark}
          currentLevel={levelInfo.currentLevel}
          previousLevel={previousLevelInfo.currentLevel}
          milestoneLevels={MILESTONE_LEVELS}
        />
      </Animated.View>

      {/* Path Details (Expandable) */}
      {showPathDescription && (
        <Pressable
          onPress={togglePathDescription}
          accessibilityRole="button"
          accessibilityLabel="Pfaddetails anzeigen oder verbergen"
          style={({ pressed }) => [
            styles.pathDetailsCard,
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
          hitSlop={8}
        >
          <View style={styles.pathDetailsHeader}>
            <View style={styles.pathDetailsHeaderLeft}>
              <View
                style={[
                  styles.pathColorDot,
                  { backgroundColor: progressColor },
                ]}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  { color: colors.textPrimary },
                ]}
              >
                {levelInfo.currentPath.name}
              </Text>
            </View>

            <View style={styles.pathDetailsHeaderRight}>
              <Feather
                name={pathDescExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textSecondary}
              />
            </View>
          </View>

          {pathDescExpanded && (
            <Animated.View
              style={[
                styles.descriptionBody,
                {
                  borderLeftColor: progressColor,
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.035)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
              entering={FadeIn.duration(240)}
            >
              <Text
                style={[
                  styles.descriptionText,
                  { color: colors.textSecondary },
                ]}
              >
                {levelInfo.currentPath.description}
              </Text>
            </Animated.View>
          )}
        </Pressable>
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
