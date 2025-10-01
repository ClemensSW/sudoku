// components/GameCompletionModal/components/PlayerProgressionCard/PlayerProgressionCard.tsx
import React, { useState, useEffect } from "react";
import { View, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useLevelInfo } from "./utils/useLevelInfo";
import { levels as LEVELS } from "./utils/levelData";
import { LevelProgressOptions } from "./utils/types";
import { GameStats } from "@/utils/storage";
import { Difficulty } from "@/utils/sudoku";

// Components
import LevelSection from "./components/LevelSection";
import PathSection from "./components/PathSection";
import LevelUpOverlay from "./components/LevelUpOverlay";

// Hooks
import { useProgressAnimations } from "./hooks/useProgressAnimations";
import { useMilestoneHandling } from "./hooks/useMilestoneHandling";

// Styles
import styles from "./PlayerProgressionCard.styles";

// Milestone Levels
const MILESTONE_LEVELS = [5, 10, 15, 20];

interface PlayerProgressionCardProps {
  xp?: number;
  previousXp?: number;
  stats?: GameStats;
  difficulty?: Difficulty | string;
  justCompleted?: boolean;
  xpGain?: number;
  style?: any;
  compact?: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  onPathChange?: (oldPathId: string, newPathId: string) => void;
  onPress?: () => void;
  options?: LevelProgressOptions;
  selectedTitle?: string | null;
  onTitleSelect?: (title: string | null) => void;
}

const PlayerProgressionCard: React.FC<PlayerProgressionCardProps> = ({
  xp,
  previousXp,
  stats,
  difficulty,
  justCompleted = false,
  xpGain,
  style,
  compact = false,
  onLevelUp,
  onPathChange,
  onPress,
  options = {},
  selectedTitle = null,
  onTitleSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Options with defaults
  const defaultOptions: LevelProgressOptions = {
    enableLevelUpAnimation: true,
    usePathColors: true,
    showPathDescription: !compact,
    showMilestones: true,
    textVisibility: "toggle",
    highContrastText: false,
  };
  const finalOptions = { ...defaultOptions, ...options };

  // State
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);
  const [localTitle, setLocalTitle] = useState<string | null>(selectedTitle);

  // Sync local title with prop
  useEffect(() => setLocalTitle(selectedTitle), [selectedTitle]);

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
  const previousLevelInfo =
    prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;

  const hasLevelChanged =
    levelInfo.currentLevel > previousLevelInfo.currentLevel;

  // Progress color
  const progressColor = finalOptions.usePathColors
    ? levelInfo.currentPath.color
    : colors.primary;

  // Animation Hook
  const {
    containerAnimatedStyle,
    progressAnimatedStyle,
    previousProgressAnimatedStyle,
    xpGainAnimatedStyle,
    badgeAnimatedStyle,
    gainIndicatorAnimatedStyle,
    progressWidth,
    previousProgressWidth,
  } = useProgressAnimations({
    currentXp,
    prevXp,
    levelInfo,
    previousLevelInfo,
    xpGain,
    hasLevelChanged,
    enableLevelUpAnimation: finalOptions.enableLevelUpAnimation ?? true,
    onLevelUp,
    onShowLevelUpOverlay: setShowLevelUpOverlay,
  });

  // Milestone Hook
  const {
    showMilestone,
    milestoneMessage,
    milestoneLevel,
    milestoneAnimatedStyle,
    closeMilestone,
  } = useMilestoneHandling({
    levelInfo,
    stats,
    showMilestones: finalOptions.showMilestones ?? true,
    levelUpTriggered: showLevelUpOverlay,
  });

  // Title Selection Handler
  const handleTitlePick = (title: string | null) => {
    setLocalTitle(title);
    onTitleSelect?.(title ?? null);
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <Animated.View
        style={[styles.container, containerAnimatedStyle, style]}
        entering={FadeIn.duration(350)}
      >
        {/* Level Section */}
        <LevelSection
          levelInfo={levelInfo}
          xpGain={xpGain}
          justCompleted={justCompleted}
          compact={compact}
          progressColor={progressColor}
          badgeAnimatedStyle={badgeAnimatedStyle}
          xpGainAnimatedStyle={xpGainAnimatedStyle}
          progressAnimatedStyle={progressAnimatedStyle}
          previousProgressAnimatedStyle={previousProgressAnimatedStyle}
          gainIndicatorAnimatedStyle={gainIndicatorAnimatedStyle}
          hasLevelChanged={hasLevelChanged}
          showLevelUpOverlay={showLevelUpOverlay}
          previousProgressWidth={previousProgressWidth}
          selectedTitle={localTitle}
          onTitleSelect={handleTitlePick}
        />

        {/* Spacer */}
        <View style={{ height: 32 }} />

        {/* Path Section (includes Milestone Notification) */}
        <PathSection
          levelInfo={levelInfo}
          previousLevelInfo={previousLevelInfo}
          progressColor={progressColor}
          showPathDescription={finalOptions.showPathDescription ?? true}
          milestoneLevels={MILESTONE_LEVELS}
          showMilestone={showMilestone}
          milestoneMessage={milestoneMessage}
          milestoneLevel={milestoneLevel}
          onCloseMilestone={closeMilestone}
          textPrimaryColor={colors.textPrimary}
          textSecondaryColor={colors.textSecondary}
          isDark={theme.isDark}
        />

        {/* Level Up Overlay */}
        <LevelUpOverlay
          visible={showLevelUpOverlay}
          levelInfo={levelInfo}
          color={progressColor}
        />
      </Animated.View>
    </Pressable>
  );
};

export default PlayerProgressionCard;
