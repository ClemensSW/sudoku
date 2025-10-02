import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { Theme } from "@/utils/theme/ThemeProvider";
import { styles } from "../Start.styles";

interface BottomButtonContainerProps {
  theme: Theme;
  insets: { top: number; bottom: number; left: number; right: number };
  buttonAnimatedStyle: any;
  onHowToPlayPress: () => void;
  onStartGamePress: () => void;
  onButtonPressIn: () => void;
  onButtonPressOut: () => void;
}

export const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
  theme,
  insets,
  buttonAnimatedStyle,
  onHowToPlayPress,
  onStartGamePress,
  onButtonPressIn,
  onButtonPressOut,
}) => {
  const { colors, isDark } = theme;

  return (
    <View
      style={[
        styles.bottomContainer,
        { paddingBottom: Math.max(insets.bottom + 60, 76), zIndex: 15 },
      ]}
    >
      <LinearGradient
        colors={
          isDark
            ? ["rgba(32, 33, 36, 0.8)", "rgba(41, 42, 45, 1)", "#35363A"]
            : ["rgba(248, 249, 250, 0.8)", "rgba(255, 255, 255, 1)", "#FFFFFF"]
        }
        style={styles.bottomOverlay}
        locations={[0, 0.19, 1.0]}
      />

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.howToPlayButton}
          onPress={onHowToPlayPress}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.howToPlayText,
              { color: isDark ? "#FFFFFF" : "#1A2C42" },
            ]}
          >
            Wie spielt man?
          </Text>
        </TouchableOpacity>

        <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle]}>
          <TouchableOpacity
            style={[styles.startButton, { backgroundColor: colors.primary }]}
            onPress={onStartGamePress}
            activeOpacity={0.9}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
          >
            <Text style={styles.startButtonText}>Neues Spiel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};
