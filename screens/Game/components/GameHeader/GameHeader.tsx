// screens/Game/components/GameHeader/GameHeader.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
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
  const insets = useSafeAreaInsets();

  // Timer state
  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animation values
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

  // Animated styles
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

      {/* Center: Timer Only (Hearts moved to Controls) */}
      <View style={styles.centerContent}>
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
            size={20}
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
