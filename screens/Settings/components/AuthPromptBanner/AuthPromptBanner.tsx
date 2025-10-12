// screens/Settings/components/AuthPromptBanner/AuthPromptBanner.tsx
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import styles from "./AuthPromptBanner.styles";

interface AuthPromptBannerProps {
  onPress: () => void;
}

const AuthPromptBanner: React.FC<AuthPromptBannerProps> = ({ onPress }) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const progressColor = useProgressColor();

  // Animation values
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const iconRotate = useSharedValue(0);

  // Start animations on mount
  useEffect(() => {
    // Subtle container pulse
    scale.value = withDelay(
      300,
      withRepeat(
        withSequence(
          withTiming(1.008, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );

    // Shimmer effect
    shimmer.value = withDelay(
      500,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withDelay(3000, withTiming(0, { duration: 0 }))
        ),
        -1,
        false
      )
    );

    // Icon pulse animation
    iconScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Icon subtle rotation
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(0.04, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.04, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Handle press with haptic feedback
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.97, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 0.3, 0]),
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-300, 300]) }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}rad` },
    ],
  }));

  // Generate gradient colors based on progress color and theme
  const getGradientColors = () => {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 74, g: 144, b: 226 };
    };

    const rgb = hexToRgb(progressColor);

    if (theme.isDark) {
      return [
        `rgb(${Math.max(0, rgb.r - 35)}, ${Math.max(0, rgb.g - 35)}, ${Math.max(0, rgb.b - 35)})`,
        `rgb(${Math.max(0, rgb.r - 20)}, ${Math.max(0, rgb.g - 20)}, ${Math.max(0, rgb.b - 20)})`,
        progressColor,
      ];
    } else {
      return [
        progressColor,
        `rgb(${Math.min(255, rgb.r + 15)}, ${Math.min(255, rgb.g + 15)}, ${Math.min(255, rgb.b + 15)})`,
        `rgb(${Math.min(255, rgb.r + 35)}, ${Math.min(255, rgb.g + 35)}, ${Math.min(255, rgb.b + 35)})`,
      ];
    }
  };

  const gradientColors = getGradientColors();

  // Use progressColor directly for button (it's already the correct solid color)
  const buttonColor = progressColor;

  return (
    <Animated.View style={[styles.wrapper, containerAnimatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={styles.touchable}
      >
        {/* Shadow wrapper for elevation */}
        <View style={styles.shadowContainer}>
          <View style={styles.container}>
            {/* Gradient background */}
            <LinearGradient
              colors={gradientColors}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradient}
            />

            {/* Glasmorphism overlay */}
            <View style={styles.glassOverlay} />

            {/* Shimmer effect */}
            <Animated.View
              style={[styles.shimmer, shimmerAnimatedStyle]}
              pointerEvents="none"
            />

            {/* Content - Vertical Layout */}
            <View style={styles.content}>
              {/* Top: Icon */}
              <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
                <View style={styles.iconBackground}>
                  <Feather name="shield" size={38} color="#FFFFFF" />
                  <View style={[styles.cloudIconOverlay, { backgroundColor: progressColor + 'E6' }]}>
                    <Feather name="cloud" size={16} color="#FFFFFF" />
                  </View>
                </View>
              </Animated.View>

              {/* Bottom: Text & Button side by side */}
              <View style={styles.bottomRow}>
                <View style={styles.textContainer}>
                  <Text style={styles.title} numberOfLines={1}>
                    {t("authPrompt.title")}
                  </Text>
                  <Text style={styles.subtitle} numberOfLines={1}>
                    {t("authPrompt.subtitle")}
                  </Text>
                </View>

                <View style={[styles.ctaButton, { backgroundColor: buttonColor }]}>
                  <Feather
                    name="arrow-right"
                    size={20}
                    color="#FFFFFF"
                    style={styles.ctaIcon}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AuthPromptBanner;
