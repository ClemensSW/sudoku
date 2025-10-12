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
import styles from "./AuthPromptBanner.styles";

interface AuthPromptBannerProps {
  onPress: () => void;
}

const AuthPromptBanner: React.FC<AuthPromptBannerProps> = ({ onPress }) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();

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

    // Shimmer effect (runs once on mount, then repeats)
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
        withTiming(1.12, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.96, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Icon subtle rotation
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(0.03, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.03, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Handle press with haptic feedback
  const handlePress = () => {
    scale.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withSpring(1, { damping: 15, stiffness: 200 })
    );
    onPress();
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 0.25, 0]),
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-250, 250]) }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: iconScale.value },
      { rotate: `${iconRotate.value}rad` },
    ],
  }));

  // Gradient colors based on theme
  const gradientColors = theme.isDark
    ? ["#3A7BC8", "#4A6FD8", "#6A58CE"]
    : ["#4A90E2", "#5B7FE8", "#7B68EE"];

  const benefits = [
    { key: "sync", icon: "cloud" as const },
    { key: "backup", icon: "shield" as const },
    { key: "devices", icon: "smartphone" as const },
  ];

  return (
    <Animated.View style={[styles.wrapper, containerAnimatedStyle]}>
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={handlePress}
        style={styles.touchable}
      >
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

          {/* Content */}
          <View style={styles.content}>
            {/* Icon container */}
            <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
              <View style={styles.iconBackground}>
                <Feather name="shield" size={32} color="#FFFFFF" />
                {/* Small cloud icon overlay */}
                <View style={styles.cloudIconOverlay}>
                  <Feather name="cloud" size={16} color="#FFFFFF" />
                </View>
              </View>
            </Animated.View>

            {/* Text content */}
            <View style={styles.textContainer}>
              <Text style={styles.title}>
                {t("authPrompt.title")}
              </Text>
              <Text style={styles.subtitle}>
                {t("authPrompt.subtitle")}
              </Text>

              {/* Benefits list */}
              <View style={styles.benefitsList}>
                {benefits.map((benefit) => (
                  <View key={benefit.key} style={styles.benefitItem}>
                    <Feather
                      name="check-circle"
                      size={14}
                      color="rgba(255, 255, 255, 0.9)"
                      style={styles.benefitIcon}
                    />
                    <Text style={styles.benefitText}>
                      {t(`authPrompt.benefits.${benefit.key}`)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* CTA indicator */}
            <View style={styles.ctaContainer}>
              <Text style={styles.ctaText}>
                {t("authPrompt.cta")}
              </Text>
              <Feather
                name="chevron-right"
                size={22}
                color="#FFFFFF"
                style={styles.chevron}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default AuthPromptBanner;
