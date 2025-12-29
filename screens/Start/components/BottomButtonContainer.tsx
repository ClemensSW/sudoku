import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import Animated from "react-native-reanimated";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Theme } from "@/utils/theme/ThemeProvider";
import { PausedGameState } from "@/utils/storage";
import { useProgressColor } from "@/hooks/useProgressColor";
import Button from "@/components/Button/Button";
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
  const { colors, isDark, typography } = theme;
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
        { paddingBottom: Math.max(insets.bottom + 90, 100), zIndex: 15 },
      ]}
    >
      <LinearGradient
        colors={[`${colors.background}00`, colors.background, colors.background]}
        style={styles.bottomOverlay}
        locations={[0, 0.3, 1.0]}
      />

      <View style={styles.buttonsContainer}>
        {/* Help Button - runder Glaseffekt-Button mit Fragezeichen */}
        {!pausedGame && (
          <TouchableOpacity
            onPress={onHowToPlayPress}
            activeOpacity={0.8}
            style={[
              styles.helpButton,
              {
                borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.1)',
              }
            ]}
          >
            <BlurView
              intensity={isDark ? 40 : 60}
              tint={isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
            <Ionicons
              name="help-outline"
              size={26}
              color={isDark ? '#E2E8F0' : '#334155'}
            />
          </TouchableOpacity>
        )}

        {/* Resume Game Button - nur wenn pausiertes Spiel vorhanden */}
        {pausedGame && onResumeGamePress && (
          <Animated.View style={[styles.buttonWrapper, { marginBottom: 14 }]}>
            <TouchableOpacity
              onPress={onResumeGamePress}
              activeOpacity={0.8}
              style={[
                styles.resumeButton,
                {
                  borderColor: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }
              ]}
            >
              <BlurView
                intensity={isDark ? 40 : 60}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
              <View style={{ alignItems: 'center', width: '100%' }}>
                <Text style={[
                  styles.resumeButtonText,
                  { color: isDark ? '#E2E8F0' : '#334155', fontSize: typography.size.md }
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
                    fontSize: typography.size.xs,
                    color: isDark ? '#94A3B8' : '#64748B',
                    fontWeight: '500',
                    marginRight: 8
                  }}>
                    {formatTime(pausedGame.gameTime)}
                  </Text>
                  <Text style={{
                    fontSize: typography.size.xs,
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
          <Button
            title={t('buttons.newGame')}
            onPress={onStartGamePress}
            variant="primary"
            customColor={progressColor}
            style={styles.startButton}
          />
        </Animated.View>
      </View>
    </View>
  );
};
