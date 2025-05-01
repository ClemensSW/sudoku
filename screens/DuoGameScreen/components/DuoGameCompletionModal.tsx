// screens/DuoGameScreen/components/DuoGameCompletionModal.tsx
import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import ConfettiEffect from "@/components/GameCompletionModal/components/ConfettiEffect/ConfettiEffect";
import Button from "@/components/Button/Button";

// Duo Mode primary color - used consistently throughout
const DUO_COLOR = "#4A7D78";
const YELLOW_COLOR = "#8A7B46";

// Player colors
const PLAYER_COLORS = {
  1: {
    name: "Grün",
    primary: DUO_COLOR,
    secondary: "#6CACA6",
    background: "rgba(74, 125, 120, 0.1)",
  },
  2: {
    name: "Gelb",
    primary: YELLOW_COLOR,
    secondary: "#D5C178",
    background: "rgba(138, 123, 70, 0.1)",
  }
};

interface DuoGameCompletionModalProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  winner: 0 | 1 | 2; // 0 = Tie (both complete)
  gameTime: number;
  player1Complete: boolean;
  player2Complete: boolean;
  player1Errors: number;
  player2Errors: number;
  player1Hints: number;
  player2Hints: number;
  maxHints: number;
  maxErrors: number;
  winReason: "completion" | "errors";
  // Mock data for calculation (in real implementation, you would get these values from the game state)
  player1InitialEmptyCells?: number;
  player1SolvedCells?: number;
  player2InitialEmptyCells?: number;
  player2SolvedCells?: number;
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
  // For demo purposes only - you should pass real values from your game state
  player1InitialEmptyCells = 40,
  player1SolvedCells = player1Complete ? 40 : 32,
  player2InitialEmptyCells = 40,
  player2SolvedCells = player2Complete ? 40 : 28,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isDarkMode = theme.isDark;
  
  // Animation values
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);
  const player1Scale = useSharedValue(0.9);
  const player2Scale = useSharedValue(0.9);
  const vsScale = useSharedValue(0.5);
  const trophy1Scale = useSharedValue(1);
  const trophy2Scale = useSharedValue(1);
  const buttonOpacity = useSharedValue(0);
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  // Helper functions to determine display text
  const getResultText = (): string => {
    if (winner === 0) return "Unentschieden!";
    return `${PLAYER_COLORS[winner].name} siegt!`;
  };
  
  const getResultSubtext = (): string => {
    if (winner === 0) {
      return "Beide Spieler haben es geschafft!";
    }
    if (winReason === "completion") {
      return `Bereich schneller gelöst`;
    }
    return `Gegner hat zu viele Fehler gemacht`;
  };
  
  // Calculate cell completion percentage
  const getCellCompletionPercentage = (player: 1 | 2): number => {
    // If this player is the winner or if it's a tie, show 100%
    if (winner === player || winner === 0) {
      return 100;
    }
    
    // Otherwise calculate percentage of solved cells
    if (player === 1) {
      return Math.round((player1SolvedCells / player1InitialEmptyCells) * 100);
    } else {
      return Math.round((player2SolvedCells / player2InitialEmptyCells) * 100);
    }
  };
  
  // Start animations when modal becomes visible
  useEffect(() => {
    if (visible) {
      // Reset animation values
      opacity.value = 0;
      scale.value = 0.95;
      player1Scale.value = 0.9;
      player2Scale.value = 0.9;
      vsScale.value = 0.5;
      buttonOpacity.value = 0;
      
      // Sequence the animations
      opacity.value = withTiming(1, { duration: 400 });
      scale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.5)) });
      
      // Player panels animation with slight delay between them
      player1Scale.value = withDelay(200, withTiming(1, { 
        duration: 600, 
        easing: Easing.out(Easing.back(1.5)) 
      }));
      
      player2Scale.value = withDelay(300, withTiming(1, { 
        duration: 600, 
        easing: Easing.out(Easing.back(1.5)) 
      }));
      
      // VS animation
      vsScale.value = withDelay(500, withTiming(1, { 
        duration: 400, 
        easing: Easing.out(Easing.back(2)) 
      }));
      
      // Trophy animations
      if (winner === 1 || winner === 0) {
        trophy1Scale.value = withDelay(800, withSequence(
          withTiming(1.3, { duration: 300 }),
          withTiming(1, { duration: 200 })
        ));
      }
      
      if (winner === 2 || winner === 0) {
        trophy2Scale.value = withDelay(900, withSequence(
          withTiming(1.3, { duration: 300 }),
          withTiming(1, { duration: 200 })
        ));
      }
      
      // Buttons fade in last
      buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
      
      // Trigger haptic feedback
      triggerHaptic("success");
    }
  }, [visible]);
  
  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }]
  }));
  
  const player1Style = useAnimatedStyle(() => ({
    transform: [{ scale: player1Scale.value }]
  }));
  
  const player2Style = useAnimatedStyle(() => ({
    transform: [{ scale: player2Scale.value }]
  }));
  
  const vsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: vsScale.value }],
    opacity: vsScale.value
  }));
  
  const trophy1Style = useAnimatedStyle(() => ({
    transform: [{ scale: trophy1Scale.value }]
  }));
  
  const trophy2Style = useAnimatedStyle(() => ({
    transform: [{ scale: trophy2Scale.value }]
  }));
  
  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value
  }));
  
  // Don't render when not visible
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View 
        style={[
          styles.container, 
          { backgroundColor: isDarkMode ? '#15181D' : '#F8F9FA' },
          containerStyle
        ]}
      >
        {/* Confetti effect for visual excitement */}
        <ConfettiEffect isActive={visible} density={winner === 0 ? 3 : 2} />
        
        {/* Gradient header */}
        <LinearGradient
          colors={winner === 0 
            ? [PLAYER_COLORS[1].primary, PLAYER_COLORS[2].primary, "transparent"] 
            : [PLAYER_COLORS[winner].primary, "transparent"]}
          style={styles.headerGradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.6 }}
        />
        
        {/* Header with game time */}
        <View style={styles.header}>
          <View style={[styles.timeContainer, { backgroundColor: DUO_COLOR }]}>
            <Feather name="clock" size={18} color="#FFFFFF" />
            <Text style={styles.timeText}>{formatTime(gameTime)}</Text>
          </View>
        </View>
        
        {/* Main result text - Large and bold */}
        <Text 
          style={[
            styles.resultText, 
            { color: isDarkMode ? '#FFFFFF' : '#202124' }
          ]}
        >
          {getResultText()}
        </Text>
        
        <Text 
          style={[
            styles.resultSubtext, 
            { color: isDarkMode ? colors.textSecondary : '#5F6368' }
          ]}
        >
          {getResultSubtext()}
        </Text>
        
        {/* Battle container - placed below the result text */}
        <View style={styles.battleContainer}>
          {/* Player 1 Panel - Bottom player (Grün) */}
          <Animated.View 
            style={[
              styles.playerPanel,
              { 
                backgroundColor: isDarkMode ? 
                  'rgba(74, 125, 120, 0.15)' : 
                  'rgba(74, 125, 120, 0.08)',
                borderColor: PLAYER_COLORS[1].primary,
                // Make loser panel more transparent
                opacity: winner !== 0 && winner !== 1 ? 0.7 : 1
              },
              player1Style
            ]}
          >
            {/* Winner badge */}
            {winner === 1 && (
              <View style={styles.winnerBadge}>
                <Text style={styles.winnerText}>SIEGER</Text>
              </View>
            )}
            
            {/* Player name with trophy for winner */}
            <View style={styles.playerHeader}>
              <Text style={[
                styles.playerName,
                { color: isDarkMode ? '#FFFFFF' : '#202124' }
              ]}>
                {PLAYER_COLORS[1].name}
              </Text>
              
              {/* Trophy for winner or tie - moved outside the layout flow */}
              {(winner === 1 || winner === 0) && (
                <Animated.View 
                  style={[styles.trophyContainer, trophy1Style]}
                >
                  <View style={[
                    styles.trophyCircle,
                    { backgroundColor: 'rgba(74, 125, 120, 0.2)' }
                  ]}>
                    <Feather 
                      name={winner === 1 ? "award" : "star"} 
                      size={winner === 1 ? 20 : 16} 
                      color={PLAYER_COLORS[1].primary} 
                    />
                  </View>
                </Animated.View>
              )}
            </View>
            
            {/* Cell completion percentage */}
            <View style={styles.performanceContainer}>
              <Text style={[
                styles.performanceText,
                { color: PLAYER_COLORS[1].primary }
              ]}>
                {getCellCompletionPercentage(1)}%
              </Text>
              
              <View style={styles.statsRow}>
                {/* Errors indicator - now using player color */}
                <View style={styles.statItem}>
                  <Feather name="heart" size={14} color={PLAYER_COLORS[1].primary} />
                  <Text style={[
                    styles.statValue,
                    { color: isDarkMode ? '#E8EAED' : '#5F6368' }
                  ]}>
                    {maxErrors - player1Errors}/{maxErrors}
                  </Text>
                </View>
                
                {/* Hints indicator */}
                <View style={styles.statItem}>
                  <Feather name="help-circle" size={14} color={PLAYER_COLORS[1].primary} />
                  <Text style={[
                    styles.statValue,
                    { color: isDarkMode ? '#E8EAED' : '#5F6368' }
                  ]}>
                    {maxHints - player1Hints}/{maxHints}
                  </Text>
                </View>
              </View>
              
              {/* Completion status - now using player color */}
              <View style={[
                styles.completionBadge,
                { 
                  backgroundColor: player1Complete ? 
                    `${PLAYER_COLORS[1].primary}15` : 
                    `${PLAYER_COLORS[1].primary}10`,
                  borderColor: player1Complete ?
                    `${PLAYER_COLORS[1].primary}30` :
                    `${PLAYER_COLORS[1].primary}20`
                }
              ]}>
                <Feather 
                  name={player1Complete ? "check" : "x"} 
                  size={12} 
                  color={PLAYER_COLORS[1].primary} 
                />
                <Text style={[
                  styles.completionText,
                  { color: PLAYER_COLORS[1].primary }
                ]}>
                  {player1Complete ? "Vollständig" : "Unvollständig"}
                </Text>
              </View>
            </View>
          </Animated.View>
          
          {/* VS Divider - now perfectly centered */}
          <Animated.View style={[styles.vsContainer, vsStyle]}>
            <LinearGradient
              colors={[PLAYER_COLORS[1].primary, PLAYER_COLORS[2].primary]}
              style={styles.vsGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.vsText}>VS</Text>
            </LinearGradient>
          </Animated.View>
          
          {/* Player 2 Panel - Top player (Gelb) */}
          <Animated.View 
            style={[
              styles.playerPanel,
              { 
                backgroundColor: isDarkMode ? 
                  'rgba(138, 123, 70, 0.15)' : 
                  'rgba(138, 123, 70, 0.08)',
                borderColor: PLAYER_COLORS[2].primary,
                // Make loser panel more transparent
                opacity: winner !== 0 && winner !== 2 ? 0.7 : 1
              },
              player2Style
            ]}
          >
            {/* Winner badge */}
            {winner === 2 && (
              <View style={styles.winnerBadge}>
                <Text style={styles.winnerText}>SIEGER</Text>
              </View>
            )}
            
            {/* Player name with trophy for winner */}
            <View style={styles.playerHeader}>
              <Text style={[
                styles.playerName,
                { color: isDarkMode ? '#FFFFFF' : '#202124' }
              ]}>
                {PLAYER_COLORS[2].name}
              </Text>
              
              {/* Trophy for winner or tie - moved outside the layout flow */}
              {(winner === 2 || winner === 0) && (
                <Animated.View 
                  style={[styles.trophyContainer, trophy2Style]}
                >
                  <View style={[
                    styles.trophyCircle,
                    { backgroundColor: 'rgba(138, 123, 70, 0.2)' }
                  ]}>
                    <Feather 
                      name={winner === 2 ? "award" : "star"} 
                      size={winner === 2 ? 20 : 16} 
                      color={PLAYER_COLORS[2].primary} 
                      />
                  </View>
                </Animated.View>
              )}
            </View>
            
            {/* Cell completion percentage */}
            <View style={styles.performanceContainer}>
              <Text style={[
                styles.performanceText,
                { color: PLAYER_COLORS[2].primary }
              ]}>
                {getCellCompletionPercentage(2)}%
              </Text>
              
              <View style={styles.statsRow}>
                {/* Errors indicator - now using player color */}
                <View style={styles.statItem}>
                  <Feather name="heart" size={14} color={PLAYER_COLORS[2].primary} />
                  <Text style={[
                    styles.statValue,
                    { color: isDarkMode ? '#E8EAED' : '#5F6368' }
                  ]}>
                    {maxErrors - player2Errors}/{maxErrors}
                  </Text>
                </View>
                
                {/* Hints indicator */}
                <View style={styles.statItem}>
                  <Feather name="help-circle" size={14} color={PLAYER_COLORS[2].primary} />
                  <Text style={[
                    styles.statValue,
                    { color: isDarkMode ? '#E8EAED' : '#5F6368' }
                  ]}>
                    {maxHints - player2Hints}/{maxHints}
                  </Text>
                </View>
              </View>
              
              {/* Completion status - now using player color */}
              <View style={[
                styles.completionBadge,
                { 
                  backgroundColor: player2Complete ? 
                    `${PLAYER_COLORS[2].primary}15` : 
                    `${PLAYER_COLORS[2].primary}10`,
                  borderColor: player2Complete ?
                    `${PLAYER_COLORS[2].primary}30` :
                    `${PLAYER_COLORS[2].primary}20`
                }
              ]}>
                <Feather 
                  name={player2Complete ? "check" : "x"} 
                  size={12} 
                  color={PLAYER_COLORS[2].primary} 
                />
                <Text style={[
                  styles.completionText,
                  { color: PLAYER_COLORS[2].primary }
                ]}>
                  {player2Complete ? "Vollständig" : "Unvollständig"}
                </Text>
              </View>
            </View>
          </Animated.View>
        </View>
        
        {/* Action buttons */}
        <Animated.View style={[styles.buttonsContainer, buttonsStyle]}>
          {/* Revanche Button */}
          <Button
            title="Revanche!"
            onPress={onNewGame}
            variant="primary"
            style={styles.revangeButton}
            icon={<Feather name="refresh-cw" size={20} color="#FFFFFF" />}
            iconPosition="left"
          />
          
          {/* Zum Menü Button */}
          <Button
            title="Zum Menü"
            onPress={onClose}
            variant="outline"
            style={styles.menuButton}
            textStyle={{ color: DUO_COLOR }}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
};

// Styles without array syntax for button styles
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
  container: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 40,
  },
  // Header gradient
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 180,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
    zIndex: 1,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
    justifyContent: "center",
  },
  timeText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    fontVariant: ["tabular-nums"],
  },
  resultText: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
    zIndex: 1,
  },
  resultSubtext: {
    fontSize: 16,
    marginBottom: 36,
    textAlign: "center",
    opacity: 0.8,
    zIndex: 1,
  },
  // Battle layout styles - positioned below the title
  battleContainer: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 220,
    position: "relative",
    marginTop: 0, // No extra margin needed now
  },
  playerPanel: {
    width: "45%", // Slightly reduced width to ensure proper spacing
    height: "100%",
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    justifyContent: "flex-start",
    position: "relative", // For winner badge
  },
  // Winner badge
  winnerBadge: {
    position: "absolute",
    top: -12,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },
  winnerText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#FFFFFF",
    backgroundColor: DUO_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
  playerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    minHeight: 28, // Ensure consistent height with or without trophy
  },
  playerName: {
    fontSize: 18,
    fontWeight: "700",
  },
  trophyContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  trophyCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  // VS container - perfectly centered
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
  vsGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  vsText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  // Player stats styles - with fixed heights for consistency
  performanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 140, // Fixed height to ensure alignment
  },
  performanceText: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 12,
    height: 40, // Fixed height for label
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 16,
    height: 24, // Fixed height for stats row
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  completionBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
    height: 24, // Fixed height for completion badge
  },
  completionText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  // Button styles
  buttonsContainer: {
    position: "absolute",
    bottom: 48,
    left: 24,
    right: 24,
    zIndex: 5,
  },
  revangeButton: {
    width: "100%",
    height: 56,
    marginBottom: 16,
    backgroundColor: DUO_COLOR,
  },
  menuButton: {
    width: "100%",
    height: 56,
    borderColor: DUO_COLOR,
  },
});

export default DuoGameCompletionModal;