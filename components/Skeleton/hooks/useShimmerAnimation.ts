import { useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

interface UseShimmerAnimationProps {
  duration?: number;
  enabled?: boolean;
}

export function useShimmerAnimation({
  duration = 1500,
  enabled = true,
}: UseShimmerAnimationProps = {}) {
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      shimmerProgress.value = withRepeat(
        withTiming(1, {
          duration,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        false
      );
    }

    return () => {
      cancelAnimation(shimmerProgress);
      shimmerProgress.value = 0;
    };
  }, [enabled, duration, shimmerProgress]);

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: interpolate(
          shimmerProgress.value,
          [0, 1],
          [-200, 200]
        ),
      },
    ],
    opacity: interpolate(
      shimmerProgress.value,
      [0, 0.5, 1],
      [0, 0.4, 0]
    ),
  }));

  return {
    shimmerStyle,
    isAnimating: enabled,
  };
}
