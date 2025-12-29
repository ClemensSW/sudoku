// screens/DuoGameScreen/components/DuoErrorIndicator.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getPlayerErrorIndicatorColors, type DuoPlayerId } from "@/utils/duoColors";
import { useStoredColorHex } from "@/contexts/color/ColorContext";

interface DuoErrorIndicatorProps {
  player: 1 | 2;
  errorsCount: number;
  maxErrors: number;
  compact?: boolean;
  showErrors?: boolean; // Neue Prop für Fehleranzeige
}

const DuoErrorIndicator: React.FC<DuoErrorIndicatorProps> = ({
  player,
  errorsCount,
  maxErrors,
  compact = false,
  showErrors = true, // Standardwert true
}) => {
  // Get theme for warning color and dark mode
  const { colors, typography, isDark } = useTheme();
  const pathColorHex = useStoredColorHex();
  const theme = React.useMemo(
    () => getPlayerErrorIndicatorColors(player as DuoPlayerId, pathColorHex, isDark),
    [player, pathColorHex, isDark]
  );

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
  
  // Calculate remaining hearts
  const heartsRemaining = maxErrors - errorsCount;

  // Get heart color - neutral gray wie normale UI-Icons
  const getHeartColor = () => {
    // Neutral gray - professionell & zurückhaltend (#9AA0A6)
    return theme.heart;
  };

  // Heart size based on compact mode
  const heartSize = compact ? 16 : 20;

  // WENN FEHLER AUSGEBLENDET SIND - Unendlichkeitszeichen anzeigen
  if (!showErrors) {
    return (
      <Animated.View 
        style={[
          styles.container,
          compact && styles.compactContainer,
          { backgroundColor: "transparent" } // Transparenter Hintergrund
        ]}
        entering={FadeIn.duration(300)}
      >
        <View style={styles.heartsRow}>
          {/* Ein Herz mit Unendlichkeitszeichen */}
          <View style={styles.heartContainer}>
            <Feather 
              name="heart" 
              size={heartSize} 
              color={theme.heart} 
            />
          </View>
          <Text
            style={[
              styles.infinityText,
              { color: theme.heart, marginLeft: 4, fontSize: typography.size.xl },
            ]}
          >
            ∞
          </Text>
        </View>
      </Animated.View>
    );
  }

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
                  color={getHeartColor()}
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
  // Stil für das Unendlichkeitssymbol
  infinityText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "bold",
    marginTop: -3, // Leicht angepasst für bessere vertikale Ausrichtung
  },
});

export default DuoErrorIndicator;