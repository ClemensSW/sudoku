import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";

const LoadingScreen = () => {
  const theme = useTheme();
  
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
          <Feather name="loader" size={32} color={theme.colors.primary} />
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
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  loaderContainer: {
    marginTop: 16,
  },
});

export default LoadingScreen;