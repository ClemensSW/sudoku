// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

const { width } = Dimensions.get("window");
const LOGO_SIZE = Math.min(width * 0.75, 300); // Maximale Breite 70% oder 300px

interface DuoBoardVisualizerProps {}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = () => {
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(800)}
    >
      <Image
        source={require("@/assets/images/app-logo.png")} // Stellen Sie sicher, dass der Pfad korrekt ist
        style={styles.logoImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
  },
  logoImage: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  }
});

export default DuoBoardVisualizer;