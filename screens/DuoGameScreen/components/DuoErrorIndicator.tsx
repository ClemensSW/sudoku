// screens/DuoGameScreen/components/DuoErrorIndicator.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Player themes based on the provided color palette
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    background: "rgba(74, 125, 120, 0.2)",
    heart: "#4A7D78", // Teal - default color
  },
  // Player 2 (top)
  2: {
    background: "rgba(243, 239, 227, 0.2)",
    heart: "#5B5D6E", // Dark blue-gray - default color
  },
};

interface DuoErrorIndicatorProps {
  player: 1 | 2;
  errorsCount: number;
  maxErrors: number;
  compact?: boolean;
}

const DuoErrorIndicator: React.FC<DuoErrorIndicatorProps> = ({
  player,
  errorsCount,
  maxErrors,
  compact = false,
}) => {
  // Get theme for warning color
  const { colors } = useTheme();
  
  // Animation for pulse effect when losing a heart
  const scale = useSharedValue(1);
  const previousErrors = React.useRef(errorsCount);

  // Trigger animation when errors increase
  useEffect(() => {
    if (errorsCount > previousErrors.current) {
      // Pulse animation for losing a heart
      scale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1, { duration: 200 })
      );
      previousErrors.current = errorsCount;
    }
  }, [errorsCount]);

  // Animated style
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Get theme based on player
  const theme = PLAYER_THEMES[player];
  
  // Calculate remaining hearts
  const heartsRemaining = maxErrors - errorsCount;

  // Get heart color based on remaining hearts
  const getHeartColor = (index: number) => {
    // If this is the last heart AND there's only one heart remaining, use warning color
    if (index === 0 && heartsRemaining === 1) {
      return colors.warning; // Match single player warning color
    }
    // Otherwise use the player's theme color
    return theme.heart;
  };

  // Heart size based on compact mode
  const heartSize = compact ? 16 : 20;

  return (
    <Animated.View 
      style={[
        styles.container,
        compact && styles.compactContainer,
        { backgroundColor: compact ? "transparent" : theme.background }
      ]}
      entering={FadeIn.duration(300)}
    >
      <View style={styles.heartsRow}>
        {Array.from({ length: maxErrors }).map((_, index) => {
          // Hearts are filled from right to left (remaining errors)
          const isFilled = index < heartsRemaining;
          
          // Apply animation only to the most recently lost heart
          const isAnimated = index === heartsRemaining;
          
          return (
            <Animated.View
              key={`heart-${index}`}
              style={[
                styles.heartContainer,
                compact && styles.compactHeartContainer,
                isAnimated && animatedStyle,
              ]}
            >
              {isFilled && (
                <Feather
                  name="heart"
                  size={heartSize}
                  color={getHeartColor(index)}
                />
              )}
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: "center",
    margin: 4,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactContainer: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    margin: 0,
    minWidth: 60,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0,
    elevation: 0,
  },
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    marginHorizontal: 3,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  compactHeartContainer: {
    marginHorizontal: 2,
    width: 16,
    height: 16,
  },
});

export default DuoErrorIndicator;