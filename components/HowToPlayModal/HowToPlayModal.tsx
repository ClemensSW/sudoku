// components/HowToPlayModal/HowToPlayModal.tsx
import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import TutorialContainer from "../Tutorial/TutorialContainer";

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get("window");

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  if (!visible) return null;

  return (
    <Animated.View 
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colors.background }
      ]}
      entering={FadeIn.duration(300)}
    >
      <TutorialContainer 
        onComplete={onClose}
        onBack={onClose}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1000,
  },
});

export default HowToPlayModal;