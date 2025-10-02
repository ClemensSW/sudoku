// screens/LeistungScreen/components/SupportBanner/SupportBanner.tsx
import React, { useEffect, useRef, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  SlideInDown,
  interpolate,
  Easing,
  cancelAnimation,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { checkHasPurchased, trackBannerInteraction } from "@/utils/purchaseTracking";
import styles from "./SupportBanner.styles";

interface SupportBannerProps {
  onOpenSupportShop: () => void; // Callback to open SupportShop from parent
}

const SupportBanner: React.FC<SupportBannerProps> = ({ onOpenSupportShop }) => {
  const theme = useTheme();
  const { colors } = theme;

  const [isVisible, setIsVisible] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Animation values
  const scale = useSharedValue(1);
  const shimmer = useSharedValue(0);
  const heartBeat = useSharedValue(1);
  const closeButtonScale = useSharedValue(1);

  // Interval-Refs (sauberes Cleanup!)
  const purchaseIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start animations (mit weniger "Bouncing")
  const startAnimations = useCallback(() => {
    // Prüfen ob Animation schon läuft
    if (heartbeatIntervalRef.current) return;
    
    // Subtler pulse
    scale.value = withSequence(
      withDelay(800, withSpring(1.005, { damping: 60, stiffness: 100 })),
      withSpring(1, { damping: 60, stiffness: 100 })
    );

    // Shimmer einmalig
    shimmer.value = withDelay(
      400,
      withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
    );

    // Heart beat animation (deutlich reduzierte Amplituden für weniger Bounce)
    const heartBeatAnimation = () => {
      heartBeat.value = withSequence(
        withTiming(1.08, { duration: 220 }),
        withTiming(0.98, { duration: 160 }),
        withTiming(1.04, { duration: 160 }),
        withTiming(1, { duration: 240 })
      );
    };

    heartBeatAnimation();
    heartbeatIntervalRef.current = setInterval(heartBeatAnimation, 1500); // Langsamer: alle 5 Sekunden
  }, [scale, shimmer, heartBeat]);

  // Stop animations mit vollständigem Cleanup
  const stopAnimations = useCallback(() => {
    // Intervall stoppen
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
    
    // Alle Animationen canceln
    cancelAnimation(scale);
    cancelAnimation(shimmer);
    cancelAnimation(heartBeat);
    cancelAnimation(closeButtonScale);
    
    // Werte zurücksetzen
    scale.value = 1;
    shimmer.value = 0;
    heartBeat.value = 1;
    closeButtonScale.value = 1;
  }, [scale, shimmer, heartBeat, closeButtonScale]);

  // Verwende useFocusEffect statt useEffect für bessere Performance mit React Navigation
  useFocusEffect(
    useCallback(() => {
      let mounted = true;

      const checkPurchaseStatus = async () => {
        const purchased = await checkHasPurchased();
        if (!mounted) return;
        setHasPurchased(purchased);
        if (!purchased) {
          setIsVisible(true);
          startAnimations();
        } else {
          stopAnimations();
          setIsVisible(false);
        }
      };

      // Initial check
      checkPurchaseStatus();

      // Re-check nur alle 30 Sekunden (statt alle 2 Sekunden!)
      purchaseIntervalRef.current = setInterval(checkPurchaseStatus, 30000);

      // Cleanup beim Verlassen der Seite
      return () => {
        mounted = false;
        if (purchaseIntervalRef.current) {
          clearInterval(purchaseIntervalRef.current);
          purchaseIntervalRef.current = null;
        }
        stopAnimations();
      };
    }, [startAnimations, stopAnimations])
  );

  // Handle banner press
  const handlePress = async () => {
    await trackBannerInteraction("banner_click");

    // Sanfter Tap-Feedback
    scale.value = withSequence(
      withTiming(0.985, { duration: 90 }),
      withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) })
    );

    setTimeout(() => {
      onOpenSupportShop();
    }, 140);
  };

  // Handle close button press
  const handleClose = async () => {
    await trackBannerInteraction("close_click");

    closeButtonScale.value = withSequence(
      withTiming(0.94, { duration: 90 }),
      withTiming(1.05, { duration: 160 }),
      withTiming(1, { duration: 140 })
    );

    // Close öffnet auch den Shop
    setTimeout(() => {
      onOpenSupportShop();
    }, 260);
  };

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0, 0.28, 0]),
    transform: [{ translateX: interpolate(shimmer.value, [0, 1], [-200, 200]) }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartBeat.value }],
  }));

  // Don't render if user has purchased
  if (hasPurchased || !isVisible) {
    return null;
  }

  return (
    <Animated.View
      entering={SlideInDown.delay(300).duration(400).easing(Easing.out(Easing.ease))}
      style={[containerAnimatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchableContainer}
      >
        {/* Wrapper erlaubt, dass Close-Button halb außerhalb sitzen kann */}
        <View style={styles.cardWrapper}>
          <LinearGradient
            colors={
              theme.isDark
                ? ["#1a1a2e", "#16213e", "#1a1a2e"]
                : ["#fff5f0", "#ffeaa7", "#fff5f0"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[
              styles.container,
              {
                borderColor: theme.isDark
                  ? "rgba(255, 215, 0, 0.2)"
                  : "rgba(255, 165, 0, 0.3)",
                shadowColor: theme.isDark ? "#FFD700" : "#FFA500",
              },
            ]}
          >
            {/* Shimmer effect overlay */}
            <Animated.View
              style={[
                styles.shimmerOverlay,
                shimmerAnimatedStyle,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255, 215, 0, 0.1)"
                    : "rgba(255, 165, 0, 0.1)",
                },
              ]}
              pointerEvents="none"
            />

            {/* Main content */}
            <View style={styles.contentContainer}>
              {/* Heart icon with animation */}
              <Animated.View style={[styles.iconContainer, heartAnimatedStyle]}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E53"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.iconGradient}
                >
                  <Feather name="heart" size={20} color="white" />
                </LinearGradient>
              </Animated.View>

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  Unterstütze die Entwicklung
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  Hilf mir, das Spiel werbefrei zu halten
                </Text>
              </View>

              {/* Arrow indicator */}
              <Feather
                name="chevron-right"
                size={20}
                color={colors.textSecondary}
                style={styles.arrowIcon}
              />
            </View>

            {/* Premium badge */}
            <View
              style={[
                styles.premiumBadge,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255, 215, 0, 0.15)"
                    : "rgba(255, 165, 0, 0.15)",
                },
              ]}
            >
              <Feather
                name="zap"
                size={12}
                color={theme.isDark ? "#FFD700" : "#FFA500"}
              />
              <Text
                style={[
                  styles.premiumBadgeText,
                  { color: theme.isDark ? "#FFD700" : "#FFA500" },
                ]}
              >
                PREMIUM
              </Text>
            </View>
          </LinearGradient>

        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SupportBanner;