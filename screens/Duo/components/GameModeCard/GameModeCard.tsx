// screens/Duo/components/GameModeCard/GameModeCard.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import styles from "./GameModeCard.styles";

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
  const { colors: leagueColors } = useCurrentLeague();

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

  // Colors - matching other Duo containers (neutral, surface-based)
  const cardBg = colors.surface;
  const cardBorder = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const iconBg = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.04)";
  const iconColor = theme.isDark ? "#FFFFFF" : leagueColors.accent;

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
          styles.cardGradient,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            shadowColor: theme.isDark ? "transparent" : leagueColors.accent,
          },
          animatedStyle,
        ]}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather
            name={icon}
            size={24}
            color={iconColor}
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
          color={iconColor}
          style={styles.playIcon}
        />
      </Animated.View>
    </Pressable>
  );
};

export default GameModeCard;
