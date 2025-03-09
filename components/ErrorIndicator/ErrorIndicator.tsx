import React from "react";
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
  FadeIn,
} from "react-native-reanimated";
import styles from "./ErrorIndicator.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface ErrorIndicatorProps {
  errorsRemaining: number;
  maxErrors: number;
}

const ErrorIndicator: React.FC<ErrorIndicatorProps> = ({
  errorsRemaining,
  maxErrors,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Animation für das Fehlerindikator-Pulsieren
  const scale = useSharedValue(1);

  // Berechne Animation basierend auf verbleibenden Fehlern
  React.useEffect(() => {
    // Pulsiere, wenn sich die Anzahl der Fehler ändert (außer beim ersten Rendering)
    if (errorsRemaining < maxErrors) {
      scale.value = withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [errorsRemaining]);

  // Animated style für die Pulsation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Farbe basierend auf verbleibenden Fehlern
  const getColor = () => {
    if (errorsRemaining === 0) return colors.error;
    if (errorsRemaining === 1) return colors.warning;
    return colors.primary;
  };

  // Renderbereich für Fehlerindikatoren (Herzen)
  const renderHearts = () => {
    return Array.from({ length: maxErrors }).map((_, index) => {
      const isFilled = index < errorsRemaining;

      return (
        <Animated.View
          key={`heart-${index}`}
          style={[
            styles.heartContainer,
            index === maxErrors - errorsRemaining && animatedStyle,
          ]}
        >
          <Feather
            name={isFilled ? "heart" : "heart"}
            size={20}
            color={isFilled ? getColor() : colors.buttonDisabled}
            style={!isFilled && { opacity: 0.4 }}
          />
        </Animated.View>
      );
    });
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(500)}>
      <View style={styles.heartsRow}>{renderHearts()}</View>
    </Animated.View>
  );
};

export default ErrorIndicator;
