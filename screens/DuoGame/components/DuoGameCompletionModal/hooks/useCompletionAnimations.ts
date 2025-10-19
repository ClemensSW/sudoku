// screens/DuoGame/components/DuoGameCompletionModal/hooks/useCompletionAnimations.ts
import { useEffect } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";

export const useCompletionAnimations = (
  visible: boolean,
  winner: 0 | 1 | 2
) => {
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const player1Scale = useSharedValue(0.9);
  const player2Scale = useSharedValue(0.9);
  const vsScale = useSharedValue(0.5);
  const trophy1Scale = useSharedValue(1);
  const trophy2Scale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);

  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      opacity.value = 0;
      scale.value = 0.95;
      player1Scale.value = 0.9;
      player2Scale.value = 0.9;
      vsScale.value = 0.5;
      buttonOpacity.value = 0;

      // Sequence the animations
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
      });

      // Player panels animation with slight delay between them
      player1Scale.value = withDelay(
        200,
        withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
        })
      );

      player2Scale.value = withDelay(
        300,
        withTiming(1, {
          duration: 600,
          easing: Easing.out(Easing.back(1.5)),
        })
      );

      // VS animation
      vsScale.value = withDelay(
        500,
        withTiming(1, {
          duration: 400,
          easing: Easing.out(Easing.back(2)),
        })
      );

      // Trophy animations
      if (winner === 1 || winner === 0) {
        trophy1Scale.value = withDelay(
          800,
          withSequence(
            withTiming(1.3, { duration: 300 }),
            withTiming(1, { duration: 200 })
          )
        );
      }

      if (winner === 2 || winner === 0) {
        trophy2Scale.value = withDelay(
          900,
          withSequence(
            withTiming(1.3, { duration: 300 }),
            withTiming(1, { duration: 200 })
          )
        );
      }

      // Buttons fade in last
      buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));

      // Trigger haptic feedback
      triggerHaptic("success");
    }
  }, [visible, winner]);

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const player1Style = useAnimatedStyle(() => ({
    transform: [{ scale: player1Scale.value }],
  }));

  const player2Style = useAnimatedStyle(() => ({
    transform: [{ scale: player2Scale.value }],
  }));

  const trophy1Style = useAnimatedStyle(() => ({
    transform: [{ scale: trophy1Scale.value }],
  }));

  const trophy2Style = useAnimatedStyle(() => ({
    transform: [{ scale: trophy2Scale.value }],
  }));

  return {
    containerStyle,
    player1Style,
    player2Style,
    trophy1Style,
    trophy2Style,
    vsScale,
    buttonOpacity,
    // Expose SharedValues for PlayerCard
    player1Scale,
    player2Scale,
    trophy1Scale,
    trophy2Scale,
  };
};
