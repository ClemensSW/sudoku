import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const LoadingScreen = () => {
  const theme = useTheme();
  const rotation = useSharedValue(0);

  // Set up rotation animation
  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 2000,
        easing: Easing.linear,
      }),
      -1, // -1 means infinite repetitions
      false // false means not reversed (keep going in the same direction)
    );
  }, []);

  // Create animated style for rotation
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Hintergrundbild (identisch mit StartScreen) */}
      <Image
        source={require("@/assets/images/background/mountains_blue.png")}
        style={styles.backgroundImage}
      />

      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          SUDOKU
        </Text>
        <View style={styles.loaderContainer}>
          <Animated.View style={animatedStyle}>
            <Feather name="loader" size={32} color={theme.colors.primary} />
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 60,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  loaderContainer: {
    marginTop: 24,
  },
});

export default LoadingScreen;
