// components/HowToPlayModal/HowToPlayModal.tsx
import React, { useEffect, useCallback } from "react";
import { View, StyleSheet, Alert } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigationControl } from "@/app/_layout";
import TutorialContainer from "../Tutorial/TutorialContainer";
import { useRouter } from "expo-router";

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { setHideBottomNav } = useNavigationControl();
  const router = useRouter();

  // Navigation-Kontrolle basierend auf Modal-Sichtbarkeit
  useEffect(() => {
    if (visible) {
      console.log("HowToPlayModal: Visible, hiding bottom nav");
      setHideBottomNav(true);
    }
    
    return () => {
      console.log("HowToPlayModal: Cleanup, showing bottom nav");
      setHideBottomNav(false);
    };
  }, [visible, setHideBottomNav]);

  // Wenn nicht sichtbar, nichts rendern
  if (!visible) return null;

  // Zentrale Funktion zum Schließen des Tutorials und Navigieren zum Startbildschirm
  const handleTutorialExit = () => {
    console.log("HowToPlayModal: Tutorial exit requested");
    
    try {
      // Zuerst das Modal schließen
      onClose();
      
      // Kurzer Timeout, um sicherzustellen, dass die UI-Updates abgeschlossen sind
      setTimeout(() => {
        console.log("HowToPlayModal: Navigating to start screen");
        try {
          // Direkt zum Index navigieren (StartScreen)
          router.push('/');
        } catch (routerError) {
          console.error("Router navigation error:", routerError);
          Alert.alert("Navigation Error", "Could not navigate to start screen");
        }
      }, 100);
    } catch (error) {
      console.error("Error in tutorial exit handler:", error);
    }
  };

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
        onComplete={handleTutorialExit}
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