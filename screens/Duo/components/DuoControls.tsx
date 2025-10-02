// screens/DuoScreen/components/DuoControls.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 32) / 9, 40); // Slightly smaller buttons

interface DuoControlsProps {
  position: "top" | "bottom";
  onNumberPress: (player: 1 | 2, number: number) => void;
  onClear: (player: 1 | 2) => void;
  onNoteToggle: (player: 1 | 2) => void;
  onHint: (player: 1 | 2) => void;
  noteMode: boolean;
  disabled?: boolean;
  hintsRemaining: number;
}

const DuoControls: React.FC<DuoControlsProps> = ({
  position,
  onNumberPress,
  onClear,
  onNoteToggle,
  onHint,
  noteMode,
  disabled = false,
  hintsRemaining = 3,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Neue Teal-Farbe für Buttons
  const BUTTON_COLOR = "#4A7D78"; // Teal color

  // Determine player based on position
  const player = position === "top" ? 2 : 1;

  // For top player (Player 2), entire container is rotated 180 degrees
  return (
    <Animated.View
      style={[styles.container, position === "top" && styles.topContainer]}
      entering={FadeIn.duration(500)}
    >
      {/* Action buttons row */}
      <View style={styles.actionsRow}>
        {/* Hint button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton, 
              disabled && styles.disabledButton,
              hintsRemaining <= 0 && styles.disabledButton
            ]}
            onPress={() => onHint(player)}
            disabled={disabled || hintsRemaining <= 0}
          >
            <Feather
              name="help-circle"
              size={20}
              color={
                disabled || hintsRemaining <= 0
                  ? colors.textSecondary
                  : colors.textPrimary
              }
            />
            {hintsRemaining > 0 && (
              <View style={[styles.hintCountBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.hintCountText}>{hintsRemaining}</Text>
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
            {position === "top" ? "sıǝʍuıH" : "Hinweis"}
          </Text>
        </View>

        {/* Clear/Erase button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[styles.actionButton, disabled && styles.disabledButton]}
            onPress={() => onClear(player)}
            disabled={disabled}
          >
            <Feather
              name="delete"
              size={20}
              color={disabled ? colors.textSecondary : colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
            {position === "top" ? "uǝɥɔsö˥" : "Löschen"}
          </Text>
        </View>

        {/* Note button */}
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              noteMode && { backgroundColor: colors.primary + "40" },
              disabled && styles.disabledButton,
            ]}
            onPress={() => onNoteToggle(player)}
            disabled={disabled}
          >
            <Feather
              name="edit-3"
              size={20}
              color={disabled ? colors.textSecondary : colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.actionLabel, { color: colors.textSecondary }]}>
            {position === "top" ? "zıʇoN" : "Notiz"}
          </Text>
        </View>
      </View>

      {/* Number buttons row - horizontal layout */}
      <View style={styles.numbersRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={`num-${player}-${num}`}
            style={[
              styles.numberButton, 
              { backgroundColor: BUTTON_COLOR }, // Neue Teal-Farbe
              disabled && styles.disabledButton
            ]}
            onPress={() => onNumberPress(player, num)}
            disabled={disabled}
          >
            <Text style={[
              styles.numberText, 
              disabled && styles.disabledText,
              // Add underline for 6 and 9 to make them more distinguishable when rotated
              (num === 6 || num === 9) && styles.underlinedNumber
            ]}>
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 4,
  },
  actionButtonWrapper: {
    alignItems: "center",
    width: 50, // Smaller size
  },
  actionButton: {
    width: 80, // Smaller size
    height: 40, // Smaller size
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
    flexDirection: "row", // Horizontal layout
    justifyContent: "center",
    width: "100%",
    marginVertical: 4,
  },
  numberButton: {
    width: NUMBER_BUTTON_SIZE,
    height: NUMBER_BUTTON_SIZE,
    borderRadius: 8,
    margin: 2,
    justifyContent: "center",
    alignItems: "center",
    // Farbe wird jetzt dynamisch gesetzt
  },
  numberText: {
    fontSize: NUMBER_BUTTON_SIZE * 0.5,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  underlinedNumber: {
    textDecorationLine: 'underline',
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  disabledText: {
    color: "rgba(255,255,255,0.5)",
  },
  hintCountBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  hintCountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default DuoControls;