// components/GameCompletionModal/components/PlayerProgressionCard/components/LevelUpOverlay.tsx
import React from "react";
import { StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { LevelInfo } from "../../PlayerProgressionCard/utils/types";

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
      style={[styles.overlay]}
      entering={FadeIn.duration(400)}
      exiting={FadeOut.duration(300)}
      pointerEvents="none"
    >
      {/* Level Up Overlay - Text entfernt, nur Animation/Overlay sichtbar */}
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
});

export default LevelUpOverlay;
