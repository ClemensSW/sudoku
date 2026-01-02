// screens/Game/components/GameHeader/GameHeader.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/contexts/color/ColorContext";
import styles from "./GameHeader.styles";

interface GameHeaderProps {
  // Navigation
  onBackPress: () => void;
  onSettingsPress: () => void;

  // Hearts/Lives
  errorsRemaining: number;
  maxErrors: number;
  showErrors?: boolean;

  // Timer
  isTimerRunning: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  onPausePress?: () => void;
  pauseDisabled?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  onBackPress,
  onSettingsPress,
  errorsRemaining,
  maxErrors,
  showErrors = true,
  isTimerRunning,
  initialTime = 0,
  onTimeUpdate,
  onPausePress,
  pauseDisabled = false,
}) => {
  const theme = useTheme();
  const { colors, typography, shadows, isDark } = theme;
  const pathColorHex = useProgressColor();
  const insets = useSafeAreaInsets();

  // Timer state
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
  const heartScale = useSharedValue(1);
  const timerScale = useSharedValue(1);

  // Timer logic
  useEffect(() => {
    if (isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;

          // Subtle pulse every minute
          if (newTime % 60 === 0) {
            timerScale.value = withSequence(
              withTiming(1.05, { duration: 150 }),
              withTiming(1, { duration: 150 })
            );
          }

          return newTime;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isTimerRunning, timerScale]);

  // Time update callback
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [time, onTimeUpdate]);

  // Heart pulse animation on error
  useEffect(() => {
    if (errorsRemaining < maxErrors) {
      heartScale.value = withSequence(
        withTiming(1.2, { duration: 200, easing: Easing.out(Easing.ease) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
      );
    }
  }, [errorsRemaining, maxErrors, heartScale]);

  // Animated styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const timerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: timerScale.value }],
  }));

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Get heart color based on remaining errors
  const getHeartColor = () => {
    if (errorsRemaining === 0) return colors.error;
    if (errorsRemaining === 1) return colors.warning;
    return pathColorHex;
  };

  // Render hearts
  const renderHearts = () => {
    return Array.from({ length: maxErrors }).map((_, index) => {
      const isFilled = index < errorsRemaining;
      const isAnimated = index === maxErrors - errorsRemaining;

      return (
        <Animated.View
          key={`heart-${index}`}
          style={[styles.heartWrapper, isAnimated && heartAnimatedStyle]}
        >
          <Feather
            name="heart"
            size={18}
            color={isFilled ? getHeartColor() : colors.buttonDisabled}
            style={!isFilled ? { opacity: 0.4 } : undefined}
          />
        </Animated.View>
      );
    });
  };

  // Render infinity heart (when showErrors is false)
  const renderInfinityHeart = () => (
    <View style={styles.infinityContainer}>
      <Feather name="heart" size={18} color={pathColorHex} />
      <Text
        style={[
          styles.infinityText,
          { color: colors.textSecondary, fontSize: typography.size.lg },
        ]}
      >
        ∞
      </Text>
    </View>
  );

  // Container dynamic styles
  const containerStyle = {
    paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 12 : 8) + 8,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, containerStyle]}
    >
      {/* Left: Back Button */}
      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: colors.surface, ...shadows.sm },
        ]}
        onPress={onBackPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="chevron-left" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      {/* Center: Hearts + Timer */}
      <View style={styles.centerContent}>
        {/* Hearts */}
        <View style={styles.heartsContainer}>
          {showErrors ? renderHearts() : renderInfinityHeart()}
        </View>

        {/* Timer (Pressable for Pause) */}
        <TouchableOpacity
          style={styles.timerContainer}
          onPress={onPausePress}
          disabled={pauseDisabled || !onPausePress}
          activeOpacity={0.7}
        >
          <Animated.Text
            style={[
              styles.timerText,
              {
                color: pauseDisabled ? colors.textSecondary : colors.textPrimary,
                fontSize: typography.size.md,
              },
              timerAnimatedStyle,
            ]}
          >
            {formatTime(time)}
          </Animated.Text>
          <Feather
            name="pause"
            size={14}
            color={pauseDisabled ? colors.buttonDisabled : colors.textSecondary}
            style={styles.pauseIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Right: Settings Button */}
      <TouchableOpacity
        style={[
          styles.iconButton,
          { backgroundColor: colors.surface, ...shadows.sm },
        ]}
        onPress={onSettingsPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="settings" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default GameHeader;
