// components/GameCompletion/components/LevelCard/hooks/useLevelAnimations.ts
import React, { useEffect, useRef, useState } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { LevelInfo } from "../../PlayerProgressionCard/utils/types";
import { triggerHaptic } from "@/utils/haptics";
import { ANIMATION_CONFIGS, ANIMATION_DELAYS, ANIMATION_DURATIONS } from "@/screens/GameCompletion/shared/utils/animationUtils";

type UseLevelAnimationsProps = {
  currentXp: number;
  prevXp: number;
  levelInfo: LevelInfo;
  previousLevelInfo: LevelInfo;
  xpGain?: number;
  hasLevelChanged: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
};

export function useLevelAnimations({
  currentXp,
  prevXp,
  levelInfo,
  previousLevelInfo,
  xpGain,
  hasLevelChanged,
  onLevelUp,
}: UseLevelAnimationsProps) {
  // Shared Values - Level-specific only
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const previousProgressWidth = useSharedValue(0);
  const xpGainScale = useSharedValue(1);
  const badgePulse = useSharedValue(1);
  const gainIndicatorOpacity = useSharedValue(0);

  const levelUpTriggered = useRef(false);
  const showLevelUpOverlayValue = useSharedValue(0);

  // Animated Styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const previousProgressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${previousProgressWidth.value}%`,
  }));

  const xpGainAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: xpGainScale.value }],
  }));

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgePulse.value }],
  }));

  const gainIndicatorAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gainIndicatorOpacity.value,
  }));

  // Track level up overlay visibility
  const [showLevelUpOverlay, setShowLevelUpOverlay] = useState(false);

  // Main Animation Effect
  useEffect(() => {
    const prevLevelStartXp = previousLevelInfo.levelData.xp;
    const nextLevelXp =
      previousLevelInfo.nextLevelData?.xp || prevLevelStartXp + 100;
    const prevLevelRange = nextLevelXp - prevLevelStartXp;

    const prevPercentage = hasLevelChanged
      ? 0
      : Math.min(100, ((prevXp - prevLevelStartXp) / prevLevelRange) * 100);

    // Initial setup
    setTimeout(() => {
      previousProgressWidth.value = prevPercentage;
      progressWidth.value = hasLevelChanged ? 0 : prevPercentage;
    }, 50);

    // Progress animation
    setTimeout(() => {
      if (hasLevelChanged) {
        progressWidth.value = withTiming(levelInfo.progressPercentage, {
          duration: ANIMATION_CONFIGS.progressBar.duration,
          easing: ANIMATION_CONFIGS.progressBar.easing,
        });
      } else {
        progressWidth.value = withTiming(levelInfo.progressPercentage, {
          duration: ANIMATION_CONFIGS.progressBar.duration,
          easing: ANIMATION_CONFIGS.progressBar.easing,
        });
        if ((xpGain ?? 0) > 0) {
          setTimeout(() => {
            gainIndicatorOpacity.value = withTiming(1, { duration: 400 });
          }, 200);
        }
      }
    }, ANIMATION_DELAYS.progressBar);

    // Level Up Animation
    const didLevelUp =
      (prevXp !== currentXp || xpGain !== undefined) &&
      levelInfo.currentLevel > previousLevelInfo.currentLevel;

    if (didLevelUp && !levelUpTriggered.current) {
      levelUpTriggered.current = true;
      triggerHaptic("success");

      setTimeout(() => {
        setShowLevelUpOverlay(true);
        showLevelUpOverlayValue.value = 1;

        containerScale.value = withSequence(
          withTiming(1.05, { duration: ANIMATION_CONFIGS.levelUp.duration }),
          withTiming(1, { duration: ANIMATION_CONFIGS.levelUp.duration })
        );
        badgePulse.value = withSequence(
          withTiming(1.2, { duration: ANIMATION_CONFIGS.badgePulse.duration }),
          withTiming(1, { duration: 300 })
        );
      }, ANIMATION_DELAYS.levelUpOverlay);

      onLevelUp?.(previousLevelInfo.currentLevel, levelInfo.currentLevel);

      setTimeout(() => {
        setShowLevelUpOverlay(false);
        showLevelUpOverlayValue.value = 0;
        setTimeout(() => {
          levelUpTriggered.current = false;
        }, 500);
      }, ANIMATION_DURATIONS.levelUpDisplay);
    }
  }, [
    currentXp,
    prevXp,
    levelInfo,
    previousLevelInfo,
    xpGain,
    hasLevelChanged,
    onLevelUp,
  ]);

  return {
    containerAnimatedStyle,
    progressAnimatedStyle,
    previousProgressAnimatedStyle,
    xpGainAnimatedStyle,
    badgeAnimatedStyle,
    gainIndicatorAnimatedStyle,
    progressWidth,
    previousProgressWidth,
    showLevelUpOverlay,
  };
}
