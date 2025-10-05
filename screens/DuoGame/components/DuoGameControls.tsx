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
  withSpring,
} from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";
import DuoErrorIndicator from "./DuoErrorIndicator";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 40) / 9, 40);
// Breite Button-Größen angepasst für alle Szenarien
const ACTION_BUTTON_WIDTH = Math.min(width / 3 - 16, 95); // Etwas schmaler für drei Buttons
const ACTION_BUTTON_WIDTH_TWO = Math.min(width / 3 - 8, 110); // Breiter für zwei Buttons
const ACTION_BUTTON_HEIGHT = 48; // Höhe beibehalten

// Player themes to match the board colors
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
        background: "rgba(64, 107, 109, 0.9)", // Erhöhter Kontrast
        activeBackground: "#4A7D78", // Full teal when active
        iconColor: "#F1F4FB", // Light blue/white
        textColor: "#F1F4FB", // Light blue/white
        disabledBackground: "rgba(64, 107, 109, 0.4)", // Very faded teal
        disabledIconColor: "rgba(241, 244, 251, 0.5)", // Faded white
        borderColor: "#F1F4FB", // Light blue/white border for active state
      },
    },
  },
  // Player 2 (top)
  2: {
    controls: {
      darkBackgroundColor: "#292a2d", // Original für Dark Mode
      lightBackgroundColor: "rgba(138, 123, 70, 0.15)", // Neue Farbe für Light Mode
      numberButton: {
        background: "#5B5D6E", // Dark blue-gray
        textColor: "#F3EFE3", // Light beige
        disabledBackground: "rgba(91, 93, 110, 0.5)", // Faded blue-gray
        disabledTextColor: "rgba(243, 239, 227, 0.5)", // Faded beige
      },
      actionButton: {
        background: "rgba(91, 93, 110, 0.9)", // Erhöhter Kontrast
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
  onClear: (player: 1 | 2) => void; // Neue Prop für die Löschfunktion
  noteMode: boolean;
  disabled?: boolean;
  hintsRemaining: number;
  errorsCount: number;
  maxErrors: number;
  showErrors?: boolean; // Prop für Fehleranzeige
}

const DuoGameControls: React.FC<DuoGameControlsProps> = ({
  position,
  onNumberPress,
  onNoteToggle,
  onHint,
  onClear, // Neue Prop verwenden
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
  const { t } = useTranslation('duoGame');

  // Animation values for buttons
  const noteScale = useSharedValue(1);
  const hintScale = useSharedValue(1);
  const clearScale = useSharedValue(1); // Neuer SharedValue für den Löschbutton
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

  const clearAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: clearScale.value }],
  }));

  const hintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  // Get background color based on theme mode
  const getBackgroundColor = () => {
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
                    handleButtonPress(numberScales[index], () =>
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
    
    // Wähle die passende Button-Breite je nach Anzahl der anzuzeigenden Buttons
    const buttonWidth = !showErrors ? ACTION_BUTTON_WIDTH : ACTION_BUTTON_WIDTH_TWO;

    return (
      <View style={styles.actionButtonsRow}>
        {/* Note button - LINKS */}
        <Animated.View 
          style={[
            styles.actionButtonWrapper, 
            { width: buttonWidth },
            noteAnimatedStyle
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                width: buttonWidth,
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
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: disabled
                    ? theme.actionButton.disabledIconColor
                    : theme.actionButton.textColor,
                },
              ]}
            >
              {t('controls.notes')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Zeige entweder Error Indicator ODER Clear Button */}
        {showErrors ? (
          // Error Indicator - ZENTRIERT - nur wenn showErrors true ist
          <View style={styles.errorIndicatorContainer}>
            <DuoErrorIndicator
              player={player}
              errorsCount={errorsCount}
              maxErrors={maxErrors}
              compact={true}
              showErrors={showErrors}
            />
          </View>
        ) : (
          // Löschen Button - ZENTRIERT - nur wenn showErrors false ist
          <Animated.View 
            style={[
              styles.actionButtonWrapper, 
              { width: buttonWidth },
              clearAnimatedStyle
            ]}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                { 
                  width: buttonWidth,
                  backgroundColor: theme.actionButton.background
                },
                buttonShadow,
                disabled && styles.disabledButton,
              ]}
              onPress={() => {
                if (!disabled) {
                  handleButtonPress(clearScale, () => onClear(player));
                }
              }}
              disabled={disabled}
            >
              <Feather
                name="trash-2"
                size={18}
                color={
                  disabled
                    ? theme.actionButton.disabledIconColor
                    : theme.actionButton.iconColor
                }
              />
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: disabled
                      ? theme.actionButton.disabledIconColor
                      : theme.actionButton.textColor,
                  },
                ]}
              >
                {t('controls.clear')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Hint button - RECHTS */}
        <Animated.View 
          style={[
            styles.actionButtonWrapper, 
            { width: buttonWidth },
            hintAnimatedStyle
          ]}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              { 
                width: buttonWidth,
                backgroundColor: theme.actionButton.background 
              },
              buttonShadow,
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
            <Text
              style={[
                styles.actionButtonText,
                {
                  color:
                    hintDisabled || disabled
                      ? theme.actionButton.disabledIconColor
                      : theme.actionButton.textColor,
                },
              ]}
            >
              {t('controls.hint')} {hintsRemaining > 0 ? `(${hintsRemaining})` : ""}
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
      {/* Action buttons row with error indicator or clear button */}
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
    alignSelf: "center",
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  // Action buttons row mit gleichmäßiger Verteilung
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Gleichmäßig verteilt
    alignItems: "center",
    width: "100%",
    marginVertical: 4,
    paddingHorizontal: 8, // Etwas Abstand zum Rand
    height: ACTION_BUTTON_HEIGHT,
  },
  // Container for error indicator with centered alignment
  errorIndicatorContainer: {
    width: ACTION_BUTTON_WIDTH_TWO,
    height: ACTION_BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: ACTION_BUTTON_HEIGHT,
  },
  actionButton: {
    height: ACTION_BUTTON_HEIGHT,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  // Text für die Action Buttons
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
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