import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Theme } from "@/utils/theme/ThemeProvider";
import { PausedGameState } from "@/utils/storage";
import { styles } from "../Start.styles";

interface BottomButtonContainerProps {
  theme: Theme;
  insets: { top: number; bottom: number; left: number; right: number };
  buttonAnimatedStyle: any;
  onHowToPlayPress: () => void;
  onStartGamePress: () => void;
  onResumeGamePress?: () => void;
  pausedGame?: PausedGameState | null;
  onButtonPressIn: () => void;
  onButtonPressOut: () => void;
}

export const BottomButtonContainer: React.FC<BottomButtonContainerProps> = ({
  theme,
  insets,
  buttonAnimatedStyle,
  onHowToPlayPress,
  onStartGamePress,
  onResumeGamePress,
  pausedGame,
  onButtonPressIn,
  onButtonPressOut,
}) => {
  const { colors, isDark } = theme;

  // Helper to format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to get difficulty label
  const getDifficultyLabel = (difficulty: string): string => {
    const labels: Record<string, string> = {
      easy: "Leicht",
      medium: "Mittel",
      hard: "Schwer",
      expert: "Experte"
    };
    return labels[difficulty] || difficulty;
  };

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

        {/* Resume Game Button - nur wenn pausiertes Spiel vorhanden */}
        {pausedGame && onResumeGamePress && (
          <Animated.View style={[styles.buttonWrapper, buttonAnimatedStyle, { marginBottom: 12 }]}>
            <TouchableOpacity
              style={[styles.startButton, { backgroundColor: colors.primary }]}
              onPress={onResumeGamePress}
              activeOpacity={0.9}
              onPressIn={onButtonPressIn}
              onPressOut={onButtonPressOut}
            >
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={styles.startButtonText}>Spiel fortsetzen</Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                  opacity: 0.9
                }}>
                  <Feather name="pause-circle" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={{
                    fontSize: 13,
                    color: '#FFFFFF',
                    fontWeight: '500',
                    marginRight: 8
                  }}>
                    {formatTime(pausedGame.gameTime)}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: '#FFFFFF',
                    fontWeight: '500'
                  }}>
                    {getDifficultyLabel(pausedGame.difficulty)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* New Game Button */}
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
