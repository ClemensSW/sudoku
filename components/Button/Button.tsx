import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./Button.styles";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "success"
  | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  withHaptic?: boolean;
  hapticType?: "light" | "medium" | "heavy";
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = "left",
  withHaptic = true,
  hapticType = "light",
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const scale = useSharedValue(1);

  // Animation for press effects
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withTiming(0.97, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handlePress = () => {
    if (disabled || loading) return;

    if (withHaptic) {
      switch (hapticType) {
        case "light":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case "medium":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case "heavy":
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
      }
    }

    onPress();
  };

  // Dynamische Styles basierend auf Variant und Status
  const getButtonStyle = () => {
    const buttonStyles: ViewStyle[] = [styles.button];

    // Variant-spezifische Styles
    switch (variant) {
      case "primary":
        buttonStyles.push({
          backgroundColor: colors.primary,
          shadowColor: colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5,
        });
        break;
      case "secondary":
        buttonStyles.push({ backgroundColor: colors.surface });
        break;
      case "outline":
        buttonStyles.push({
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: colors.primary,
        });
        break;
      case "danger":
        buttonStyles.push({ backgroundColor: colors.error });
        break;
      case "success":
        buttonStyles.push({ backgroundColor: colors.success });
        break;
      case "ghost":
        buttonStyles.push({
          backgroundColor: "transparent",
        });
        break;
      default:
        buttonStyles.push({ backgroundColor: colors.primary });
    }

    // Status-spezifische Styles
    if (disabled) {
      buttonStyles.push({
        backgroundColor:
          variant === "outline" || variant === "ghost"
            ? "transparent"
            : colors.buttonDisabled,
        borderColor: variant === "outline" ? colors.buttonDisabled : undefined,
        shadowOpacity: 0,
        elevation: 0,
      });
    }

    // Benutzerdefinierte Styles
    if (style) {
      buttonStyles.push(style);
    }

    return buttonStyles;
  };

  // Dynamische Text-Styles
  const getTextStyle = () => {
    const textStyles: TextStyle[] = [styles.buttonText];

    switch (variant) {
      case "primary":
      case "danger":
      case "success":
        textStyles.push({ color: colors.buttonText });
        break;
      case "secondary":
        textStyles.push({ color: colors.textPrimary });
        break;
      case "outline":
        textStyles.push({ color: colors.primary });
        break;
      case "ghost":
        textStyles.push({ color: colors.primary });
        break;
      default:
        textStyles.push({ color: colors.buttonText });
    }

    if (disabled) {
      textStyles.push({
        color:
          variant === "outline" || variant === "ghost"
            ? colors.buttonDisabled
            : colors.buttonTextDisabled,
      });
    }

    if (textStyle) {
      textStyles.push(textStyle);
    }

    return textStyles;
  };

  // Kombiniere alle Styles
  const buttonStyles = getButtonStyle();
  const titleStyles = getTextStyle();

  return (
    <Animated.View style={[styles.animatedContainer, animatedStyles]}>
      <Pressable
        style={buttonStyles}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        android_ripple={
          variant !== "ghost"
            ? {
                color: "rgba(255, 255, 255, 0.2)",
                borderless: false,
              }
            : null
        }
      >
        {loading ? (
          <ActivityIndicator
            color={
              variant === "outline" || variant === "ghost"
                ? colors.primary
                : colors.buttonText
            }
            size="small"
          />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <Animated.View style={styles.iconLeft}>{icon}</Animated.View>
            )}
            <Text style={titleStyles}>{title}</Text>
            {icon && iconPosition === "right" && (
              <Animated.View style={styles.iconRight}>{icon}</Animated.View>
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default Button;
