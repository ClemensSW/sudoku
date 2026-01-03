import React from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/contexts/color/ColorContext";
import { triggerHaptic } from "@/utils/haptics";
import styles, { ACTION_BUTTON_WIDTH, ACTION_BUTTON_WIDTH_TWO } from "./NumberPad.styles";
import PencilIcon from "@/assets/svg/pencil.svg";
import EraserIcon from "@/assets/svg/eraser.svg";
import LightBulbIcon from "@/assets/svg/light-bulb.svg";
import DuoErrorIndicator from "@/screens/DuoGame/components/DuoErrorIndicator";

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  onHintPress?: () => void;
  noteModeActive: boolean;
  disabledNumbers?: number[];
  showHint?: boolean;
  hintsRemaining?: number;
  // New props for Hearts display
  showMistakes?: boolean;
  errorsRemaining?: number;
  maxErrors?: number;
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
  showMistakes = true,
  errorsRemaining = 3,
  maxErrors = 3,
}) => {
  const { t } = useTranslation('game');
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const pathColorHex = useProgressColor();

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

  // Render action buttons - Duo-style layout
  const renderActionButtons = () => {
    const hintDisabled = hintsRemaining <= 0;

    // Choose button width based on whether we show hearts or delete button
    const buttonWidth = showMistakes ? ACTION_BUTTON_WIDTH_TWO : ACTION_BUTTON_WIDTH;

    return (
      <View style={styles.actionButtonsRow}>
        {/* Notiz-Button - LEFT */}
        <Animated.View
          style={[styles.actionButtonWrapper, { width: buttonWidth }, noteAnimatedStyle]}
          entering={FadeInUp.delay(100).duration(400)}
        >
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                width: buttonWidth,
                backgroundColor: isDark ? colors.surface : colors.numberPadButton,
                borderWidth: noteModeActive ? 2 : 0,
                borderColor: noteModeActive ? pathColorHex : 'transparent',
              },
            ]}
            onPress={() => handleButtonPress(noteScale, onNoteToggle)}
          >
            <PencilIcon
              width={18}
              height={18}
              color={noteModeActive ? pathColorHex : colors.numberPadButtonText}
            />
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: colors.textSecondary,
                  fontSize: typography.size.xs,
                },
              ]}
            >
              {t('controls.note')}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Middle: Hearts OR Delete Button */}
        {showMistakes ? (
          // Error Indicator (Hearts) - CENTER
          <View style={styles.errorIndicatorContainer}>
            <DuoErrorIndicator
              player={1}
              errorsCount={maxErrors - errorsRemaining}
              maxErrors={maxErrors}
              compact={true}
              showErrors={showMistakes}
            />
          </View>
        ) : (
          // Delete Button - CENTER (when showMistakes is false)
          <Animated.View
            style={[styles.actionButtonWrapper, { width: buttonWidth }, eraseAnimatedStyle]}
            entering={FadeInUp.delay(200).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: buttonWidth,
                  backgroundColor: isDark ? colors.surface : colors.numberPadButton,
                },
              ]}
              onPress={() => handleButtonPress(eraseScale, onErasePress)}
            >
              <EraserIcon
                width={18}
                height={18}
                color={colors.numberPadButtonText}
              />
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.size.xs,
                  },
                ]}
              >
                {t('controls.erase')}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Hinweis-Button - RIGHT */}
        {showHint && onHintPress && (
          <Animated.View
            style={[styles.actionButtonWrapper, { width: buttonWidth }, hintAnimatedStyle]}
            entering={FadeInUp.delay(300).duration(400)}
          >
            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  width: buttonWidth,
                  backgroundColor: hintDisabled
                    ? colors.buttonDisabled
                    : isDark
                    ? colors.surface
                    : colors.numberPadButton,
                },
                hintDisabled && styles.disabledButton,
              ]}
              onPress={() => {
                if (!hintDisabled) {
                  handleButtonPress(hintScale, onHintPress);
                }
              }}
              disabled={hintDisabled}
            >
              <LightBulbIcon
                width={18}
                height={18}
                color={
                  hintDisabled
                    ? colors.buttonTextDisabled
                    : colors.numberPadButtonText
                }
              />
              <Text
                style={[
                  styles.actionButtonText,
                  {
                    color: hintDisabled
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
