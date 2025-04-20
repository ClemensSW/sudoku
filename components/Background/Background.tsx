import React from "react";
import { Image, StyleSheet, Dimensions, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useDailyBackground } from "@/hooks/useDailyBackground";

const { width, height } = Dimensions.get("window");

interface BackgroundProps {
  variant?: "blue" | "purple" | "default" | "daily";
  forceImage?: any; // Für explizites Überschreiben mit einem bestimmten Bild
}

const Background: React.FC<BackgroundProps> = ({ 
  variant = "daily", // Default jetzt auf "daily" geändert
  forceImage 
}) => {
  // Verwende den Daily Background Hook für tägliche Rotation
  const { backgroundImage, isLoading } = useDailyBackground();
  
  // Select the appropriate background based on variant or use daily background
  const getBackgroundSource = () => {
    // Wenn ein explizites Bild erzwungen wird, nutze dieses
    if (forceImage) {
      return forceImage;
    }
    
    // Varianten-basierte Auswahl
    switch (variant) {
      case "daily":
        // Nutze das freigeschaltete Hintergrundbild, wenn verfügbar
        if (backgroundImage && !isLoading) {
          return backgroundImage.fullSource;
        }
        // Fallback auf Standard-Hintergrund
        return require("@/assets/images/background/mountains_blue.png");
      case "blue":
        return require("@/assets/images/background/mountains_blue.png");
      case "purple":
        return require("@/assets/images/background/mountains_purple.png");
      default:
        return require("@/assets/images/background/mountains_blue.png");
    }
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      <Image
        source={getBackgroundSource()}
        style={styles.backgroundImage}
        resizeMode="cover"
      />
      
      {/* Optional: Overlay für Schatten oder Tönungseffekte
      <View style={[
        styles.overlay,
        { backgroundColor: "rgba(0, 0, 0, 0.05)" }
      ]} />
      */}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // Optional für Schatten oder leichte Tönungseffekte
  }
});

export default Background;