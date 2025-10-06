// components/GameCompletionModal/components/PlayerProgressionCard/components/LevelUpOverlay.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import LevelBadge from "./LevelBadge";
import { LevelInfo } from "../../PlayerProgressionCard/utils/types";
import { radius, spacing } from "@/utils/theme";

type LevelUpOverlayProps = {
  visible: boolean;
  levelInfo: LevelInfo;
  color: string;
};

const LevelUpOverlay: React.FC<LevelUpOverlayProps> = ({
  visible,
  levelInfo,
  color,
}) => {
  const { t } = useTranslation('gameCompletion');

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay]}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      pointerEvents="none"
    >
      {/* Centered Text Message */}
      <Animated.View
        style={styles.messageContainer}
        entering={FadeIn.delay(200).duration(400)}
      >
        <Text style={[styles.text, { color }]}>
          🎉 {t('level.levelUp', { level: levelInfo.currentLevel + 1 })}
        </Text>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  messageContainer: {
    position: "absolute",
    bottom: spacing.xl * 2,
    left: spacing.lg,
    right: spacing.lg,
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
});

export default LevelUpOverlay;
