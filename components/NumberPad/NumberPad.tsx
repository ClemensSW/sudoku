import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./NumberPad.styles";

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  onHintPress?: () => void;
  noteModeActive: boolean;
  disabledNumbers?: number[];
  showHint?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onErasePress,
  onNoteToggle,
  onHintPress,
  noteModeActive,
  disabledNumbers = [],
  showHint = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Map for tracking animation values by button
  const buttonScales = React.useRef(
    new Map([
      ["note", useSharedValue(1)],
      ["erase", useSharedValue(1)],
      ["hint", useSharedValue(1)],
      ...Array.from({ length: 9 }, (_, i) => [
        String(i + 1),
        useSharedValue(1),
      ]),
    ])
  ).current;

  // Handle button press with animation and haptic feedback
  const handleButtonPress = (
    type: "number" | "action",
    value: number | string,
    callback: () => void,
    disabled = false
  ) => {
    if (disabled) return;

    // Get shared value for this button
    const buttonKey = typeof value === "number" ? String(value) : value;
    const scale = buttonScales.get(buttonKey);

    if (scale) {
      // Play press animation
      scale.value = withSpring(0.9, { damping: 9, stiffness: 400 });
      setTimeout(() => {
        scale.value = withSpring(1, { damping: 12, stiffness: 400 });
      }, 100);

      // Trigger haptic feedback
      if (type === "number") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }

      // Call the callback
      callback();
    }
  };

  // Create animated style for a specific button
  const getAnimatedStyle = (key: string) => {
    const scale = buttonScales.get(key);

    return useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale?.value || 1 }],
      };
    });
  };

  // Render action buttons (note, erase, hint)
  const renderActionButtons = () => {
    return (
      <View style={styles.topRow}>
        <Animated.View
          style={styles.animatedContainer}
          entering={FadeInUp.delay(100).duration(400)}
        >
          <AnimatedPressable
            style={[
              styles.actionButton,
              noteModeActive && styles.activeActionButton,
              {
                backgroundColor: noteModeActive
                  ? colors.primary
                  : theme.isDark
                  ? colors.surface
                  : colors.numberPadButton,
              },
              getAnimatedStyle("note"),
            ]}
            onPress={() => handleButtonPress("action", "note", onNoteToggle)}
            android_ripple={{
              color: "rgba(255,255,255,0.2)",
              borderless: true,
            }}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={24}
              color={
                noteModeActive ? colors.buttonText : colors.numberPadButtonText
              }
            />
          </AnimatedPressable>
        </Animated.View>

        <Animated.View
          style={styles.animatedContainer}
          entering={FadeInUp.delay(200).duration(400)}
        >
          <AnimatedPressable
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.isDark
                  ? colors.surface
                  : colors.numberPadButton,
              },
              getAnimatedStyle("erase"),
            ]}
            onPress={() => handleButtonPress("action", "erase", onErasePress)}
            android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
          >
            <Feather
              name="delete"
              size={24}
              color={colors.numberPadButtonText}
            />
          </AnimatedPressable>
        </Animated.View>

        {showHint && onHintPress && (
          <Animated.View
            style={styles.animatedContainer}
            entering={FadeInUp.delay(300).duration(400)}
          >
            <AnimatedPressable
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.isDark
                    ? colors.surface
                    : colors.numberPadButton,
                },
                getAnimatedStyle("hint"),
              ]}
              onPress={() => handleButtonPress("action", "hint", onHintPress)}
              android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
            >
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={24}
                color={colors.numberPadButtonText}
              />
            </AnimatedPressable>
          </Animated.View>
        )}
      </View>
    );
  };

  // Render number buttons in a grid
  const renderNumberButtons = () => {
    // Create an array of 3 rows, each with 3 buttons
    const rows = [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9],
    ];

    return (
      <View style={styles.numbersContainer}>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.buttonRow}>
            {row.map((num) => {
              const isDisabled = disabledNumbers.includes(num);
              const delayBase = 200; // Base delay for animation
              const delay = delayBase + (rowIndex * 3 + ((num - 1) % 3)) * 50; // Staggered delay

              return (
                <Animated.View
                  key={`num-${num}`}
                  style={styles.animatedContainer}
                  entering={FadeInUp.delay(delay).duration(400)}
                >
                  <AnimatedPressable
                    style={[
                      styles.button,
                      isDisabled && styles.disabledButton,
                      {
                        backgroundColor: isDisabled
                          ? colors.buttonDisabled
                          : theme.isDark
                          ? colors.surface
                          : colors.numberPadButton,
                      },
                      getAnimatedStyle(String(num)),
                    ]}
                    onPress={() =>
                      handleButtonPress(
                        "number",
                        num,
                        () => onNumberPress(num),
                        isDisabled
                      )
                    }
                    disabled={isDisabled}
                    android_ripple={{
                      color: "rgba(0,0,0,0.1)",
                      borderless: true,
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isDisabled && styles.disabledButtonText,
                        {
                          color: isDisabled
                            ? colors.buttonTextDisabled
                            : colors.numberPadButtonText,
                        },
                      ]}
                    >
                      {num}
                    </Text>
                  </AnimatedPressable>
                </Animated.View>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Animated.View style={styles.container}>
      {renderActionButtons()}
      {renderNumberButtons()}
    </Animated.View>
  );
};

export default NumberPad;
