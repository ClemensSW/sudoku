// components/GameCompletion/components/PathCard/hooks/usePathAnimations.ts
import { useEffect } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { ANIMATION_CONFIGS } from "@/screens/GameCompletion/shared/utils/animationUtils";

type UsePathAnimationsProps = {
  currentLevel: number;
  previousLevel: number;
  pathColor: string;
};

export function usePathAnimations({
  currentLevel,
  previousLevel,
  pathColor,
}: UsePathAnimationsProps) {
  // Shared Values - Path-specific only
  const cardScale = useSharedValue(1);
  const trailProgress = useSharedValue(0);

  // Animated Styles
  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const trailAnimatedStyle = useAnimatedStyle(() => ({
    opacity: trailProgress.value,
  }));

  // Main Animation Effect
  useEffect(() => {
    // Card entry animation
    cardScale.value = withSequence(
      withTiming(1.02, {
        duration: ANIMATION_CONFIGS.cardEntry.duration / 2,
        easing: ANIMATION_CONFIGS.cardEntry.easing,
      }),
      withTiming(1, {
        duration: ANIMATION_CONFIGS.cardEntry.duration / 2,
        easing: ANIMATION_CONFIGS.cardEntry.easing,
      })
    );

    // Trail animation
    trailProgress.value = withTiming(1, {
      duration: ANIMATION_CONFIGS.pathTrail.duration,
      easing: ANIMATION_CONFIGS.pathTrail.easing,
    });
  }, [currentLevel, pathColor]);

  // Path change animation
  useEffect(() => {
    if (currentLevel !== previousLevel) {
      cardScale.value = withSequence(
        withTiming(1.05, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [currentLevel, previousLevel]);

  return {
    cardAnimatedStyle,
    trailAnimatedStyle,
  };
}
