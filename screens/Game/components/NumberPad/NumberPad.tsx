import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
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
  const theme = useTheme();
  const colors = theme.colors;

  // Individuelle Animation-Werte für jeden Button
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

  // Animation-Styles erstellen
  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      return {
        transform: [{ scale: numberScales[index].value }],
      };
    });
  };

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
              useAnimatedStyle(() => ({
                transform: [{ scale: noteScale.value }],
              })),
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
          <Text
            style={[styles.actionButtonLabel, { color: colors.textSecondary }]}
          >
            Notiz
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
              useAnimatedStyle(() => ({
                transform: [{ scale: eraseScale.value }],
              })),
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
          <Text
            style={[styles.actionButtonLabel, { color: colors.textSecondary }]}
          >
            Löschen
          </Text>
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
                useAnimatedStyle(() => ({
                  transform: [{ scale: hintScale.value }],
                })),
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
    return (
      <View style={styles.numbersRow}>
        {Array.from({ length: 9 }, (_, i) => {
          const num = i + 1;
          const isDisabled = disabledNumbers.includes(num);
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
                    opacity: isDisabled ? 0.3 : 1, // Reduzierte Sichtbarkeit für verwendete Zahlen
                  },
                  getAnimatedStyle(i),
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
                    fontSize: 24,
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

export default NumberPad;