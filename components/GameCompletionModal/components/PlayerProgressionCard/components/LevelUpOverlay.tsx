// components/GameCompletionModal/components/PlayerProgressionCard/components/LevelUpOverlay.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import LevelBadge from "./LevelBadge";
import { LevelInfo } from "../utils/types";
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
  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.overlay, { backgroundColor: "rgba(0,0,0,0.75)" }]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
    >
      <View
        style={[
          styles.content,
          {
            backgroundColor: "rgba(0,0,0,0.5)",
            borderColor: color,
            borderWidth: 2,
            padding: 24,
            borderRadius: 20,
          },
        ]}
      >
        <Text style={styles.text}>LEVEL UP!</Text>
        <LevelBadge
          levelInfo={levelInfo}
          size={84}
          showAnimation={true}
          animationDelay={300}
        />
      </View>
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
    borderRadius: radius.xl,
    zIndex: 20,
  },
  content: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 2,
    maxWidth: "85%",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  text: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});

export default LevelUpOverlay;
