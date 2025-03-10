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
  hintsRemaining?: number; // Anzahl verbleibender Hinweise
}

type ButtonKey = string;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onErasePress,
  onNoteToggle,
  onHintPress,
  noteModeActive,
  disabledNumbers = [],
  showHint = true,
  hintsRemaining = 0,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Map für tracking animation values by button
  const buttonScales = React.useRef<
    Map<ButtonKey, Animated.SharedValue<number>>
  >(
    new Map([
      ["note", useSharedValue(1)],
      ["erase", useSharedValue(1)],
      ["hint", useSharedValue(1)],
      ...Array.from(
        { length: 9 },
        (_, i) =>
          [String(i + 1), useSharedValue(1)] as [
            ButtonKey,
            Animated.SharedValue<number>
          ]
      ),
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
  const getAnimatedStyle = (key: ButtonKey) => {
    const scale = buttonScales.get(key);

    return useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale?.value || 1 }],
      };
    });
  };

  // Render action buttons (note, erase, hint)
  const renderActionButtons = () => {
    // Prüfen, ob Hinweise verfügbar sind
    const hintDisabled = hintsRemaining <= 0;

    return (
      <View style={styles.actionButtonsRow}>
        {/* Notiz-Button */}
        <Animated.View
          style={styles.actionButtonContainer}
          entering={FadeInUp.delay(100).duration(400)}
        >
          <AnimatedPressable
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.isDark
                  ? colors.surface
                  : colors.numberPadButton,
                borderWidth: noteModeActive ? 2 : 0,
                borderColor: colors.primary,
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
                noteModeActive ? colors.primary : colors.numberPadButtonText
              }
            />
          </AnimatedPressable>
          <Text
            style={[
              styles.actionButtonLabel,
              {
                color: noteModeActive ? colors.primary : colors.textSecondary,
                fontWeight: noteModeActive ? "600" : "500",
              },
            ]}
          >
            Notiz
          </Text>
        </Animated.View>

        {/* Löschen-Button (Radiergummi) */}
        <Animated.View
          style={styles.actionButtonContainer}
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
            <MaterialCommunityIcons
              name="eraser"
              size={24}
              color={colors.numberPadButtonText}
            />
          </AnimatedPressable>
          <Text
            style={[styles.actionButtonLabel, { color: colors.textSecondary }]}
          >
            Löschen
          </Text>
        </Animated.View>

        {/* Hinweis-Button mit Counter */}
        {showHint && onHintPress && (
          <Animated.View
            style={styles.actionButtonContainer}
            entering={FadeInUp.delay(300).duration(400)}
          >
            <AnimatedPressable
              style={[
                styles.actionButton,
                {
                  backgroundColor: hintDisabled
                    ? colors.buttonDisabled
                    : theme.isDark
                    ? colors.surface
                    : colors.numberPadButton,
                },
                getAnimatedStyle("hint"),
              ]}
              onPress={() =>
                handleButtonPress("action", "hint", onHintPress, hintDisabled)
              }
              disabled={hintDisabled}
              android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
            >
              {/* Hinweis-Icon */}
              <MaterialCommunityIcons
                name="lightbulb-outline"
                size={24}
                color={
                  hintDisabled
                    ? colors.buttonTextDisabled
                    : colors.numberPadButtonText
                }
              />

              {/* Hinweis-Counter-Badge im Primärfarbenschema */}
              {!hintDisabled && (
                <View
                  style={[
                    styles.hintCountBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.hintCountText}>{hintsRemaining}</Text>
                </View>
              )}
            </AnimatedPressable>
            <Text
              style={[
                styles.actionButtonLabel,
                {
                  color: hintDisabled
                    ? colors.buttonTextDisabled
                    : colors.textSecondary,
                },
              ]}
            >
              Hinweis
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  // Render number buttons in a single row
  const renderNumberButtons = () => {
    // Moderne Anordnung: eine Reihe mit Zahlen von 1-9
    return (
      <View style={styles.numbersRow}>
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const isDisabled = disabledNumbers.includes(num);
          const delay = 200 + i * 30; // Leicht verzögerte Animation

          return (
            <Animated.View
              key={`num-${num}`}
              style={styles.numberButtonContainer}
              entering={FadeInUp.delay(delay).duration(400)}
            >
              <AnimatedPressable
                style={[
                  styles.numberButton,
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
                    styles.numberButtonText,
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
