// components/Button/Button.tsx
import React from "react";
import {
  Text,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Pressable,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./Button.styles";
import { triggerHaptic } from "@/utils/haptics";

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
  /** @deprecated Use iconLeft or iconRight instead */
  icon?: React.ReactNode;
  /** @deprecated Use iconLeft or iconRight instead */
  iconPosition?: "left" | "right";
  /** Icon to display on the left side of the button */
  iconLeft?: React.ReactNode;
  /** Icon to display on the right side of the button */
  iconRight?: React.ReactNode;
  withHaptic?: boolean;
  hapticType?: "light" | "medium" | "heavy";
  /** Custom color for primary variant (overrides theme primary) */
  customColor?: string;
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
  iconLeft,
  iconRight,
  withHaptic = true,
  hapticType = "light",
  customColor,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const scale = useSharedValue(1);

  // Backward compatibility: if icon prop is used, map it to iconLeft or iconRight
  const leftIcon = iconLeft || (icon && iconPosition === "left" ? icon : undefined);
  const rightIcon = iconRight || (icon && iconPosition === "right" ? icon : undefined);

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
      // Nutze die neue Haptic-Utility
      triggerHaptic(hapticType || "light");
    }

    onPress();
  };

  // Dynamic styles based on variant and status
  const getButtonStyle = () => {
    const buttonStyles: ViewStyle[] = [styles.button];

    // Use custom color if provided, otherwise use theme color
    const primaryColor = customColor || colors.primary;

    // Variant-specific styles
    switch (variant) {
      case "primary":
        buttonStyles.push({
          backgroundColor: primaryColor,
          shadowColor: primaryColor,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        });
        break;
      case "secondary":
        buttonStyles.push({ backgroundColor: colors.surface });
        break;
      case "outline":
        buttonStyles.push({
          backgroundColor: "transparent",
          borderWidth: 1.5,
          borderColor: customColor || colors.primary,
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

    // Status-specific styles
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

    // Custom styles are NOT applied here anymore (applied to animatedContainer instead)

    return buttonStyles;
  };

  // Dynamic text styles
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
        textStyles.push({ color: customColor || colors.primary });
        break;
      case "ghost":
        textStyles.push({ color: customColor || colors.primary });
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

  // Get icon color based on variant (same logic as text color)
  const getIconColor = (): string => {
    if (disabled) {
      return variant === "outline" || variant === "ghost"
        ? colors.buttonDisabled
        : colors.buttonTextDisabled;
    }

    switch (variant) {
      case "primary":
      case "danger":
      case "success":
        return colors.buttonText; // White for filled buttons
      case "secondary":
        return colors.textPrimary;
      case "outline":
      case "ghost":
        return customColor || colors.primary;
      default:
        return colors.buttonText;
    }
  };

  // Clone icon elements with automatic color injection
  const cloneIconWithColor = (iconElement: React.ReactNode) => {
    if (!iconElement) return null;

    // If it's already a valid React element, clone it with the color
    if (React.isValidElement(iconElement)) {
      return React.cloneElement(iconElement as React.ReactElement<any>, {
        color: getIconColor(),
      });
    }

    return iconElement;
  };

  // Combine all styles
  const buttonStyles = getButtonStyle();
  const titleStyles = getTextStyle();

  return (
    <Animated.View style={[styles.animatedContainer, animatedStyles, style]}>
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
            color={getIconColor()}
            size="small"
          />
        ) : (
          <>
            {leftIcon && (
              <Animated.View style={styles.iconLeft}>
                {cloneIconWithColor(leftIcon)}
              </Animated.View>
            )}
            <Text style={titleStyles}>{title}</Text>
            {rightIcon && (
              <Animated.View style={styles.iconRight}>
                {cloneIconWithColor(rightIcon)}
              </Animated.View>
            )}
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default Button;
