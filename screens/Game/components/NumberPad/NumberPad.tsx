import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useStoredColorHex } from "@/contexts/color/ColorContext";
import { triggerHaptic } from "@/utils/haptics";
import styles from "./NumberPad.styles";
import PencilIcon from "@/assets/svg/pencil.svg";
import EraserIcon from "@/assets/svg/eraser.svg";
import LightBulbIcon from "@/assets/svg/light-bulb.svg";

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  onHintPress?: () => void;
  noteModeActive: boolean;
  disabledNumbers?: number[];
  showHint?: boolean;
  hintsRemaining?: number;
}

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
  const { t } = useTranslation('game');
  const theme = useTheme();
  const { colors, typography } = theme;
  const pathColorHex = useStoredColorHex();

  // Animation values
  const noteScale = useSharedValue(1);
  const eraseScale = useSharedValue(1);
  const hintScale = useSharedValue(1);

  // Animation-Werte für Zahlenbuttons als Array
  const numberScales = Array.from({ length: 9 }, () => useSharedValue(1));

  // Button-Animation-Handler
  const handleButtonPress = (
    scaleValue: Animated.SharedValue<number>,
    callback: () => void
  ) => {
    scaleValue.value = withSpring(0.9, { damping: 9, stiffness: 400 });

    setTimeout(() => {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 400 });
    }, 100);

    // Haptisches Feedback mit neuer Utility
    triggerHaptic("light");

    // Callback ausführen
    callback();
  };

  // Animated styles
  const noteAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: noteScale.value }],
  }));

  const eraseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: eraseScale.value }],
  }));

  const hintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  // Render action buttons
  const renderActionButtons = () => {
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
              noteAnimatedStyle,
            ]}
            onPress={() => {
              handleButtonPress(noteScale, onNoteToggle);
            }}
          >
            <PencilIcon
              width={32}
              height={32}
              color={
                noteModeActive ? colors.primary : colors.numberPadButtonText
              }
            />
          </AnimatedPressable>
        </Animated.View>

        {/* Löschen-Button */}
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
              eraseAnimatedStyle,
            ]}
            onPress={() => {
              handleButtonPress(eraseScale, onErasePress);
            }}
          >
            <EraserIcon
              width={32}
              height={32}
              color={colors.numberPadButtonText}
            />
          </AnimatedPressable>
        </Animated.View>

        {/* Hinweis-Button */}
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
                hintAnimatedStyle,
              ]}
              onPress={() => {
                if (!hintDisabled) {
                  handleButtonPress(hintScale, onHintPress);
                }
              }}
              disabled={hintDisabled}
            >
              <LightBulbIcon
                width={32}
                height={32}
                color={
                  hintDisabled
                    ? colors.buttonTextDisabled
                    : colors.numberPadButtonText
                }
              />

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
          </Animated.View>
        )}
      </View>
    );
  };

  // Render minimalist number items (text only, checkmark when complete)
  const renderNumberButtons = () => {
    return (
      <View style={styles.numbersRow}>
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const isComplete = disabledNumbers.includes(num);
          const delay = 200 + i * 30;

          return (
            <Animated.View
              key={`num-${num}`}
              style={styles.numberItem}
              entering={FadeInUp.delay(delay).duration(400)}
            >
              <AnimatedPressable
                style={[
                  styles.numberPressable,
                  useAnimatedStyle(() => ({
                    transform: [{ scale: numberScales[i].value }],
                  })),
                ]}
                onPress={() => {
                  if (!isComplete) {
                    handleButtonPress(numberScales[i], () =>
                      onNumberPress(num)
                    );
                  }
                }}
                disabled={isComplete}
              >
                {isComplete ? (
                  <Feather
                    name="check"
                    size={24}
                    color={pathColorHex}
                    style={{ opacity: 0.4 }}
                  />
                ) : (
                  <Text style={[styles.numberText, { color: pathColorHex }]}>
                    {num}
                  </Text>
                )}
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