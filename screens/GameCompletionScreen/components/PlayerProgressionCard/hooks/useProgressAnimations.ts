// components/GameCompletionModal/components/PlayerProgressionCard/hooks/useProgressAnimations.ts
import { useEffect, useRef } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LevelInfo } from "../utils/types";
import { triggerHaptic } from "@/utils/haptics";

type UseProgressAnimationsProps = {
  currentXp: number;
  prevXp: number;
  levelInfo: LevelInfo;
  previousLevelInfo: LevelInfo;
  xpGain?: number;
  hasLevelChanged: boolean;
  enableLevelUpAnimation: boolean;
  onLevelUp?: (oldLevel: number, newLevel: number) => void;
  onShowLevelUpOverlay: (show: boolean) => void;
};

export function useProgressAnimations({
  currentXp,
  prevXp,
  levelInfo,
  previousLevelInfo,
  xpGain,
  hasLevelChanged,
  enableLevelUpAnimation,
  onLevelUp,
  onShowLevelUpOverlay,
}: UseProgressAnimationsProps) {
  // Shared Values
  const containerScale = useSharedValue(1);
  const progressWidth = useSharedValue(0);
  const previousProgressWidth = useSharedValue(0);
  const xpGainScale = useSharedValue(1);
  const badgePulse = useSharedValue(1);
  const gainIndicatorOpacity = useSharedValue(0);

  const levelUpTriggered = useRef(false);

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
          duration: 1500,
          easing: Easing.bezierFn(0.22, 1, 0.36, 1),
        });
      } else {
        progressWidth.value = withTiming(levelInfo.progressPercentage, {
          duration: 1200,
          easing: Easing.bezierFn(0.34, 1.56, 0.64, 1),
        });
        if ((xpGain ?? 0) > 0) {
          setTimeout(() => {
            gainIndicatorOpacity.value = withTiming(1, { duration: 400 });
          }, 200);
        }
      }
    }, 800);

    // Level Up Animation
    const didLevelUp =
      (prevXp !== currentXp || xpGain !== undefined) &&
      levelInfo.currentLevel > previousLevelInfo.currentLevel;

    if (
      didLevelUp &&
      enableLevelUpAnimation &&
      !levelUpTriggered.current
    ) {
      levelUpTriggered.current = true;
      triggerHaptic("success");

      setTimeout(() => {
        onShowLevelUpOverlay(true);
        containerScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 300 })
        );
        badgePulse.value = withSequence(
          withTiming(1.2, { duration: 500 }),
          withTiming(1, { duration: 300 })
        );
      }, 800);

      onLevelUp?.(previousLevelInfo.currentLevel, levelInfo.currentLevel);

      setTimeout(() => {
        onShowLevelUpOverlay(false);
        setTimeout(() => {
          levelUpTriggered.current = false;
        }, 500);
      }, 4000);
    }
  }, [
    currentXp,
    prevXp,
    levelInfo,
    previousLevelInfo,
    xpGain,
    hasLevelChanged,
    enableLevelUpAnimation,
    onLevelUp,
    containerScale,
    progressWidth,
    previousProgressWidth,
    badgePulse,
    gainIndicatorOpacity,
    xpGainScale,
    onShowLevelUpOverlay,
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
  };
}
