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
import { useProgressColor } from "@/hooks/useProgressColor";
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
  const progressColor = useProgressColor();

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
  const description = isLocal
    ? t("gameModeModal.local.description")
    : t("gameModeModal.online.description");

  // Colors
  const cardBg = theme.isDark ? colors.surface : "#FFFFFF";
  const cardBorder = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const iconBg = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : `${progressColor}15`;

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
          styles.card,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            shadowColor: theme.isDark ? "transparent" : progressColor,
          },
          animatedStyle,
        ]}
      >
        {/* Icon Container */}
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Feather
            name={icon}
            size={24}
            color={progressColor}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {description}
          </Text>
        </View>

        {/* Chevron */}
        <Feather
          name="chevron-right"
          size={20}
          color={progressColor}
          style={styles.chevron}
        />
      </Animated.View>
    </Pressable>
  );
};

export default GameModeCard;
