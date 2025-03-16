import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, { FadeIn } from "react-native-reanimated";
import styles from "./DuoControls.styles";

interface DuoControlsProps {
  onPlayer1Input: (number: number) => void;
  onPlayer2Input: (number: number) => void;
  player1Complete: boolean;
  player2Complete: boolean;
  currentPlayer: 1 | 2;
}

const DuoControls: React.FC<DuoControlsProps> = ({
  onPlayer1Input,
  onPlayer2Input,
  player1Complete,
  player2Complete,
  currentPlayer,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Custom number pad für Player 1 (rotiert 180 Grad)
  const renderPlayer1NumberPad = () => {
    return (
      <View style={styles.rotatedControls}>
        <View 
          style={[
            styles.playerTurnIndicator,
            currentPlayer === 1 ? styles.activePlayer : styles.inactivePlayer
          ]}
        >
          <Text 
            style={[
              styles.turnText, 
              { color: currentPlayer === 1 ? colors.primary : colors.textSecondary }
            ]}
          >
            {player1Complete ? "Fertig ✓" : currentPlayer === 1 ? "Du bist dran" : "Warte..."}
          </Text>
        </View>
        
        <View style={styles.numberPadContainer}>
          <View style={styles.numbersRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <View key={`p1-num-${num}`} style={styles.numberButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.numberButton,
                    (player1Complete || currentPlayer !== 1) && styles.disabledButton,
                  ]}
                  onPress={() => onPlayer1Input(num)}
                  disabled={player1Complete || currentPlayer !== 1}
                >
                  <Text style={styles.buttonText}>{num}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  // Standard number pad für Player 2
  const renderPlayer2NumberPad = () => {
    return (
      <View>
        <View 
          style={[
            styles.playerTurnIndicator,
            currentPlayer === 2 ? styles.activePlayer : styles.inactivePlayer
          ]}
        >
          <Text 
            style={[
              styles.turnText, 
              { color: currentPlayer === 2 ? colors.primary : colors.textSecondary }
            ]}
          >
            {player2Complete ? "Fertig ✓" : currentPlayer === 2 ? "Du bist dran" : "Warte..."}
          </Text>
        </View>
        
        <View style={styles.numberPadContainer}>
          <View style={styles.numbersRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <View key={`p2-num-${num}`} style={styles.numberButtonContainer}>
                <TouchableOpacity
                  style={[
                    styles.numberButton,
                    (player2Complete || currentPlayer !== 2) && styles.disabledButton,
                  ]}
                  onPress={() => onPlayer2Input(num)}
                  disabled={player2Complete || currentPlayer !== 2}
                >
                  <Text style={styles.buttonText}>{num}</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.delay(300).duration(500)}>
      {/* Player 1 Controls (top, rotated) */}
      <View style={[styles.playerControls, styles.player1Controls]}>
        {renderPlayer1NumberPad()}
      </View>
      
      {/* Divider between players */}
      <View style={styles.divider} />
      
      {/* Player 2 Controls (bottom) */}
      <View style={[styles.playerControls, styles.player2Controls]}>
        {renderPlayer2NumberPad()}
      </View>
    </Animated.View>
  );
};

// Exportiere als Standard-Export
export default DuoControls;