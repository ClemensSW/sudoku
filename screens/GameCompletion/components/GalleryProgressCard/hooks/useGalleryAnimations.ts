import { useEffect, useRef } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";

interface UseGalleryAnimationsParams {
  landscape: Landscape;
  newlyUnlockedSegmentId?: number;
  isComplete: boolean;
  isVisible: boolean;
  progressPercentage: number;
}

interface UseGalleryAnimationsResult {
  containerAnimatedStyle: any;
  progressAnimatedStyle: any;
  glowAnimatedStyle: any;
  segmentOpacities: SharedValue<number>[];
  segmentScales: SharedValue<number>[];
}

export const useGalleryAnimations = ({
  landscape,
  newlyUnlockedSegmentId,
  isComplete,
  isVisible,
  progressPercentage,
}: UseGalleryAnimationsParams): UseGalleryAnimationsResult => {
  // Animation values
  const containerScale = useSharedValue(1);
  const segmentOpacities = useRef(
    Array(9)
      .fill(0)
      .map(() => useSharedValue(0))
  ).current;
  const segmentScales = useRef(
    Array(9)
      .fill(0)
      .map(() => useSharedValue(0.8))
  ).current;
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  // Start animation effect - only when visible
  useEffect(() => {
    if (!isVisible) return;

    // Container light scaling
    containerScale.value = withSequence(
      withTiming(1.02, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );

    // Animate progress bar
    progressWidth.value = withTiming(progressPercentage, { duration: 1000 });

    // Animate segments
    landscape.segments.forEach((segment, index) => {
      if (segment.isUnlocked) {
        const delay = index * 50;

        // Opacity animation
        segmentOpacities[index].value = withDelay(
          delay,
          withTiming(1, { duration: 500 })
        );

        // Scale animation (bounce effect)
        segmentScales[index].value = withDelay(
          delay,
          withSpring(1, {
            damping: 10,
            stiffness: 80,
          })
        );
      } else {
        segmentOpacities[index].value = withTiming(0);
        segmentScales[index].value = withTiming(0.8);
      }
    });

    // Special animation for newly unlocked segment
    if (newlyUnlockedSegmentId !== undefined) {
      const segmentIndex = newlyUnlockedSegmentId;
      const delayAmount = 800;

      segmentOpacities[segmentIndex].value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(delayAmount, withTiming(1, { duration: 600 }))
      );

      segmentScales[segmentIndex].value = withSequence(
        withTiming(0.5, { duration: 0 }),
        withDelay(
          delayAmount,
          withSpring(1, {
            damping: 8,
            stiffness: 100,
          })
        )
      );
    }

    // Completion glow animation
    if (isComplete) {
      glowOpacity.value = withSequence(
        withDelay(1000, withTiming(1, { duration: 600 })),
        withTiming(0.5, { duration: 800 })
      );
    }
  }, [isVisible, landscape, newlyUnlockedSegmentId, progressPercentage, isComplete]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return {
    containerAnimatedStyle,
    progressAnimatedStyle,
    glowAnimatedStyle,
    segmentOpacities,
    segmentScales,
  };
};
