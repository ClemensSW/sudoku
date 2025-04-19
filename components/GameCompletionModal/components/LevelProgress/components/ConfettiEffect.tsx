// components/GameCompletionModal/components/LevelProgress/components/ConfettiEffect.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";

interface ConfettiParticleProps {
  delay: number;
  duration: number;
  startX: number;
  color: string;
  size: number;
  shape?: "circle" | "square" | "triangle";
}

interface ConfettiEffectProps {
  active: boolean;
  count?: number;
  duration?: number;
  colors?: string[];
}

// Single confetti particle component
const ConfettiParticle: React.FC<ConfettiParticleProps> = ({
  delay,
  duration,
  startX,
  color,
  size,
  shape = "square"
}) => {
  // Animation values
  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  
  useEffect(() => {
    // Initial opacity and scale
    opacity.value = withDelay(delay, withTiming(1, { duration: 200 }));
    scale.value = withDelay(delay, withTiming(1, { duration: 300 }));
    
    // Fall down with gravity effect
    translateY.value = withDelay(
      delay,
      withTiming(300, { 
        duration: duration, 
        easing: Easing.bezier(0.2, 0.8, 0.4, 1)
      })
    );
    
    // Swaying motion
    translateX.value = withDelay(
      delay,
      withSequence(
        withTiming(startX + (Math.random() * 40 - 20), { 
          duration: duration / 3, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        }),
        withTiming(startX + (Math.random() * 40 - 20), { 
          duration: duration / 3, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        }),
        withTiming(startX + (Math.random() * 40 - 20), { 
          duration: duration / 3, 
          easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        })
      )
    );
    
    // Rotation for spinning effect
    rotate.value = withDelay(
      delay,
      withTiming(2 * Math.PI * (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1), {
        duration: duration,
        easing: Easing.linear
      })
    );
    
    // Fade out at the end
    opacity.value = withDelay(
      delay + duration - 500,
      withTiming(0, { duration: 500 })
    );
    
  }, [delay, duration, startX]);
  
  // Animated style for the particle
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
        { rotate: `${rotate.value}rad` },
        { scale: scale.value },
      ],
      opacity: opacity.value,
    };
  });
  
  // Get shape style based on shape property - FIX: Use as 'solid' to fix TypeScript error
  const getShapeStyle = () => {
    switch (shape) {
      case "circle":
        return { borderRadius: size / 2 };
      case "triangle":
        return { 
          width: 0,
          height: 0,
          backgroundColor: 'transparent',
          borderStyle: 'solid' as 'solid',
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
        };
      default:
        return {}; // square is default
    }
  };
  
  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          width: size,
          height: size,
          backgroundColor: shape === "triangle" ? "transparent" : color,
        },
        getShapeStyle(),
        animatedStyle,
      ]}
    />
  );
};

// Main Confetti Effect component
const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active,
  count = 30,
  duration = 3000,
  colors = ["#1abc9c", "#3498db", "#f1c40f", "#e74c3c", "#9b59b6", "#2ecc71"],
}) => {
  // Don't render if not active
  if (!active) return null;
  
  // Generate confetti particles
  const particles = Array.from({ length: count }).map((_, index) => {
    // Random properties for each particle
    const delay = Math.random() * 500; // staggered start
    const particleDuration = duration - delay;
    const startX = Math.random() * 250 - 125; // random X within -125 to 125
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 8 + 5; // between 5 and 13
    const shapes = ["circle", "square", "triangle"] as const;
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    
    return (
      <ConfettiParticle
        key={index}
        delay={delay}
        duration={particleDuration}
        startX={startX}
        color={color}
        size={size}
        shape={shape}
      />
    );
  });
  
  return (
    <View style={styles.container} pointerEvents="none">
      {particles}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    zIndex: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfettiEffect;