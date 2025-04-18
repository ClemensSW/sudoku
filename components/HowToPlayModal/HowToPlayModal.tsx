// components/HowToPlayModal/HowToPlayModal.tsx
import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigationControl } from "@/app/_layout"; // Direkte Import aus _layout
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
  // Direkter Zugriff auf den neuen NavigationContext
  const { setHideBottomNav } = useNavigationControl();

  // Navigation-Kontrolle basierend auf Modal-Sichtbarkeit
  useEffect(() => {
    if (visible) {
      // Navigationleiste ausblenden
      setHideBottomNav(true);
    }
    
    // Aufräumen beim Unmount oder wenn nicht mehr sichtbar
    return () => {
      setHideBottomNav(false);
    };
  }, [visible, setHideBottomNav]);

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