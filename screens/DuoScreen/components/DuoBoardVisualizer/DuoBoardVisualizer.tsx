// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Use exact same width as button (320px) for consistency
const VISUALIZER_SIZE = 320;

interface DuoBoardVisualizerProps {}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/app-logo.png")}
        style={styles.logoImage}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: VISUALIZER_SIZE, // Fixed width to match button
    height: VISUALIZER_SIZE, // Keep it square
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: "100%",
    height: "100%",
  }
});

export default DuoBoardVisualizer;