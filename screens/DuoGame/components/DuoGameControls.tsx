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
import PencilIcon from "@/assets/svg/pencil.svg";
import EraserIcon from "@/assets/svg/eraser.svg";
import LightBulbIcon from "@/assets/svg/light-bulb.svg";
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
import { getPlayerControlColors, type DuoPlayerId } from "@/utils/duoColors";
import { useProgressColor } from "@/contexts/color/ColorContext";

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
// Breite Button-Größen angepasst für alle Szenarien
const ACTION_BUTTON_WIDTH = Math.min(width / 3 - 16, 95); // Etwas schmaler für drei Buttons
const ACTION_BUTTON_WIDTH_TWO = Math.min(width / 3 - 8, 110); // Breiter für zwei Buttons
const ACTION_BUTTON_HEIGHT = 48; // Höhe beibehalten

const actionButtonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
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
  disabledNumbers?: number[]; // Spielerspezifische abgehakte Zahlen
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
  disabledNumbers = [], // Spielerspezifische abgehakte Zahlen
}) => {
  // Determine player based on position
  const player = position === "top" ? 2 : 1;
  const { isDark, typography, colors } = useTheme(); // Get dark mode state, typography and colors
  const pathColorHex = useProgressColor();
  const theme = React.useMemo(
    () => getPlayerControlColors(player as DuoPlayerId, pathColorHex, isDark),
    [player, pathColorHex, isDark]
  );
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

  // Render number buttons - Minimalistisches Design wie im Single-Player
  const renderNumberButtons = () => {
    return (
      <View style={styles.numbersRow}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => {
          const isComplete = disabledNumbers.includes(num);
          const isDisabled = disabled || isComplete;

          return (
            <Animated.View
              key={`num-${player}-${num}`}
              style={[
                styles.numberItem,
                getNumberAnimatedStyle(index),
              ]}
            >
              <TouchableOpacity
                style={styles.numberPressable}
                onPress={() => {
                  if (!isDisabled) {
                    handleButtonPress(numberScales[index], () =>
                      onNumberPress(player, num)
                    );
                  }
                }}
                disabled={isDisabled}
              >
                {isComplete ? (
                  <Feather
                    name="check"
                    size={24}
                    color={pathColorHex}
                    style={{ opacity: 0.4 }}
                  />
                ) : (
                  <Text
                    style={[
                      styles.numberTextMinimal,
                      {
                        color: disabled
                          ? theme.numberButton.disabledTextColor
                          : pathColorHex,
                      },
                      // Add underline for 6 and 9 to distinguish them when rotated
                      (num === 6 || num === 9) && styles.underlinedNumber,
                    ]}
                  >
                    {num}
                  </Text>
                )}
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
                backgroundColor: isDark ? colors.surface : colors.numberPadButton,
                borderWidth: noteMode ? 2 : 0,
                borderColor: noteMode ? pathColorHex : 'transparent',
              },
              actionButtonShadow,
              disabled && styles.disabledButton,
            ]}
            onPress={() => {
              if (!disabled) {
                handleButtonPress(noteScale, () => onNoteToggle(player));
              }
            }}
            disabled={disabled}
          >
            <PencilIcon
              width={18}
              height={18}
              color={
                disabled
                  ? colors.buttonTextDisabled
                  : noteMode ? pathColorHex : colors.numberPadButtonText
              }
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: disabled
                    ? colors.buttonTextDisabled
                    : colors.textSecondary,
                  fontSize: typography.size.xs,
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
                  backgroundColor: isDark ? colors.surface : colors.numberPadButton,
                },
                actionButtonShadow,
                disabled && styles.disabledButton,
              ]}
              onPress={() => {
                if (!disabled) {
                  handleButtonPress(clearScale, () => onClear(player));
                }
              }}
              disabled={disabled}
            >
              <EraserIcon
                width={18}
                height={18}
                color={
                  disabled
                    ? colors.buttonTextDisabled
                    : colors.numberPadButtonText
                }
              />
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: disabled
                      ? colors.buttonTextDisabled
                      : colors.textSecondary,
                    fontSize: typography.size.xs,
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
                backgroundColor: hintDisabled
                  ? colors.buttonDisabled
                  : isDark ? colors.surface : colors.numberPadButton,
              },
              actionButtonShadow,
              (hintDisabled || disabled) && styles.disabledButton,
            ]}
            onPress={() => {
              if (!hintDisabled && !disabled) {
                handleButtonPress(hintScale, () => onHint(player));
              }
            }}
            disabled={hintDisabled || disabled}
          >
            <LightBulbIcon
              width={18}
              height={18}
              color={
                hintDisabled || disabled
                  ? colors.buttonTextDisabled
                  : colors.numberPadButtonText
              }
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color:
                    hintDisabled || disabled
                      ? colors.buttonTextDisabled
                      : colors.textSecondary,
                  fontSize: typography.size.xs,
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
    alignItems: "center",
    alignSelf: "center",
  },
  topContainer: {
    transform: [{ rotate: "180deg" }],
  },
  // Action buttons row mit gleichmäßiger Verteilung
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Gleichmäßige Abstände überall
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
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
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginLeft: 5,
  },
  disabledButton: {
    opacity: 0.5,
  },
  // Minimalistisches Zahlen-Layout (wie Single-Player)
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  // Container für jede Zahl - FESTE GRÖSSE verhindert Verschiebung
  numberItem: {
    width: 36,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  // Pressable-Bereich für Touch-Feedback
  numberPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  // Minimalistischer Zahlen-Text
  numberTextMinimal: {
    fontSize: 32,
    fontWeight: "500",
  },
  // Helper for 6 and 9 when rotated
  underlinedNumber: {
    textDecorationLine: "underline",
  },
});

export default DuoGameControls;