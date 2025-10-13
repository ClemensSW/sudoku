import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  TextStyle,
  BackHandler,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
  runOnJS,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { triggerHaptic } from "@/utils/haptics";
import styles from "./CustomAlert.styles";

// Define button types with different visual styles
export type ButtonType =
  | "default"
  | "primary"
  | "success"
  | "danger"
  | "cancel"
  | "duoButton"
  | "info";

// Define alert types with different visual styles
export type AlertType =
  | "info"
  | "success"
  | "error"
  | "warning"
  | "confirmation"
  | "duoMode";

// Interface for button config
export interface AlertButton {
  text: string;
  onPress?: () => void;
  style?: ButtonType;
  isDefault?: boolean;
}

// Props for CustomAlert component
export interface CustomAlertProps {
  visible: boolean;
  title: string;
  message: string;
  buttons?: AlertButton[];
  type?: AlertType;
  onBackdropPress?: () => void;
  autoDismiss?: boolean;
  dismissTimeout?: number;
  icon?: string;
  customIcon?: React.ReactNode;
  hideIconBackground?: boolean;
  testID?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: "OK", style: "primary", isDefault: true }],
  type = "info",
  onBackdropPress,
  autoDismiss = false,
  dismissTimeout = 3000,
  icon,
  customIcon,
  hideIconBackground = false,
  testID,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  // Local state to control visibility
  const [isVisible, setIsVisible] = useState(visible);

  // Animation values for icon
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);

  // Update local visibility state when prop changes
  useEffect(() => {
    if (visible) {
      setIsVisible(true);

      // Provide haptic feedback based on alert type
      switch (type) {
        case "success":
          triggerHaptic("success");
          break;
        case "error":
          triggerHaptic("error");
          break;
        case "warning":
          triggerHaptic("warning");
          break;
        default:
          triggerHaptic("medium");
      }

      // Animate icon entrance
      iconOpacity.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
      iconScale.value = withSequence(
        withTiming(1.1, {
          duration: 350,
          easing: Easing.bezier(0.34, 1.56, 0.64, 1),
        }),
        withTiming(1, {
          duration: 150,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        })
      );

      // Pulse icon for success/error (once)
      if (type === "success" || type === "error") {
        setTimeout(() => {
          iconScale.value = withSequence(
            withTiming(1.15, { duration: 200 }),
            withTiming(1, { duration: 200 })
          );
        }, 600);
      }
    } else {
      iconScale.value = 0.8;
      iconOpacity.value = 0;
    }
  }, [visible, type]);

  // Auto-dismiss functionality
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (autoDismiss && isVisible) {
      timer = setTimeout(() => {
        handleDismiss();
      }, dismissTimeout);
    }

    return () => clearTimeout(timer);
  }, [autoDismiss, isVisible, dismissTimeout]);

  // Handle back button press
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (isVisible) {
          handleDismiss();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [isVisible]);

  // Handle dismissal
  const handleDismiss = () => {
    if (onBackdropPress) {
      onBackdropPress();
    }
    setIsVisible(false);
  };

  // Handle button press
  const handleButtonPress = (buttonOnPress?: () => void) => {
    if (buttonOnPress) {
      buttonOnPress();
    }
    handleDismiss();
  };

  // Get icon based on alert type
  const getIcon = (): string => {
    if (icon) return icon;

    switch (type) {
      case "success":
        return "check-circle";
      case "error":
        return "alert-circle";
      case "warning":
        return "alert-triangle";
      case "confirmation":
      case "duoMode":
        return "help-circle";
      default:
        return "info";
    }
  };

  // Get icon color based on alert type - using progress color for default/info
  const getIconColor = (): string => {
    switch (type) {
      case "success":
        return "#34D399"; // Softer green
      case "error":
        return "#F87171"; // Softer red
      case "warning":
        return "#FBBF24"; // Warmer yellow
      case "confirmation":
        return progressColor; // Use current path color
      case "duoMode":
        return "#4A7D78"; // Teal
      default:
        return progressColor; // Use current path color for info
    }
  };

  // Get button style based on button type
  const getButtonStyle = (buttonType: ButtonType = "default"): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 48, // Larger touch target
    };

    switch (buttonType) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: progressColor, // Use current path color
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: "#34D399",
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: "#F87171",
        };
      case "duoButton":
        return {
          ...baseStyle,
          backgroundColor: "#4A7D78",
        };
      case "info":
        return {
          ...baseStyle,
          backgroundColor: progressColor, // Use current path color
        };
      case "cancel":
        // Ghost button - no background, no border
        return {
          ...baseStyle,
          backgroundColor: "transparent",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.04)",
        };
    }
  };

  // Get button text style based on button type
  const getButtonTextStyle = (
    buttonType: ButtonType = "default"
  ): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: 16,
      fontWeight: "600",
      letterSpacing: 0.2,
    };

    switch (buttonType) {
      case "primary":
      case "success":
      case "danger":
      case "duoButton":
      case "info":
        return {
          ...baseStyle,
          color: "#FFFFFF",
        };
      case "cancel":
        return {
          ...baseStyle,
          color: colors.textSecondary, // Softer text for cancel
        };
      default:
        return {
          ...baseStyle,
          color: colors.textPrimary,
        };
    }
  };

  // Icon animation style
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: iconScale.value }],
      opacity: iconOpacity.value,
    };
  });

  if (!isVisible) return null;

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(400).easing(Easing.bezier(0.4, 0, 0.2, 1))}
      exiting={FadeOut.duration(250)}
      testID={testID}
    >
      {/* Backdrop with Blur */}
      <BlurView
        intensity={theme.isDark ? 30 : 20}
        tint={theme.isDark ? "dark" : "light"}
        style={styles.backdrop}
      >
        <AnimatedPressable
          style={styles.backdrop}
          onPress={onBackdropPress ? handleDismiss : undefined}
        />
      </BlurView>

      {/* Alert Container with subtle scale animation */}
      <Animated.View
        style={[styles.alertContainer, { backgroundColor: colors.surface }]}
        entering={FadeIn.duration(300)
          .easing(Easing.bezier(0.4, 0, 0.2, 1))
          .delay(50)}
      >
        {/* Alert Header with Icon */}
        <View style={styles.alertHeader}>
          <Animated.View
            style={[
              styles.iconContainer,
              {
                backgroundColor: hideIconBackground ? "transparent" : `${getIconColor()}10`, // Very subtle background
              },
              iconAnimatedStyle,
            ]}
          >
            {customIcon || (
              <Feather
                name={getIcon() as any}
                size={32}
                color={getIconColor()}
                style={{ opacity: 0.9 }}
              />
            )}
          </Animated.View>
        </View>

        {/* Alert Content */}
        <View style={styles.alertContent}>
          <Text style={[styles.alertTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text style={[styles.alertMessage, { color: colors.textSecondary }]}>
            {message}
          </Text>
        </View>

        {/* Alert Buttons - Stacked for 2+ buttons, reversed order so primary is on top */}
        <View
          style={[
            styles.buttonContainer,
            buttons.length > 1 && styles.buttonStackedContainer,
          ]}
        >
          {[...buttons].reverse().map((button, index) => (
            <View
              key={`btn-${index}`}
              style={[
                buttons.length > 1 ? styles.buttonFullWidth : styles.buttonFlex,
              ]}
            >
              <TouchableOpacity
                style={getButtonStyle(button.style)}
                onPress={() => handleButtonPress(button.onPress)}
                activeOpacity={0.75}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default CustomAlert;
