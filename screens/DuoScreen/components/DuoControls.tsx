// screens/DuoScreen/components/DuoControls.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 32) / 9, 50);
const ACTION_BUTTON_SIZE = Math.min((width - 32) / 3, 60);

interface DuoControlsProps {
  position: "top" | "bottom";
  onNumberPress: (player: 1 | 2, number: number) => void;
  onClear: (player: 1 | 2) => void;
  onNoteToggle: (player: 1 | 2) => void;
  onHint: (player: 1 | 2) => void;
  noteMode: boolean;
  lives: number;
  maxLives?: number;
  disabled?: boolean;
}

const DuoControls: React.FC<DuoControlsProps> = ({
  position,
  onNumberPress,
  onClear,
  onNoteToggle,
  onHint,
  noteMode,
  lives,
  maxLives = 3,
  disabled = false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Determine player based on position
  const player = position === "top" ? 2 : 1;
  
  // Create heart indicators for lives
  const renderHearts = () => {
    return (
      <View style={styles.heartsRow}>
        {Array.from({ length: maxLives }).map((_, index) => (
          <Feather
            key={`heart-${index}`}
            name="heart"
            size={16}
            color={index < lives ? colors.primary : "rgba(255,255,255,0.2)"}
          />
        ))}
      </View>
    );
  };
  
  return (
    <Animated.View 
      style={[
        styles.container,
        position === "top" && styles.topContainer
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Action buttons row */}
      <View style={[
        styles.actionsRow,
        position === "top" && styles.rotatedView
      ]}>
        {/* Hint button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              disabled && styles.disabledButton
            ]}
            onPress={() => onHint(player)}
            disabled={disabled}
          >
            <Feather 
              name="help-circle" 
              size={22} 
              color={disabled ? colors.textSecondary : colors.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[
            styles.actionLabel,
            { color: colors.textSecondary }
          ]}>
            {position === "top" ? "sıɐʍuıH" : "Hinweis"}
          </Text>
        </View>
        
        {/* Clear/Erase button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              disabled && styles.disabledButton
            ]}
            onPress={() => onClear(player)}
            disabled={disabled}
          >
            <Feather 
              name="delete" 
              size={22} 
              color={disabled ? colors.textSecondary : colors.textPrimary} 
            />
          </TouchableOpacity>
          <Text style={[
            styles.actionLabel,
            { color: colors.textSecondary }
          ]}>
            {position === "top" ? "uǝɥɔsö˥" : "Löschen"}
          </Text>
        </View>
        
        {/* Note button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              noteMode && { backgroundColor: colors.primary + '40' },
              disabled && styles.disabledButton
            ]}
            onPress={() => onNoteToggle(player)}
            disabled={disabled}
          >
            <Feather 
              name="edit-3" 
              size={22} 
              color={disabled ? colors.textSecondary : colors.textPrimary} 
            />
            {player === 1 && 
              <View style={styles.livesIndicator}>
                {renderHearts()}
              </View>
            }
          </TouchableOpacity>
          <Text style={[
            styles.actionLabel,
            { color: colors.textSecondary }
          ]}>
            {position === "top" ? "zıʇoN" : "Notiz"}
          </Text>
        </View>
      </View>
      
      {/* Number buttons row */}
      <View style={[
        styles.numbersRow,
        position === "top" && styles.rotatedView
      ]}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={`num-${player}-${num}`}
            style={[
              styles.numberButton,
              disabled && styles.disabledButton
            ]}
            onPress={() => onNumberPress(player, num)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText,
              disabled && styles.disabledText
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* If top controls, we need the hearts to be rotated correctly */}
      {player === 2 && 
        <View style={[styles.heartsContainer, styles.rotatedView]}>
          {renderHearts()}
        </View>
      }
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  rotatedView: {
    transform: [{ rotate: "180deg" }],
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginVertical: 4,
  },
  actionButtonWrapper: {
    alignItems: "center",
    width: ACTION_BUTTON_SIZE,
  },
  actionButton: {
    width: ACTION_BUTTON_SIZE - 4,
    height: ACTION_BUTTON_SIZE - 4,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    position: "relative",
  },
  actionLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginVertical: 4,
  },
  numberButton: {
    width: NUMBER_BUTTON_SIZE,
    height: NUMBER_BUTTON_SIZE,
    borderRadius: 8,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4361EE",
  },
  numberText: {
    fontSize: NUMBER_BUTTON_SIZE * 0.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
  },
  livesIndicator: {
    position: "absolute",
    bottom: -10,
    alignItems: "center",
  },
  heartsContainer: {
    marginTop: 4,
  },
  heartsRow: {
    flexDirection: "row",
    justifyContent: "center",
  }
});

export default DuoControls;