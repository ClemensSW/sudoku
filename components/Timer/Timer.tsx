import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./Timer.styles";

interface TimerProps {
  isRunning: boolean;
  initialTime?: number;
  onTimeUpdate?: (time: number) => void;
  onPausePress?: () => void;
  disabled?: boolean;
}

const Timer: React.FC<TimerProps> = ({
  isRunning,
  initialTime = 0,
  onTimeUpdate,
  onPausePress,
  disabled = false,
}) => {
  const { t } = useTranslation('game');
  const theme = useTheme();
  const colors = theme.colors;

  const [time, setTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Animation values
  const scale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0);

  // Setup the timer
  useEffect(() => {
    if (isRunning) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => {
          const newTime = prevTime + 1;

          // Every minute, do a subtle pulse animation
          if (newTime % 60 === 0) {
            scale.value = withSequence(
              withTiming(1.1, { duration: 150 }),
              withTiming(1, { duration: 150 })
            );

            pulseOpacity.value = withSequence(
              withTiming(0.3, { duration: 100 }),
              withTiming(0, { duration: 400 })
            );
          }

          return newTime;
        });
      }, 1000);

      // Visual indicator of running
      pulseOpacity.value = withTiming(0.3, { duration: 300 });
    } else if (intervalRef.current) {
      // Stop the timer
      clearInterval(intervalRef.current);
      pulseOpacity.value = withTiming(0, { duration: 300 });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  // Separate effect for the callback to avoid state updates during render
  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(time);
    }
  }, [time, onTimeUpdate]);

  // Animated styles
  const timerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const pulseAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPausePress}
        disabled={disabled || !onPausePress}
        style={styles.timerRow}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={t('controls.pauseGame')}
        accessibilityState={{ disabled: disabled || !onPausePress }}
      >
        <Feather
          name="pause"
          size={18}
          color={disabled ? colors.buttonDisabled : colors.textPrimary}
          style={styles.timerIcon}
        />

        <Animated.View
          style={[
            styles.timerBackground,
            {
              backgroundColor: theme.isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.03)",
            },
            pulseAnimatedStyle,
          ]}
        />

        <Animated.Text
          style={[
            styles.timerText,
            { color: disabled ? colors.textSecondary : colors.textPrimary },
            timerAnimatedStyle,
          ]}
        >
          {formatTime(time)}
        </Animated.Text>
      </TouchableOpacity>
    </View>
  );
};

export default Timer;
