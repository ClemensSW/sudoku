// screens/DuoGame/components/DuoGameCompletionModal/components/DuoProgressBar.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Helper to darken a hex color
function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max((num >> 16) - amt, 0);
  const G = Math.max(((num >> 8) & 0x00ff) - amt, 0);
  const B = Math.max((num & 0x0000ff) - amt, 0);
  return `#${((1 << 24) | (R << 16) | (G << 8) | B).toString(16).slice(1)}`;
}

interface DuoProgressBarProps {
  percentage: number;
  color?: string;
  gradient?: [string, string]; // Liga-Gradient [primary, accent]
  height?: number;
  showLabel?: boolean;
  animated?: boolean;
}

const DuoProgressBar: React.FC<DuoProgressBarProps> = ({
  percentage,
  color = "#888888",
  gradient,
  height = 10,
  showLabel = true,
  animated = true,
}) => {
  const { colors, isDark } = useTheme();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      progress.value = withTiming(percentage / 100, {
        duration: 800,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    } else {
      progress.value = percentage / 100;
    }
  }, [percentage, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  // Use gradient if provided, otherwise fallback to color with darkening
  const gradientColors: [string, string] = gradient ?? [color, darkenColor(color, 30)];

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        <View
          style={[
            styles.track,
            {
              height,
              borderRadius: height / 2,
              backgroundColor: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.06)",
            },
          ]}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                height,
                borderRadius: height / 2,
              },
              animatedStyle,
            ]}
          >
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gradient, { borderRadius: height / 2 }]}
            />
          </Animated.View>
        </View>
      </View>
      {showLabel && (
        <Text
          style={[
            styles.label,
            { color: isDark ? colors.textSecondary : "#5F6368" },
          ]}
        >
          {percentage}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  barContainer: {
    flex: 1,
  },
  track: {
    width: "100%",
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  label: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    minWidth: 40,
    textAlign: "right",
  },
});

export default DuoProgressBar;
