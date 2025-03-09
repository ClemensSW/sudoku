// components/Header/Header.tsx
import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./Header.styles";
import Animated, { FadeIn } from "react-native-reanimated";

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightAction?: {
    icon: string;
    onPress: () => void;
  };
  subtitle?: string;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightAction,
  subtitle,
  transparent = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  // Enhanced container style to ensure visibility
  const containerStyle = {
    paddingTop: Math.max(insets.top, Platform.OS === "ios" ? 12 : 8),
    backgroundColor: transparent
      ? "rgba(0,0,0,0.05)" // Semi-transparent background when transparent is true
      : colors.background,
    // Add a subtle bottom border for better visual separation
    borderBottomWidth: 1,
    borderBottomColor: theme.isDark
      ? "rgba(255,255,255,0.1)"
      : "rgba(0,0,0,0.05)",
    // Ensure proper z-index and positioning
    zIndex: 10,
    elevation: 3,
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[styles.container, containerStyle]}
    >
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.surface,
                // Add shadow to buttons for better visibility
                ...theme.shadows.sm,
              },
            ]}
            onPress={onBackPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.titleContainer}>
        <Text
          style={[styles.title, { color: colors.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction && (
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.surface,
                ...theme.shadows.sm,
              },
            ]}
            onPress={rightAction.onPress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather
              name={rightAction.icon as any}
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default Header;
