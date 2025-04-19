// screens/DuoGameScreen/components/DuoGameControls.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { 
  FadeIn, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring 
} from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";
import DuoErrorIndicator from "./DuoErrorIndicator";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 32) / 9, 38);
// Breite Button-Größen angepasst, um Platz für Fehleranzeige zu machen
const ACTION_BUTTON_WIDTH = Math.min(width / 3 - 16, 110); // Etwas schmaler
const ACTION_BUTTON_HEIGHT = 48; // Höhe beibehalten

// Player themes to match the board colors - VERBESSERTE KONTRASTE FÜR LIGHT MODE
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    controls: {
      backgroundColor: "rgba(74, 125, 120, 0.2)", // Erhöhter Kontrast (0.1 -> 0.2)
      numberButton: {
        background: "#4A7D78", // Teal
        textColor: "#F1F4FB", // Light blue/white
        disabledBackground: "rgba(74, 125, 120, 0.5)", // Faded teal
        disabledTextColor: "rgba(241, 244, 251, 0.5)", // Faded white
      },
      actionButton: {
        background: "rgba(64, 107, 109, 0.9)", // Erhöhter Kontrast (0.8 -> 0.9)
        activeBackground: "#4A7D78", // Full teal when active
        iconColor: "#F1F4FB", // Light blue/white
        textColor: "#F1F4FB", // Light blue/white
        disabledBackground: "rgba(64, 107, 109, 0.4)", // Very faded teal
        disabledIconColor: "rgba(241, 244, 251, 0.5)", // Faded white
        borderColor: "#F1F4FB", // Light blue/white border for active state
      },
    },
  },
  // Player 2 (top) - UPDATED COLORS
  2: {
    controls: {
      backgroundColor: "rgba(243, 239, 227, 0.2)", // Erhöhter Kontrast (0.1 -> 0.2)
      numberButton: {
        background: "#5B5D6E", // Dark blue-gray
        textColor: "#F3EFE3", // Light beige
        disabledBackground: "rgba(91, 93, 110, 0.5)", // Faded blue-gray
        disabledTextColor: "rgba(243, 239, 227, 0.5)", // Faded beige
      },
      actionButton: {
        background: "rgba(91, 93, 110, 0.9)", // Erhöhter Kontrast (0.8 -> 0.9)
        activeBackground: "#4D4F5C", // Even darker blue-gray for active state
        iconColor: "#F3EFE3", // Light beige (same as numberButton.textColor)
        textColor: "#F3EFE3", // Light beige
        disabledBackground: "rgba(91, 93, 110, 0.4)", // Faded dark blue-gray
        disabledIconColor: "rgba(243, 239, 227, 0.5)", // Faded light beige
        borderColor: "#F3EFE3", // Light beige border for active state
      },
    },
  },
};

// Einheitliches Schatten-System für alle interaktiven Elemente
const buttonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  elevation: 3,
};

interface DuoGameControlsProps {
  position: "top" | "bottom";
  onNumberPress: (player: 1 | 2, number: number) => void;
  onNoteToggle: (player: 1 | 2) => void;
  onHint: (player: 1 | 2) => void;
  noteMode: boolean;
  disabled?: boolean;
  hintsRemaining: number;
  errorsCount: number;
  maxErrors: number;
}

const DuoGameControls: React.FC<DuoGameControlsProps> = ({
  position,
  onNumberPress,
  onNoteToggle,
  onHint,
  noteMode,
  disabled = false,
  hintsRemaining = 3,
  errorsCount = 0,
  maxErrors = 3,
}) => {
  // Determine player based on position
  const player = position === "top" ? 2 : 1;
  const theme = PLAYER_THEMES[player].controls;
  
  // Animation values for buttons
  const noteScale = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const numberScales = Array.from({ length: 9 }, () => useSharedValue(1));

  // Button animation handler
  const handleButtonPress = (
    scaleValue: Animated.SharedValue<number>,
    callback: () => void
  ) => {
    // Spring animation for press effect
    scaleValue.value = withSpring(0.9, { damping: 9, stiffness: 400 });
    
    setTimeout(() => {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 400 });
    }, 100);
    
    triggerHaptic("light");
    callback();
  };

  // Animated style for each number
  const getNumberAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      transform: [{ scale: numberScales[index].value }],
    }));
  };

  // Animated styles for action buttons
  const noteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noteScale.value }],
  }));
  
  const hintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  // Render number buttons
  const renderNumberButtons = () => {
    return (
      <View style={styles.numbersRow}>
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const isDisabled = disabled;
          
          return (
            <Animated.View
              key={`num-${player}-${num}`}
              style={[
                styles.numberButtonContainer,
                getNumberAnimatedStyle(i),
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.numberButton,
                  {
                    backgroundColor: isDisabled
                      ? theme.numberButton.disabledBackground
                      : theme.numberButton.background,
                  },
                  buttonShadow, // Einheitlicher Schatten
                ]}
                onPress={() => {
                  if (!isDisabled) {
                    handleButtonPress(numberScales[i], () => 
                      onNumberPress(player, num)
                    );
                  }
                }}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.numberText,
                    {
                      color: isDisabled
                        ? theme.numberButton.disabledTextColor
                        : theme.numberButton.textColor,
                    },
                    // Add underline for 6 and 9 to distinguish them when rotated
                    (num === 6 || num === 9) && styles.underlinedNumber,
                  ]}
                >
                  {num}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  // Render action buttons and error indicator in the same row
  const renderActionButtonsRow = () => {
    const hintDisabled = hintsRemaining <= 0 || disabled;

    return (
      <View style={styles.actionButtonsRow}>
        {/* Error Indicator - now centered vertically */}
        <View style={styles.errorIndicatorContainer}>
          <DuoErrorIndicator 
            player={player} 
            errorsCount={errorsCount} 
            maxErrors={maxErrors}
            compact={true}
          />
        </View>

        {/* Note button - VEREINFACHTE STRUKTUR */}
        <Animated.View style={[styles.actionButtonWrapper, noteAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: noteMode
                  ? theme.actionButton.activeBackground
                  : theme.actionButton.background,
                borderWidth: noteMode ? 2 : 0,
                borderColor: theme.actionButton.borderColor,
              },
              buttonShadow, // Einheitlicher Schatten
              disabled && styles.disabledButton,
            ]}
            onPress={() => {
              if (!disabled) {
                handleButtonPress(noteScale, () => onNoteToggle(player));
              }
            }}
            disabled={disabled}
          >
            <Feather
              name="edit-3"
              size={18}
              color={
                disabled
                  ? theme.actionButton.disabledIconColor
                  : noteMode
                  ? theme.actionButton.textColor
                  : theme.actionButton.iconColor
              }
            />
            <Text style={[
              styles.actionButtonText,
              { 
                color: disabled 
                  ? theme.actionButton.disabledIconColor 
                  : theme.actionButton.textColor 
              }
            ]}>
              Notizen
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Hint button */}
        <Animated.View style={[styles.actionButtonWrapper, hintAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.actionButton.background },
              buttonShadow, // Einheitlicher Schatten
              (hintDisabled || disabled) && styles.disabledButton,
            ]}
            onPress={() => {
              if (!hintDisabled && !disabled) {
                handleButtonPress(hintScale, () => onHint(player));
              }
            }}
            disabled={hintDisabled || disabled}
          >
            <Feather
              name="help-circle"
              size={18}
              color={
                hintDisabled || disabled
                  ? theme.actionButton.disabledIconColor
                  : theme.actionButton.iconColor
              }
            />
            <Text style={[
              styles.actionButtonText,
              { 
                color: hintDisabled || disabled
                  ? theme.actionButton.disabledIconColor 
                  : theme.actionButton.textColor 
              }
            ]}>
              Hinweis {hintsRemaining > 0 ? `(${hintsRemaining})` : ""}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundColor },
        position === "top" && styles.topContainer,
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Action buttons row with error indicator */}
      {renderActionButtonsRow()}

      {/* Number buttons row */}
      {renderNumberButtons()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 12,
    margin: 4,
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  // Action buttons row jetzt mit drei Elementen
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Gleichmäßig verteilen
    alignItems: "center", // Vertikal zentrieren
    width: "100%",
    marginVertical: 4,
    paddingHorizontal: 4,
    height: ACTION_BUTTON_HEIGHT, // Feste Höhe für bessere Ausrichtung
  },
  // Container for error indicator with centered alignment
  errorIndicatorContainer: {
    minWidth: 60,
    height: ACTION_BUTTON_HEIGHT,
    alignItems: "center", // Horizontal zentrieren
    justifyContent: "center", // Vertikal zentrieren
  },
  actionButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: ACTION_BUTTON_HEIGHT,
  },
  actionButton: {
    width: ACTION_BUTTON_WIDTH,
    height: ACTION_BUTTON_HEIGHT,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  // Text für die Action Buttons
  actionButtonText: {
    fontSize: 13, // Kleiner für bessere Platzausnutzung
    fontWeight: "600",
    marginLeft: 5, // Weniger Abstand zum Icon
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Number buttons styles
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
    marginTop: 4,
  },
  numberButtonContainer: {
    width: NUMBER_BUTTON_SIZE + 4,
    height: NUMBER_BUTTON_SIZE + 4,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    width: NUMBER_BUTTON_SIZE,
    height: NUMBER_BUTTON_SIZE,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: NUMBER_BUTTON_SIZE * 0.5,
    fontWeight: "600",
  },
  // Helper for 6 and 9 when rotated
  underlinedNumber: {
    textDecorationLine: "underline",
  },
});

export default DuoGameControls;