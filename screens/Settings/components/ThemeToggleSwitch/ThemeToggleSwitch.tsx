// screens/Settings/components/ThemeToggleSwitch/ThemeToggleSwitch.tsx
import React, { useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import SunIcon from "@/assets/svg/sun.svg";
import MoonIcon from "@/assets/svg/full-moon.svg";

const { width } = Dimensions.get("window");
const SWITCH_WIDTH = Math.min(width - 32, 340);
const SWITCH_HEIGHT = 72; // Gleiche Höhe wie Buttons
const THUMB_SIZE = 60;
const GRADIENT_RING_WIDTH = 1; // Breite des Gradient-Rings
const PADDING = 6;
const ICON_SIZE = 42; // Noch größere Icons

interface ThemeToggleSwitchProps {
  value: "light" | "dark";
  onValueChange: (value: "light" | "dark") => void;
  disabled?: boolean;
}

const ThemeToggleSwitch: React.FC<ThemeToggleSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Animated value: 0 = light, 1 = dark
  const animatedValue = useSharedValue(value === "dark" ? 1 : 0);

  // Update animation when value changes (subtilere Animation)
  useEffect(() => {
    animatedValue.value = withSpring(value === "dark" ? 1 : 0, {
      damping: 25,
      stiffness: 180,
    });
  }, [value]);

  // Handle toggle
  const handleToggle = () => {
    if (disabled) return;

    triggerHaptic("light");
    const newValue = value === "light" ? "dark" : "light";
    onValueChange(newValue);
  };

  // Animated thumb position (berücksichtigt Gradient-Ring, links 1px korrigiert)
  const thumbStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      animatedValue.value,
      [0, 1],
      [PADDING - 1, SWITCH_WIDTH - THUMB_SIZE - (GRADIENT_RING_WIDTH * 2) - PADDING]
    );

    return {
      transform: [{ translateX }],
    };
  });

  // Animated icon opacity for sun (left) - subtiler, keine Scale
  const sunIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [1, 0.4]);

    return {
      opacity,
    };
  });

  // Animated icon opacity for moon (right) - subtiler, keine Scale
  const moonIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0.4, 1]);

    return {
      opacity,
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handleToggle}
      disabled={disabled}
      style={styles.container}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: colors.themeToggleTrack,
            borderColor: colors.border,
            opacity: disabled ? 0.6 : 1,
          },
        ]}
      >
        {/* Left Icon (Sun) - nur Hintergrund wenn aktiv */}
        <Animated.View style={[styles.iconContainer, styles.leftIcon, sunIconStyle]}>
          {value === "light" && (
            <View style={[styles.iconBackground, { backgroundColor: "rgba(255, 140, 66, 0.2)" }]} />
          )}
          <SunIcon width={ICON_SIZE} height={ICON_SIZE} />
        </Animated.View>

        {/* Right Icon (Moon) - nur Hintergrund wenn aktiv */}
        <Animated.View style={[styles.iconContainer, styles.rightIcon, moonIconStyle]}>
          {value === "dark" && (
            <View style={[styles.iconBackground, { backgroundColor: "rgba(138, 120, 180, 0.25)" }]} />
          )}
          <MoonIcon width={ICON_SIZE} height={ICON_SIZE} />
        </Animated.View>

        {/* Animated Thumb - weißer Kreis mit farbigem Gradient-Ring */}
        <Animated.View style={[styles.thumb, thumbStyle]}>
          <View style={styles.thumbWhite}>
            {/* Gradient Ring außen herum */}
            <LinearGradient
              colors={[colors.themeToggleGradientStart, colors.themeToggleGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.thumbGradientRing}
            />
            {/* Icon im weißen Thumb */}
            <View style={styles.thumbIcon}>
              {value === "light" ? (
                <SunIcon width={36} height={36} />
              ) : (
                <MoonIcon width={36} height={36} />
              )}
            </View>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SWITCH_WIDTH,
    alignSelf: "center",
    marginBottom: 16, // spacing.md
  },
  track: {
    width: SWITCH_WIDTH,
    height: SWITCH_HEIGHT,
    borderRadius: SWITCH_HEIGHT / 2,
    borderWidth: 1.5,
    position: "relative",
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    width: 54,
    height: 54,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    position: "absolute",
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  leftIcon: {
    left: 12,
  },
  rightIcon: {
    right: 12,
  },
  thumb: {
    position: "absolute",
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
  },
  thumbWhite: {
    width: "100%",
    height: "100%",
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  thumbGradientRing: {
    position: "absolute",
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    borderRadius: (THUMB_SIZE + 6) / 2,
    zIndex: -1,
  },
  thumbIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ThemeToggleSwitch;
