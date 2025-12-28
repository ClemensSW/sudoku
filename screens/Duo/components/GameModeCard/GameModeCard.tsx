// screens/Duo/components/GameModeCard/GameModeCard.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./GameModeCard.styles";

// Duo Color - Deep Teal (matching PlayerStatsHero header)
const DUO_COLOR = "#2E6B7B";

export type GameMode = "local" | "online";

interface GameModeCardProps {
  mode: GameMode;
  onPress: () => void;
  disabled?: boolean;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
  mode,
  onPress,
  disabled = false,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;

  // Animation
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(scale.value, {
          duration: 100,
          easing: Easing.out(Easing.quad),
        }),
      },
    ],
  }));

  const isLocal = mode === "local";
  const icon = isLocal ? "users" : "wifi";
  const title = isLocal
    ? t("gameModeModal.local.title")
    : t("gameModeModal.online.title");

  // Colors - DUO_COLOR theme with solid backgrounds for elevation
  const cardBg = theme.isDark ? "#2A3A4D" : "#FFFFFF"; // Solid for Android elevation
  const gradientColors = theme.isDark
    ? ["#2A3A4D", "#1E2A38"] as const  // Dark blue-gray gradient
    : ["#FFFFFF", "#F0F4F8"] as const; // White to light blue-gray
  const cardBorder = theme.isDark
    ? "rgba(46, 107, 123, 0.4)"
    : "rgba(46, 107, 123, 0.25)";
  const iconBg = theme.isDark
    ? "rgba(46, 107, 123, 0.3)"
    : "rgba(46, 107, 123, 0.15)";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => (scale.value = 0.98)}
      onPressOut={() => (scale.value = 1)}
      disabled={disabled}
      style={({ pressed }) => [
        { opacity: disabled ? 0.5 : pressed ? 0.9 : 1 },
      ]}
    >
      <Animated.View
        style={[
          styles.cardShadow,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            shadowColor: theme.isDark ? "transparent" : DUO_COLOR,
          },
          animatedStyle,
        ]}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.cardGradient}
        >
          {/* Icon Container */}
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Feather
              name={icon}
              size={24}
              color={DUO_COLOR}
            />
          </View>

          {/* Title */}
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {title}
            </Text>
          </View>

          {/* Play Icon */}
          <Feather
            name="play-circle"
            size={24}
            color={DUO_COLOR}
            style={styles.playIcon}
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
};

export default GameModeCard;
