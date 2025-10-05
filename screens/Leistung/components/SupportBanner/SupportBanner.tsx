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
import { checkHasPurchased, trackBannerInteraction, getPurchaseType, PurchaseType } from "@/screens/SupportShop/utils/purchaseTracking";
import styles from "./SupportBanner.styles";
import HeartIcon from "@/assets/svg/heart.svg";

interface SupportBannerProps {
  onOpenSupportShop: () => void; // Callback to open SupportShop from parent
}

const SupportBanner: React.FC<SupportBannerProps> = ({ onOpenSupportShop }) => {
  const theme = useTheme();
  const { colors } = theme;

  const [isVisible, setIsVisible] = useState(false);
  const [purchaseType, setPurchaseType] = useState<PurchaseType>('none');

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
        const type = await getPurchaseType();
        if (!mounted) return;
        setPurchaseType(type);
        // Banner ist immer sichtbar
        setIsVisible(true);

        // Animationen nur starten, wenn noch nichts gekauft wurde
        if (type === 'none') {
          startAnimations();
        } else {
          // Bei bestehenden Käufen: Keine Animationen
          stopAnimations();
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

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  // Dynamischer Text basierend auf Purchase-Typ
  const getBannerText = () => {
    switch (purchaseType) {
      case 'subscription':
        return {
          title: "Vielen Dank für dein Abo!",
          subtitle: "Du ermöglichst kontinuierliche Entwicklung"
        };
      case 'one-time':
        return {
          title: "Danke für deine Unterstützung!",
          subtitle: "Jede weitere Hilfe ermöglicht neue Features"
        };
      default:
        return {
          title: "Unterstütze die Entwicklung",
          subtitle: "Hilf mir, das Spiel werbefrei zu halten"
        };
    }
  };

  const bannerText = getBannerText();

  return (
    <Animated.View
      entering={purchaseType === 'none' ? SlideInDown.delay(300).duration(400).easing(Easing.out(Easing.ease)) : undefined}
      style={[containerAnimatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handlePress}
        style={styles.touchableContainer}
      >
        {/* Wrapper erlaubt, dass Close-Button halb außerhalb sitzen kann */}
        <View style={styles.cardWrapper}>
          <View
            style={[
              styles.container,
              {
                backgroundColor: theme.isDark
                  ? "#2A2A2E"
                  : "#FAFAFA",
                borderColor: theme.isDark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "rgba(0, 0, 0, 0.06)",
              },
            ]}
          >
            {/* Shimmer effect overlay - dezenter */}
            <Animated.View
              style={[
                styles.shimmerOverlay,
                shimmerAnimatedStyle,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255, 255, 255, 0.03)"
                    : "rgba(0, 0, 0, 0.02)",
                },
              ]}
              pointerEvents="none"
            />

            {/* Main content */}
            <View style={styles.contentContainer}>
              {/* Heart icon with animation */}
              <Animated.View style={[styles.iconContainer, heartAnimatedStyle]}>
                <HeartIcon width={36} height={36} />
              </Animated.View>

              {/* Text content */}
              <View style={styles.textContainer}>
                <Text style={[styles.title, { color: colors.textPrimary }]}>
                  {bannerText.title}
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                  {bannerText.subtitle}
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
          </View>

        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SupportBanner;