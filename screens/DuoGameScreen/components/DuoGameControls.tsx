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
import { useTheme } from "@/utils/theme/ThemeProvider";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 40) / 9, 40);
// Breite Button-Größen angepasst, um Platz für Fehleranzeige zu machen
const ACTION_BUTTON_WIDTH = Math.min(width / 3 - 16, 110); // Etwas schmaler
const ACTION_BUTTON_HEIGHT = 48; // Höhe beibehalten

// Player themes to match the board colors - VERBESSERTE KONTRASTE FÜR LIGHT MODE
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    controls: {
      darkBackgroundColor: "rgba(74, 125, 120, 0.2)", // Original für Dark Mode
      lightBackgroundColor: "rgba(74, 125, 120, 0.15)", // Angepasste Farbe für Light Mode
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
      darkBackgroundColor: "rgba(243, 239, 227, 0.2)", // Original für Dark Mode
      lightBackgroundColor: "rgba(138, 123, 70, 0.15)", // Neue Farbe für Light Mode
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
  showErrors?: boolean; // Neue Prop für Fehleranzeige
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
  showErrors = true, // Standardwert true
}) => {
  // Determine player based on position
  const player = position === "top" ? 2 : 1;
  const theme = PLAYER_THEMES[player].controls;
  const { isDark } = useTheme(); // Get dark mode state
  
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
  
  // Get background color based on theme mode
  const getBackgroundColor = () => {
    // Für beide Spieler jetzt das gleiche Muster
    return isDark ? theme.darkBackgroundColor : theme.lightBackgroundColor;
  };

  // Render number buttons
  const renderNumberButtons = () => {
    return (
      <View style={styles.numbersRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => {
          const isDisabled = disabled;
          
          return (
            <Animated.View
              key={`num-${player}-${num}`}
              style={[
                styles.numberButtonContainer,
                getNumberAnimatedStyle(index),
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
        {/* Note button - LINKS */}
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

        {/* Error Indicator - ZENTRIERT */}
        <View style={styles.errorIndicatorContainer}>
          <DuoErrorIndicator 
            player={player} 
            errorsCount={errorsCount} 
            maxErrors={maxErrors}
            compact={true}
            showErrors={showErrors} // Neue Prop weitergeben
          />
        </View>

        {/* Hint button - RECHTS */}
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
        { backgroundColor: getBackgroundColor() },
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
    paddingHorizontal: 4,
    paddingVertical: 4,
    alignItems: "center",
    margin: 4,
    alignSelf: "center", // Zentriert den Container selbst
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  // Action buttons row jetzt mit drei Elementen gleichmäßig verteilt
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "center", // Zentrale Ausrichtung statt space-between
    alignItems: "center", // Vertikal zentrieren
    width: "100%",
    marginVertical: 4,
    paddingHorizontal: 0, // Kein horizontales Padding
    height: ACTION_BUTTON_HEIGHT, // Feste Höhe für bessere Ausrichtung
  },
  // Container for error indicator with centered alignment
  errorIndicatorContainer: {
    width: 76, // Etwas schmaler für bessere Gesamtverteilung
    height: ACTION_BUTTON_HEIGHT,
    alignItems: "center", // Horizontal zentrieren
    justifyContent: "center", // Vertikal zentrieren
    paddingHorizontal: 0, // Kein zusätzliches Padding
  },
  actionButtonWrapper: {
    width: ACTION_BUTTON_WIDTH, // Feste Breite statt flex
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
    marginBottom: 4,
  },
  numberButtonContainer: {
    width: NUMBER_BUTTON_SIZE + 4,
    height: NUMBER_BUTTON_SIZE + 4,
    alignItems: "center",
    justifyContent: "center",
  },
  numberButton: {
    width: NUMBER_BUTTON_SIZE,
    height: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  numberText: {
    fontSize: NUMBER_BUTTON_SIZE * 0.6,
    fontWeight: "600",
  },
  // Helper for 6 and 9 when rotated
  underlinedNumber: {
    textDecorationLine: "underline",
  },
});

export default DuoGameControls;