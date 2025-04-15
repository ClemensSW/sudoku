// screens/DuoGameScreen/components/DuoGameStatusBar.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { 
  FadeIn, 
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing
} from "react-native-reanimated";
import Timer from "@/components/Timer/Timer";

// Player themes to match the board colors
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    background: "rgba(74, 125, 120, 0.2)", // Light teal background
    activeBackground: "rgba(74, 125, 120, 0.4)", // More visible when active
    completeBackground: "rgba(74, 125, 120, 0.6)", // Even more visible when complete
    textColor: "#4A7D78", // Dark teal
    iconColor: "#4A7D78", // Dark teal
  },
  // Player 2 (top)
  2: {
    background: "rgba(91, 93, 110, 0.2)", // Light blue-gray background
    activeBackground: "rgba(91, 93, 110, 0.4)", // More visible when active
    completeBackground: "rgba(91, 93, 110, 0.6)", // Even more visible when complete
    textColor: "#5B5D6E", // Dark blue-gray
    iconColor: "#5B5D6E", // Dark blue-gray
  },
};

interface DuoGameStatusBarProps {
  isGameRunning: boolean;
  gameTime: number;
  onTimeUpdate?: (time: number) => void;
  player1Complete: boolean;
  player2Complete: boolean;
  player1Cell: { row: number; col: number } | null;
  player2Cell: { row: number; col: number } | null;
}

const DuoGameStatusBar: React.FC<DuoGameStatusBarProps> = ({
  isGameRunning,
  gameTime,
  onTimeUpdate,
  player1Complete,
  player2Complete,
  player1Cell,
  player2Cell,
}) => {
  // Animation values for player indicators
  const player1Opacity = useSharedValue(player1Cell ? 1 : 0.7);
  const player2Opacity = useSharedValue(player2Cell ? 1 : 0.7);
  
  // Pulse animation when a player completes their area
  const player1CompletePulse = useSharedValue(player1Complete ? 1.1 : 1);
  const player2CompletePulse = useSharedValue(player2Complete ? 1.1 : 1);

  // Update animations when player selection changes
  React.useEffect(() => {
    // Player 1 selection indicator
    player1Opacity.value = withTiming(player1Cell ? 1 : 0.7, {
      duration: 200,
      easing: Easing.ease,
    });
    
    // Player 2 selection indicator
    player2Opacity.value = withTiming(player2Cell ? 1 : 0.7, {
      duration: 200,
      easing: Easing.ease,
    });
  }, [player1Cell, player2Cell]);

  // Update animations when a player completes their area
  React.useEffect(() => {
    if (player1Complete) {
      player1CompletePulse.value = withRepeat(
        withTiming(1.1, { duration: 1000 }),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      player1CompletePulse.value = withTiming(1, { duration: 300 });
    }
    
    if (player2Complete) {
      player2CompletePulse.value = withRepeat(
        withTiming(1.1, { duration: 1000 }),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      player2CompletePulse.value = withTiming(1, { duration: 300 });
    }
  }, [player1Complete, player2Complete]);

  // Animated styles
  const player1Style = useAnimatedStyle(() => {
    return {
      opacity: player1Opacity.value,
      transform: [{ scale: player1CompletePulse.value }],
    };
  });
  
  const player2Style = useAnimatedStyle(() => {
    return {
      opacity: player2Opacity.value,
      transform: [{ scale: player2CompletePulse.value }],
    };
  });

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(500)}
    >
      <View style={styles.statusRow}>
        {/* Player 2 (Top) Status */}
        <Animated.View 
          style={[
            styles.playerIndicator,
            {
              backgroundColor: player2Complete
                ? PLAYER_THEMES[2].completeBackground
                : player2Cell
                ? PLAYER_THEMES[2].activeBackground
                : PLAYER_THEMES[2].background,
            },
            player2Style,
          ]}
        >
          <Feather
            name={player2Complete ? "check-circle" : "user"}
            size={16}
            color={PLAYER_THEMES[2].iconColor}
          />
          <Text 
            style={[
              styles.playerText,
              { color: PLAYER_THEMES[2].textColor }
            ]}
          >
            Spieler 2
          </Text>
          {player2Complete && (
            <View style={styles.completeBadge}>
              <Feather
                name="check"
                size={12}
                color="#FFFFFF"
              />
            </View>
          )}
        </Animated.View>

        {/* Timer in the middle */}
        <View style={styles.timerContainer}>
          <Timer
            isRunning={isGameRunning}
            initialTime={gameTime}
            onTimeUpdate={onTimeUpdate}
          />
        </View>

        {/* Player 1 (Bottom) Status */}
        <Animated.View 
          style={[
            styles.playerIndicator,
            {
              backgroundColor: player1Complete
                ? PLAYER_THEMES[1].completeBackground
                : player1Cell
                ? PLAYER_THEMES[1].activeBackground
                : PLAYER_THEMES[1].background,
            },
            player1Style,
          ]}
        >
          <Feather
            name={player1Complete ? "check-circle" : "user"}
            size={16}
            color={PLAYER_THEMES[1].iconColor}
          />
          <Text 
            style={[
              styles.playerText,
              { color: PLAYER_THEMES[1].textColor }
            ]}
          >
            Spieler 1
          </Text>
          {player1Complete && (
            <View style={styles.completeBadge}>
              <Feather
                name="check"
                size={12}
                color="#FFFFFF"
              />
            </View>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  playerIndicator: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    minWidth: 110,
    position: "relative",
  },
  playerText: {
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  completeBadge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#4CAF50", // Success green
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  timerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DuoGameStatusBar;