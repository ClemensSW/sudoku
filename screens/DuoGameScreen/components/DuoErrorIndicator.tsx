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

// Player themes based on the provided color palette - VERBESSERTE KONTRASTE
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    background: "rgba(74, 125, 120, 0.2)", // Erhöhter Kontrast (0.1 -> 0.2)
    heart: {
      active: "#4A7D78", // Teal
      inactive: "rgba(255, 100, 100, 0.85)", // Red with opacity
    },
  },
  // Player 2 (top)
  2: {
    background: "rgba(243, 239, 227, 0.2)", // Erhöhter Kontrast (0.1 -> 0.2)
    heart: {
      active: "#5B5D6E", // Dark blue-gray
      inactive: "rgba(255, 100, 100, 0.85)", // Red with opacity
    },
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

  // Heart size based on compact mode
  const heartSize = compact ? 16 : 20;

  // WICHTIG: Player 2 braucht eine GEGENDREHUNG, da der Container bereits gedreht ist
  // Wir drehen den Indikator für Player 2 um 180° zurück, damit die Herzen richtig ausgerichtet sind
  return (
    <Animated.View 
      style={[
        styles.container,
        compact && styles.compactContainer,
        { backgroundColor: compact ? "transparent" : theme.background },
        // Wichtig: Counter-Rotation für Spieler 2, da der übergeordnete Container
        // bereits um 180° gedreht ist
        player === 2 && styles.counterRotatedContainer
      ]}
      entering={FadeIn.duration(300)}
    >
      <View style={styles.heartsRow}>
        {Array.from({ length: maxErrors }).map((_, index) => {
          // Hearts are filled from left to right
          const isLost = index < errorsCount;
          
          // Apply animation only to the most recently lost heart
          const isAnimated = index === errorsCount - 1;
          
          return (
            <Animated.View
              key={`heart-${index}`}
              style={[
                styles.heartContainer,
                compact && styles.compactHeartContainer,
                isAnimated && animatedStyle,
              ]}
            >
              <Feather
                name="heart"
                size={heartSize}
                color={isLost ? theme.heart.inactive : theme.heart.active}
                style={{ opacity: isLost ? 1 : 0.85 }}
              />
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
    alignSelf: "center", // Better centering
    margin: 4,
    justifyContent: "center", // Vertically center hearts
    // Schatten für bessere Sichtbarkeit
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
    minWidth: 60, // Ensure enough space for hearts
    alignItems: "center", // Center horizontally
    justifyContent: "center", // Center vertically
    // Schatten für den Kompakt-Modus entfernen
    shadowOpacity: 0,
    elevation: 0,
  },
  // Gegen-Rotation für Spieler 2
  counterRotatedContainer: {
    transform: [{ rotate: "180deg" }], // Vollständige Rotation, um die 180°-Drehung des übergeordneten Containers zu kompensieren
  },
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    marginHorizontal: 3,
  },
  compactHeartContainer: {
    marginHorizontal: 2,
  },
});

export default DuoErrorIndicator;