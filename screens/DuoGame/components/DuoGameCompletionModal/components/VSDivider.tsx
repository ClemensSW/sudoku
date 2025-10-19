// screens/DuoGame/components/DuoGameCompletionModal/components/VSDivider.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface VSDividerProps {
  vsScale: Animated.SharedValue<number>;
}

const VSDivider: React.FC<VSDividerProps> = ({ vsScale }) => {
  const { isDark } = useTheme();

  const vsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: vsScale.value }],
    opacity: vsScale.value,
  }));

  return (
    <Animated.View style={[styles.vsContainer, vsStyle]}>
      <View
        style={[
          styles.vsCircle,
          {
            borderColor: isDark
              ? "rgba(255,255,255,0.3)"
              : "rgba(0,0,0,0.15)",
            backgroundColor: isDark ? "rgba(0,0,0,0.6)" : "white",
          },
        ]}
      >
        <Text
          style={[
            styles.vsText,
            { color: isDark ? "#FFFFFF" : "#202124" },
          ]}
        >
          VS
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  vsContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 40,
    height: 40,
    marginLeft: -20, // Center horizontally
    marginTop: -20, // Center vertically
    zIndex: 10,
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  vsText: {
    fontWeight: "900",
    fontSize: 16,
  },
});

export default VSDivider;
