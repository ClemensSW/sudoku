import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Theme } from "@/utils/theme/ThemeProvider";
import { PausedGameState } from "@/utils/storage";
import { useProgressColor } from "@/hooks/useProgressColor";
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
  const { t } = useTranslation('start');
  const { colors, isDark } = theme;
  const progressColor = useProgressColor();

  // Helper to format time for display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper to get difficulty label
  const getDifficultyLabel = (difficulty: string): string => {
    return t(`difficultyModal.difficulties.${difficulty}`, difficulty);
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
        {/* "Wie spielt man?" nur anzeigen wenn kein pausiertes Spiel vorhanden */}
        {!pausedGame && (
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
              {t('buttons.howToPlay')}
            </Text>
          </TouchableOpacity>
        )}

        {/* Resume Game Button - nur wenn pausiertes Spiel vorhanden */}
        {pausedGame && onResumeGamePress && (
          <Animated.View style={[styles.buttonWrapper, { marginBottom: 14 }]}>
            <TouchableOpacity
              style={[
                styles.resumeButton,
                {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.15)',
                }
              ]}
              onPress={onResumeGamePress}
              activeOpacity={0.7}
            >
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={[
                  styles.resumeButtonText,
                  { color: isDark ? '#E2E8F0' : '#334155' }
                ]}>
                  {t('buttons.resumeGame')}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                  opacity: 0.7
                }}>
                  <Feather
                    name="pause-circle"
                    size={13}
                    color={isDark ? '#94A3B8' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{
                    fontSize: 13,
                    color: isDark ? '#94A3B8' : '#64748B',
                    fontWeight: '500',
                    marginRight: 8
                  }}>
                    {formatTime(pausedGame.gameTime)}
                  </Text>
                  <Text style={{
                    fontSize: 13,
                    color: isDark ? '#94A3B8' : '#64748B',
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
            style={[styles.startButton, { backgroundColor: progressColor }]}
            onPress={onStartGamePress}
            activeOpacity={0.9}
            onPressIn={onButtonPressIn}
            onPressOut={onButtonPressOut}
          >
            <Text style={styles.startButtonText}>{t('buttons.newGame')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};
