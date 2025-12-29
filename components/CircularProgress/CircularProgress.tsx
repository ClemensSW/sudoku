import React, { useEffect } from "react";
import { View, Text, StyleSheet, TextStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  useDerivedValue,
  interpolate,
  Easing,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  value: number;
  radius: number;
  strokeWidth: number;
  duration?: number;
  color?: string;
  inActiveColor?: string;
  textStyle?: TextStyle;
  max?: number;
  showPercentage?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  radius,
  strokeWidth,
  duration = 500,
  color = "#4361EE",
  inActiveColor = "rgba(67, 97, 238, 0.2)",
  textStyle,
  max = 100,
  showPercentage = true,
}) => {
  // Berechne die Eigenschaften des Kreises
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  // Animierte Werte
  const progress = useSharedValue(0);

  // Aktualisiere den Fortschritt, wenn sich der Wert ändert
  useEffect(() => {
    progress.value = withTiming(value / max, {
      duration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [value, max, duration]);

  // Berechne die Strichlänge basierend auf dem Fortschritt
  const animatedStrokeDashoffset = useDerivedValue(() => {
    return interpolate(progress.value, [0, 1], [circumference, 0]);
  });

  // Animierte Props für den Circle
  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: animatedStrokeDashoffset.value,
    };
  });

  // Format für den anzuzeigenden Wert
  const displayValue = Math.round(value);

  return (
    <View style={[styles.container, { width: radius * 2, height: radius * 2 }]}>
      <Svg
        width={radius * 2 + strokeWidth * 2}
        height={radius * 2 + strokeWidth * 2}
        viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}
        style={{ position: "absolute" }}
      >
        {/* Hintergrundkreis (inaktiver Teil) */}
        <Circle
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          stroke={inActiveColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
        />

        {/* Vordergrundkreis (aktiver Teil) */}
        <AnimatedCircle
          cx={halfCircle}
          cy={halfCircle}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${halfCircle}, ${halfCircle}`}
        />
      </Svg>

      {/* Textanzeige in der Mitte - nur wenn showPercentage true ist */}
      {showPercentage && (
        <View style={styles.valueContainer}>
          <Text style={[styles.valueText, textStyle]}>
            {displayValue}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  valueText: {
    // fontSize set dynamically via textStyle prop
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
