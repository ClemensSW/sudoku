// screens/DuoGameScreen/components/DuoGameCompletionModal.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  FadeIn,
  SlideInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";

// Importiere angepasste Konfetti-Animation
import ConfettiEffect from "@/components/GameCompletionModal/components/ConfettiEffect/ConfettiEffect";
import Button from "@/components/Button/Button";

const PLAYER_COLORS = {
  // Player 1 (bottom) - Green Theme
  1: {
    name: "Grün",
    // Core colors - enhanced for better contrast in light mode
    primary: "#4A7D78", // Teal - Player 1 (bottom)
    light: "#6CACA6", // Lighter teal for accents
    dark: "#3A6963", // Darker teal for contrast
    
    // Gradients
    gradientStart: "#4A7D78",
    gradientEnd: "rgba(74, 125, 120, 0)", // Transparent end
    
    // Light mode specific adjustments
    lightMode: {
      background: "rgba(74, 125, 120, 0.08)", // Subtle teal background
      border: "#4A7D78", // Solid border color
      text: "#3A6963", // Darker text for contrast
      trophy: {
        glow: "rgba(74, 125, 120, 0.25)", // Subtle glow
        background: "rgba(74, 125, 120, 0.15)", // Background of trophy
        icon: "#4A7D78", // Trophy icon color
      }
    }
  },
  
  // Player 2 (top) - Yellow Theme
  2: {
    name: "Gelb",
    // Core colors - significantly enhanced for better contrast in light mode
    primary: "#8A7B46", // Deeper, more earthy yellow with better contrast
    light: "#D5C178", // Bright yellow-gold for accents
    dark: "#6A5D34", // Very dark yellow for maximum contrast
    
    // Gradients
    gradientStart: "#8A7B46", 
    gradientEnd: "rgba(138, 123, 70, 0)", // Transparent end
    
    // Light mode specific adjustments
    lightMode: {
      background: "rgba(138, 123, 70, 0.08)", // Subtle yellow background
      border: "#8A7B46", // Solid border color
      text: "#6A5D34", // Darker text for contrast
      trophy: {
        glow: "rgba(138, 123, 70, 0.25)", // Subtle glow
        background: "rgba(138, 123, 70, 0.15)", // Background of trophy
        icon: "#8A7B46", // Trophy icon color
      }
    }
  },
  
  // Neutral - Balanced Theme for ties
  neutral: {
    name: "Beide Spieler",
    // Core colors
    primary: "#5E6F78", // Modern slate blue-gray
    light: "#94AEBB", // Lighter accent
    dark: "#3E4B52", // Darker shade for contrast
    
    // Gradients
    gradientStart: "#4A7D78", // Start with green 
    gradientMiddle: "#8A7B46", // Transition to yellow
    gradientEnd: "rgba(0, 0, 0, 0)", // Fade to transparent
    
    // Light mode specific adjustments
    lightMode: {
      background: "rgba(94, 111, 120, 0.08)", // Subtle background
      border: "#5E6F78", // Solid border color
      text: "#3E4B52", // Darker text for contrast
      trophy: {
        glow: "rgba(94, 111, 120, 0.25)", // Subtle glow
        background: "rgba(94, 111, 120, 0.15)", // Background of trophy
        icon: "#5E6F78", // Trophy icon color
      }
    }
  }
};

interface DuoGameCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  winner: 0 | 1 | 2; // 0 = Unentschieden (beide fertig)
  gameTime: number;
  player1Complete: boolean;
  player2Complete: boolean;
  player1Errors: number;
  player2Errors: number;
  player1Hints: number;
  player2Hints: number;
  maxHints: number;
  maxErrors: number;
  winReason: "completion" | "errors"; // Sieg durch Bereichsvollendung oder Gegner-Fehler
}

const DuoGameCompletionModal: React.FC<DuoGameCompletionModalProps> = ({
  visible,
  onClose,
  onNewGame,
  winner,
  gameTime,
  player1Complete,
  player2Complete,
  player1Errors,
  player2Errors,
  player1Hints,
  player2Hints,
  maxHints,
  maxErrors,
  winReason,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isDarkMode = theme.isDark;
  
  // Animation values
  const modalScale = useSharedValue(0.95);
  const modalOpacity = useSharedValue(0);
  const trophy1Scale = useSharedValue(1);
  const trophy2Scale = useSharedValue(1);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString().padStart(2, "0")}`;
  };
  
  // Get winner name based on color
  const getWinnerName = (): string => {
    if (winner === 0) return PLAYER_COLORS.neutral.name;
    return PLAYER_COLORS[winner].name;
  };
  
  // Get title based on win condition
  const getTitle = (): string => {
    if (winner === 0) return "Unentschieden!";
    return `${getWinnerName()} gewinnt!`;
  };
  
  // Get subtitle based on win conditions
  const getSubtitle = (): string => {
    if (winner === 0) {
      return "Beide Spieler haben ihre Aufgabe gelöst!";
    }
    
    if (winReason === "completion") {
      return `${getWinnerName()} hat zuerst den Bereich vollständig gelöst.`;
    }
    
    const loserName = winner === 1 ? PLAYER_COLORS[2].name : PLAYER_COLORS[1].name;
    return `${loserName} hat zu viele Fehler gemacht.`;
  };
  
  // Get motivational message for each player
  const getPlayerMessage = (player: 1 | 2): string => {
    if (winner === 0) {
      // Both completed - positive for both
      return "Großartige Teamleistung! Ein gemeinsamer Erfolg!";
    }
    
    if (player === winner) {
      // Winner message
      if (winReason === "completion") {
        return "Ausgezeichnete Arbeit! Deine Geschwindigkeit und Präzision haben zum Sieg geführt.";
      }
      return "Glückwunsch zum Sieg! Deine Genauigkeit hat sich ausgezahlt.";
    } else {
      // Loser message - encouraging
      if (winReason === "completion") {
        return "Knapp! Du warst auf dem richtigen Weg. Fordere eine Revanche!";
      }
      return "Beim nächsten Mal klappt es bestimmt! Vorsicht ist besser als Eile.";
    }
  };

  // Get gradient colors based on winner
  const getGradientColors = (): readonly [string, string, ...string[]] => {
    if (winner === 0) {
      // Unentschieden: Abstufung beider Farben
      return [
        PLAYER_COLORS[1].gradientStart,
        PLAYER_COLORS[2].gradientStart,
        PLAYER_COLORS.neutral.gradientEnd
      ] as const; // Use const assertion to create a readonly tuple
    }
    
    // Einzelner Gewinner: Nur dessen Farbe
    return [
      PLAYER_COLORS[winner].gradientStart,
      PLAYER_COLORS[winner].gradientEnd
    ] as const; // Use const assertion to create a readonly tuple
  };
  
  // Helper function to get player card border color based on winner and theme
  const getPlayerCardBorderColor = (player: 1 | 2) => {
    // If this player is the winner, use their theme color
    if (winner === player) {
      return isDarkMode 
        ? PLAYER_COLORS[player].primary // In dark mode, use the standard primary
        : PLAYER_COLORS[player].lightMode.border; // In light mode, use the enhanced border color
    }
    
    // Otherwise use a neutral border
    return isDarkMode 
      ? colors.border // Default dark mode border
      : 'rgba(0,0,0,0.15)'; // Slightly darker border for light mode
  };
  
  // Helper function to get player card background based on theme
  const getPlayerCardBackground = (player: 1 | 2) => {
    // In dark mode, just use the surface color
    if (isDarkMode) {
      return colors.surface;
    }
    
    // In light mode, use a subtle colored background if this player is the winner
    if (winner === player || winner === 0) {
      return colors.surface;
    }
    
    // Otherwise use the default surface color
    return colors.surface;
  };
  
  // Helper function to get trophy colors based on player and theme
  const getTrophyColors = (player: 1 | 2) => {
    if (isDarkMode) {
      return {
        glow: PLAYER_COLORS[player].primary,
        background: `rgba(${player === 1 ? '74, 125, 120' : '138, 123, 70'}, 0.15)`,
        icon: PLAYER_COLORS[player].primary
      };
    }
    
    return {
      glow: PLAYER_COLORS[player].lightMode.trophy.glow,
      background: PLAYER_COLORS[player].lightMode.trophy.background,
      icon: PLAYER_COLORS[player].lightMode.trophy.icon
    };
  };
  
  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      modalScale.value = 0.95;
      modalOpacity.value = 0;
      
      // Main modal animation
      modalScale.value = withTiming(1, {
        duration: 350,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      modalOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      
      // Trophy animations - staggered
      if (winner === 1 || winner === 0) {
        trophy1Scale.value = withSequence(
          withTiming(0.8, { duration: 100 }),
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
      }
      
      if (winner === 2 || winner === 0) {
        trophy2Scale.value = withSequence(
          withTiming(0.8, { duration: 200 }),
          withTiming(1.2, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
      }
      
      // Haptic feedback based on result
      if (winner === 0) {
        triggerHaptic("success");
      } else {
        triggerHaptic("success");
      }
    }
  }, [visible]);
  
  // Animated styles
  const modalAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: modalScale.value }],
      opacity: modalOpacity.value,
    };
  });
  
  const trophy1AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: trophy1Scale.value }],
    };
  });
  
  const trophy2AnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: trophy2Scale.value }],
    };
  });
  
  if (!visible) return null;
  
  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.modalContainer, 
          { backgroundColor: colors.background },
          modalAnimatedStyle
        ]}
      >
        {/* Confetti effect */}
        <ConfettiEffect isActive={visible} density={winner === 0 ? 3 : 2} />
        
        {/* Gradient Header */}
        <LinearGradient
          colors={getGradientColors()}
          style={styles.headerGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        />
        
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {getTitle()}
          </Text>
          
          <Text style={styles.subtitle}>
            {getSubtitle()}
          </Text>

          {/* Game time */}
          <View style={styles.timeContainer}>
            <Feather name="clock" size={18} color="#FFFFFF" style={styles.timeIcon} />
            <Text style={styles.timeText}>
              {formatTime(gameTime)}
            </Text>
          </View>
        </View>
        
        {/* Scrollable content */}
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Grün (Player 1) Card */}
          <View style={[
            styles.playerCard,
            { 
              borderColor: getPlayerCardBorderColor(1),
              backgroundColor: getPlayerCardBackground(1),
              // Enhanced shadow for light mode
              ...(!isDarkMode && winner === 1 ? {
                shadowColor: PLAYER_COLORS[1].primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4
              } : {})
            }
          ]}>
            <View style={styles.playerCardHeader}>
              <View style={styles.playerTitleArea}>
                <Text 
                  style={[
                    styles.playerCardTitle, 
                    { 
                      color: isDarkMode 
                        ? PLAYER_COLORS[1].primary 
                        : PLAYER_COLORS[1].lightMode.text
                    }
                  ]}
                >
                  {PLAYER_COLORS[1].name}
                </Text>
              </View>
              
              {winner === 1 && (
                <Animated.View 
                  style={[
                    styles.trophyContainer,
                    trophy1AnimatedStyle
                  ]}
                >
                  {/* Outer glow effect */}
                  <Animated.View 
                    style={[
                      styles.trophyGlow,
                      { backgroundColor: getTrophyColors(1).glow }
                    ]}
                  />
                  
                  {/* Trophy background */}
                  <View 
                    style={[
                      styles.trophyInner,
                      { backgroundColor: getTrophyColors(1).background }
                    ]}
                  >
                    <Feather 
                      name="award" 
                      size={22} 
                      color={getTrophyColors(1).icon} 
                    />
                  </View>
                </Animated.View>
              )}
            </View>
            
            <Text 
              style={[
                styles.playerMessage, 
                { 
                  color: isDarkMode 
                    ? colors.textPrimary 
                    : winner === 1 
                      ? PLAYER_COLORS[1].lightMode.text 
                      : colors.textPrimary
                }
              ]}
            >
              {getPlayerMessage(1)}
            </Text>
            
            <View style={[
              styles.statsContainer, 
              { 
                backgroundColor: isDarkMode 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0,0,0,0.03)'
              }
            ]}>
              <View style={styles.statItem}>
                <Feather name="heart" size={16} color={colors.error} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {maxErrors - player1Errors}/{maxErrors}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Leben
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
              
              <View style={styles.statItem}>
                <Feather name="help-circle" size={16} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {player1Hints}/{maxHints}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Hinweise
                </Text>
              </View>
            </View>
          </View>
          
          {/* Gelb (Player 2) Card */}
          <View style={[
            styles.playerCard,
            { 
              borderColor: getPlayerCardBorderColor(2),
              backgroundColor: getPlayerCardBackground(2),
              // Enhanced shadow for light mode
              ...(!isDarkMode && winner === 2 ? {
                shadowColor: PLAYER_COLORS[2].primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4
              } : {})
            }
          ]}>
            <View style={styles.playerCardHeader}>
              <View style={styles.playerTitleArea}>
                <Text 
                  style={[
                    styles.playerCardTitle, 
                    { 
                      color: isDarkMode 
                        ? PLAYER_COLORS[2].primary 
                        : PLAYER_COLORS[2].lightMode.text
                    }
                  ]}
                >
                  {PLAYER_COLORS[2].name}
                </Text>
              </View>
              
              {winner === 2 && (
                <Animated.View 
                  style={[
                    styles.trophyContainer,
                    trophy2AnimatedStyle
                  ]}
                >
                  {/* Outer glow effect */}
                  <Animated.View 
                    style={[
                      styles.trophyGlow,
                      { backgroundColor: getTrophyColors(2).glow }
                    ]}
                  />
                  
                  {/* Trophy background */}
                  <View 
                    style={[
                      styles.trophyInner,
                      { backgroundColor: getTrophyColors(2).background }
                    ]}
                  >
                    <Feather 
                      name="award" 
                      size={22} 
                      color={getTrophyColors(2).icon} 
                    />
                  </View>
                </Animated.View>
              )}
            </View>
            
            <Text 
              style={[
                styles.playerMessage, 
                { 
                  color: isDarkMode 
                    ? colors.textPrimary 
                    : winner === 2 
                      ? PLAYER_COLORS[2].lightMode.text 
                      : colors.textPrimary
                }
              ]}
            >
              {getPlayerMessage(2)}
            </Text>
            
            <View style={[
              styles.statsContainer, 
              { 
                backgroundColor: isDarkMode 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0,0,0,0.03)'
              }
            ]}>
              <View style={styles.statItem}>
                <Feather name="heart" size={16} color={colors.error} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {maxErrors - player2Errors}/{maxErrors}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Leben
                </Text>
              </View>
              
              <View style={[styles.divider, { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
              
              <View style={styles.statItem}>
                <Feather name="help-circle" size={16} color={colors.primary} />
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>
                  {player2Hints}/{maxHints}
                </Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Hinweise
                </Text>
              </View>
            </View>
          </View>
          
          {/* Zusätzliches Padding für die Buttons am Ende */}
          <View style={{ height: 90 }} />
        </Animated.ScrollView>
        
        {/* Button container - fixed at bottom */}
        <View style={[
          styles.buttonContainer,
          { 
            backgroundColor: colors.background,
            borderTopWidth: 1,
            borderTopColor: theme.isDark ? 
              'rgba(255,255,255,0.1)' : 
              'rgba(0,0,0,0.05)'
          }
        ]}>
          <Button
            title="Revanche!"
            onPress={onNewGame}
            variant="primary"
            style={styles.button}
            icon={<Feather name="refresh-cw" size={20} color="white" />}
            iconPosition="left"
          />
          
          <Button
            title="Zum Menü"
            onPress={onClose}
            variant="outline"
            style={styles.button}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 9999,
  },
  modalContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    alignItems: "center",
  },
  // Gradient Header
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    zIndex: 0,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 24,
    zIndex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    color: "#FFFFFF",
    textShadowColor: "rgba(0,0,0,0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  // Spielzeit Container
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  timeIcon: {
    marginRight: 8,
  },
  timeText: {
    fontSize: 18,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    color: "#FFFFFF",
  },
  // ScrollView
  scrollView: {
    width: "100%",
    flex: 1,
    zIndex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  // Player card (gleiche Hintergrundfarbe wie Modal-Hintergrund)
  playerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  playerCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  playerTitleArea: {
    flex: 1,
  },
  playerCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 2,
  },
  // Trophy-related styles
  trophyContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  trophyInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  trophyGlow: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    opacity: 0.3,
  },
  playerMessage: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    fontWeight: "500",
  },
  // Stats container (flache Hintergrundfarbe)
  statsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  divider: {
    width: 1,
    height: "80%",
    marginHorizontal: 10,
  },
  // Button container
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    zIndex: 2,
  },
  button: {
    width: "100%",
    marginBottom: 12,
    height: 56,
  },
});

export default DuoGameCompletionModal;