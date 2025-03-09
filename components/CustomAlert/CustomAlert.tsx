import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
  BackHandler,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";

// Define button types with different visual styles
export type ButtonType =
  | "default"
  | "primary"
  | "success"
  | "danger"
  | "cancel";

// Define alert types with different visual styles
export type AlertType =
  | "info"
  | "success"
  | "error"
  | "warning"
  | "confirmation";

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
  testID,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Local state to control visibility
  const [isVisible, setIsVisible] = useState(visible);

  // Animation values
  const backgroundOpacity = useSharedValue(0);
  const alertScale = useSharedValue(0.95);

  // Update local visibility state when prop changes
  useEffect(() => {
    if (visible) {
      setIsVisible(true);
      // Provide haptic feedback based on alert type
      switch (type) {
        case "success":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case "error":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case "warning":
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        default:
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [visible, type]);

  // Auto-dismiss functionality
  useEffect(() => {
    let timer: NodeJS.Timeout;

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
          return true; // Prevent default back behavior
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
    // Execute button callback if provided
    if (buttonOnPress) {
      buttonOnPress();
    }

    // Dismiss alert if no callback or after callback execution
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
        return "help-circle";
      default:
        return "info";
    }
  };

  // Get icon color based on alert type
  const getIconColor = (): string => {
    switch (type) {
      case "success":
        return colors.success;
      case "error":
        return colors.error;
      case "warning":
        return colors.warning;
      case "confirmation":
        return colors.info;
      default:
        return colors.primary;
    }
  };

  // Get button style based on button type
  const getButtonStyle = (buttonType: ButtonType = "default"): ViewStyle => {
    const baseStyle: ViewStyle = {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 44,
    };

    switch (buttonType) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: colors.success,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: colors.error,
        };
      case "cancel":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: theme.isDark ? colors.border : "rgba(0,0,0,0.1)",
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
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
    };

    switch (buttonType) {
      case "primary":
      case "success":
        return {
          ...baseStyle,
          color: colors.buttonText,
        };
      case "danger":
        return {
          ...baseStyle,
          color: "white",
        };
      case "cancel":
        return {
          ...baseStyle,
          color: colors.textPrimary,
        };
      default:
        return {
          ...baseStyle,
          color: colors.textPrimary,
        };
    }
  };

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[styles.overlay]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      testID={testID}
    >
      <AnimatedPressable
        style={styles.backdrop}
        onPress={onBackdropPress ? handleDismiss : undefined}
      />

      <Animated.View
        style={[styles.alertContainer, { backgroundColor: colors.surface }]}
        entering={SlideInUp.springify().damping(15)}
        exiting={SlideOutDown.duration(200)}
      >
        {/* Alert Header with Icon */}
        <View style={styles.alertHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: `${getIconColor()}15` },
            ]}
          >
            <Feather name={getIcon() as any} size={28} color={getIconColor()} />
          </View>
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

        {/* Alert Buttons */}
        <View
          style={[
            styles.buttonContainer,
            buttons.length > 2 && styles.buttonStackedContainer,
            {
              borderTopColor: theme.isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(0,0,0,0.1)",
            },
          ]}
        >
          {buttons.map((button, index) => (
            <Animated.View
              key={`btn-${index}`}
              style={[
                buttons.length > 2 ? styles.buttonFullWidth : styles.buttonFlex,
              ]}
              entering={FadeIn.delay(index * 100).duration(200)}
            >
              <TouchableOpacity
                style={getButtonStyle(button.style)}
                onPress={() => handleButtonPress(button.onPress)}
                activeOpacity={0.7}
              >
                <Text style={getButtonTextStyle(button.style)}>
                  {button.text}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: "85%",
    maxWidth: 400,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertHeader: {
    alignItems: "center",
    paddingTop: 24,
    paddingBottom: 8,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
    padding: 12,
  },
  buttonStackedContainer: {
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonFlex: {
    flex: 1,
    margin: 4,
  },
  buttonFullWidth: {
    width: "100%",
    marginBottom: 8,
  },
});

export default CustomAlert;
