// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React, { useEffect } from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  Easing
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Slightly increased size for better visibility
const VISUALIZER_SIZE = 240;

interface DuoBoardVisualizerProps {
  noAnimation?: boolean;
}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = ({
  noAnimation = false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Animation values for subtle breathing effect
  // Start with initial values to avoid empty state
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);
  
  // Start animations when component mounts
  useEffect(() => {
    // Only start animations if noAnimation is false
    if (!noAnimation) {
      // Slow, gentle breathing animation (scale) - more subtle than before
      scale.value = withRepeat(
        withTiming(1.03, { 
          duration: 4000, // Slower breath cycle (4 seconds)
          easing: Easing.bezier(0.4, 0.0, 0.6, 1), // Custom easing for natural breathing
        }),
        -1, // Infinite repetition
        true // Reverse each sequence (in and out)
      );
      
      // Subtle glow effect animation - synchronized with breathing
      glowOpacity.value = withRepeat(
        withTiming(0.5, { 
          duration: 4000, // Same timing as the scale
          easing: Easing.bezier(0.4, 0.0, 0.6, 1), // Same easing
        }),
        -1, // Infinite repetition
        true // Reverse each sequence
      );
    }
  }, [noAnimation]);
  
  // Animated styles
  const breathingStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  const glowStyle = useAnimatedStyle(() => {
    return {
      opacity: glowOpacity.value,
    };
  });

  return (
    <View style={styles.container}>
      
      
      {/* Animated logo with breathing effect - no entrance animation */}
      <Animated.View 
        style={[styles.logoContainer, breathingStyle]}
      >
        <Image
          source={require("@/assets/images/app-logo.png")}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logoContainer: {
    width: VISUALIZER_SIZE,
    height: VISUALIZER_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: "90%",
    height: "90%",
  }
});

export default DuoBoardVisualizer;