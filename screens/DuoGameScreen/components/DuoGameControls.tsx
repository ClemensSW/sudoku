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

// Calculate button sizes based on screen dimensions
const { width } = Dimensions.get("window");
const NUMBER_BUTTON_SIZE = Math.min((width - 32) / 9, 38);
const ACTION_BUTTON_SIZE = 48;

// Player themes to match the board colors
const PLAYER_THEMES = {
  // Player 1 (bottom)
  1: {
    controls: {
      backgroundColor: "rgba(74, 125, 120, 0.1)", // Light teal background
      numberButton: {
        background: "#4A7D78", // Teal
        textColor: "#F1F4FB", // Light blue/white
        disabledBackground: "rgba(74, 125, 120, 0.5)", // Faded teal
        disabledTextColor: "rgba(241, 244, 251, 0.5)", // Faded white
      },
      actionButton: {
        background: "rgba(64, 107, 109, 0.8)", // Darker teal with transparency
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
      backgroundColor: "rgba(243, 239, 227, 0.1)", // Light beige background
      numberButton: {
        background: "#5B5D6E", // Dark blue-gray
        textColor: "#F3EFE3", // Light beige
        disabledBackground: "rgba(91, 93, 110, 0.5)", // Faded blue-gray
        disabledTextColor: "rgba(243, 239, 227, 0.5)", // Faded beige
      },
      actionButton: {
        // Changed to be darker like player 1's buttons for better contrast
        background: "#5B5D6E", // Dark blue-gray (same as numberButton.background)
        activeBackground: "#4D4F5C", // Even darker blue-gray for active state
        // Changed to light color for better visibility
        iconColor: "#F3EFE3", // Light beige (same as numberButton.textColor)
        textColor: "#F3EFE3", // Light beige
        disabledBackground: "rgba(91, 93, 110, 0.4)", // Faded dark blue-gray
        disabledIconColor: "rgba(243, 239, 227, 0.5)", // Faded light beige
        borderColor: "#F3EFE3", // Light beige border for active state
      },
    },
  },
};

interface DuoGameControlsProps {
  position: "top" | "bottom";
  onNumberPress: (player: 1 | 2, number: number) => void;
  onClear: (player: 1 | 2) => void;
  onNoteToggle: (player: 1 | 2) => void;
  onHint: (player: 1 | 2) => void;
  noteMode: boolean;
  disabled?: boolean;
  hintsRemaining: number;
}

const DuoGameControls: React.FC<DuoGameControlsProps> = ({
  position,
  onNumberPress,
  onClear,
  onNoteToggle,
  onHint,
  noteMode,
  disabled = false,
  hintsRemaining = 3,
}) => {
  // Determine player based on position
  const player = position === "top" ? 2 : 1;
  const theme = PLAYER_THEMES[player].controls;
  
  // Animation values for buttons
  const noteScale = useSharedValue(1);
  const eraseScale = useSharedValue(1);
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
  
  const eraseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eraseScale.value }],
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
                <View style={position === "top" ? styles.rotatedContent : undefined}>
                  <Text
                    style={[
                      styles.numberText,
                      {
                        color: isDisabled
                          ? theme.numberButton.disabledTextColor
                          : theme.numberButton.textColor,
                      },
                      // Add underline for 6 and 9 to distinguish them when rotated
                      position === "top" && (num === 6 || num === 9) && styles.underlinedNumber,
                    ]}
                  >
                    {num}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    );
  };

  // Render action buttons (note, erase, hint)
  const renderActionButtons = () => {
    const hintDisabled = hintsRemaining <= 0 || disabled;

    return (
      <View style={styles.actionButtonsRow}>
        {/* Note button */}
        <Animated.View style={[styles.actionButtonWrapper, noteAnimatedStyle]}>
          <View style={[
            // Add a glowing effect container for the active note mode
            noteMode && styles.activeNoteIndicator,
            { backgroundColor: noteMode ? theme.actionButton.activeBackground : 'transparent' }
          ]}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: noteMode
                    ? theme.actionButton.activeBackground
                    : theme.actionButton.background,
                  // Add border when note mode is active to make it more obvious
                  borderWidth: noteMode ? 2 : 0,
                  borderColor: theme.actionButton.borderColor,
                  // Add shadow when active
                  shadowOpacity: noteMode ? 0.3 : 0.1,
                  elevation: noteMode ? 4 : 2,
                },
                disabled && styles.disabledButton,
              ]}
              onPress={() => {
                if (!disabled) {
                  handleButtonPress(noteScale, () => onNoteToggle(player));
                }
              }}
              disabled={disabled}
            >
              <View style={position === "top" ? styles.rotatedContent : undefined}>
                <Feather
                  name="edit-3"
                  size={20}
                  color={
                    disabled
                      ? theme.actionButton.disabledIconColor
                      : noteMode
                      ? theme.actionButton.textColor
                      : theme.actionButton.iconColor
                  }
                />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Erase button */}
        <Animated.View style={[styles.actionButtonWrapper, eraseAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.actionButton.background },
              disabled && styles.disabledButton,
            ]}
            onPress={() => {
              if (!disabled) {
                handleButtonPress(eraseScale, () => onClear(player));
              }
            }}
            disabled={disabled}
          >
            <View style={position === "top" ? styles.rotatedContent : undefined}>
              <Feather
                name="delete"
                size={20}
                color={
                  disabled
                    ? theme.actionButton.disabledIconColor
                    : theme.actionButton.iconColor
                }
              />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Hint button */}
        <Animated.View style={[styles.actionButtonWrapper, hintAnimatedStyle]}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              { backgroundColor: theme.actionButton.background },
              (hintDisabled || disabled) && styles.disabledButton,
            ]}
            onPress={() => {
              if (!hintDisabled && !disabled) {
                handleButtonPress(hintScale, () => onHint(player));
              }
            }}
            disabled={hintDisabled || disabled}
          >
            <View style={position === "top" ? styles.rotatedContent : undefined}>
              <Feather
                name="help-circle"
                size={20}
                color={
                  hintDisabled || disabled
                    ? theme.actionButton.disabledIconColor
                    : theme.actionButton.iconColor
                }
              />
            </View>
            
            {!hintDisabled && (
              <View style={[
                styles.hintCountBadge,
                { 
                  backgroundColor: 
                    player === 1 ? "#4A7D78" : "#5B5D6E" 
                }
              ]}>
                <View style={position === "top" ? styles.rotatedContent : undefined}>
                  <Text style={styles.hintCountText}>
                    {hintsRemaining}
                  </Text>
                </View>
              </View>
            )}
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
      {/* Action buttons row (notes, erase, hints) */}
      {renderActionButtons()}

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
  // Action buttons styles
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginVertical: 4,
  },
  actionButtonWrapper: {
    alignItems: "center",
    width: 52,
    height: 52,
    justifyContent: "center",
  },
  actionButton: {
    width: ACTION_BUTTON_SIZE,
    height: ACTION_BUTTON_SIZE,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Active note indicator styles
  activeNoteIndicator: {
    borderRadius: 16,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  numberText: {
    fontSize: NUMBER_BUTTON_SIZE * 0.5,
    fontWeight: "600",
  },
  // Hint counter badge
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
  // Rotation styles for player 2's content
  rotatedContent: {
    transform: [{ rotate: "180deg" }],
  },
  // Helper for 6 and 9 when rotated
  underlinedNumber: {
    textDecorationLine: "underline",
  },
});

export default DuoGameControls;