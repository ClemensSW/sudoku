import React, { useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  SharedValue,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import styles from "./OnlineNumberPad.styles";
import PencilIcon from "@/assets/svg/pencil.svg";
import EraserIcon from "@/assets/svg/eraser.svg";

interface OnlineNumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
  onNoteToggle: () => void;
  noteModeActive: boolean;
  disabledNumbers?: number[];
  isGameComplete?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OnlineNumberPad: React.FC<OnlineNumberPadProps> = ({
  onNumberPress,
  onErasePress,
  onNoteToggle,
  noteModeActive,
  disabledNumbers = [],
  isGameComplete = false,
}) => {
  const { t } = useTranslation('game');
  const theme = useTheme();
  const colors = theme.colors;

  // Animation values
  const noteScale = useSharedValue(1);
  const eraseScale = useSharedValue(1);

  // Animation-Werte für Zahlenbuttons als Array
  const numberScales = Array.from({ length: 9 }, () => useSharedValue(1));

  // Button-Animation-Handler
  const handleButtonPress = (
    scaleValue: SharedValue<number>,
    callback: () => void
  ) => {
    scaleValue.value = withSpring(0.9, { damping: 9, stiffness: 400 });

    setTimeout(() => {
      scaleValue.value = withSpring(1, { damping: 12, stiffness: 400 });
    }, 100);

    // Haptisches Feedback
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

  // Render action buttons (Note and Erase only - no Hint for online)
  const renderActionButtons = () => {
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
            disabled={isGameComplete}
          >
            <PencilIcon
              width={32}
              height={32}
              color={
                noteModeActive ? colors.primary : colors.numberPadButtonText
              }
            />
          </AnimatedPressable>
          <Text
            style={[styles.actionButtonLabel, { color: colors.textSecondary, fontSize: theme.typography.size.xs }]}
          >
            {t('controls.note')}
          </Text>
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
            disabled={isGameComplete}
          >
            <EraserIcon
              width={32}
              height={32}
              color={colors.numberPadButtonText}
            />
          </AnimatedPressable>
          <Text
            style={[styles.actionButtonLabel, { color: colors.textSecondary, fontSize: theme.typography.size.xs }]}
          >
            {t('controls.erase')}
          </Text>
        </Animated.View>
      </View>
    );
  };

  // Render number buttons in a single row
  const renderNumberButtons = () => {
    return (
      <View style={styles.numbersRow}>
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const isDisabled = disabledNumbers.includes(num) || isGameComplete;
          const delay = 200 + i * 30;

          return (
            <Animated.View
              key={`num-${num}`}
              style={styles.numberButtonContainer}
              entering={FadeInUp.delay(delay).duration(400)}
            >
              <AnimatedPressable
                style={[
                  {
                    width: "100%",
                    height: 60,
                    borderRadius: 12,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: isDisabled
                      ? colors.buttonDisabled
                      : colors.primary,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    opacity: isDisabled ? 0.3 : 1,
                  },
                  useAnimatedStyle(() => ({
                    transform: [{ scale: numberScales[i].value }],
                  })),
                ]}
                onPress={() => {
                  if (!isDisabled) {
                    handleButtonPress(numberScales[i], () =>
                      onNumberPress(num)
                    );
                  }
                }}
                disabled={isDisabled}
              >
                <Text
                  style={{
                    fontSize: theme.typography.size.xxl,
                    fontWeight: "600",
                    color: isDisabled
                      ? colors.buttonTextDisabled
                      : colors.buttonText,
                  }}
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

export default OnlineNumberPad;
