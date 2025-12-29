// screens/Duo/components/DevBanner/DevBanner.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./DevBanner.styles";

interface DevBannerProps {
  text?: string;
  visible?: boolean;
}

const DevBanner: React.FC<DevBannerProps> = ({
  text = "IN ENTWICKLUNG",
  visible = true,
}) => {
  // Hide if not visible
  if (!visible) return null;
  const { typography, isDark } = useTheme();

  // Farben basierend auf Theme - Deep Teal (matching Duo theme)
  const gradientColors: readonly [string, string] = isDark
    ? ["rgba(46,107,123,0.9)", "rgba(60,130,145,0.85)"] // Petrol für Dark Mode
    : ["rgba(46,107,123,0.95)", "rgba(60,130,145,0.9)"]; // Petrol für Light Mode

  const textColor = "#FFFFFF";
  const iconColor = "#FFFFFF";

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.rotatedWrapper}>
        <LinearGradient
          colors={gradientColors as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <Feather name="tool" size={14} color={iconColor} style={styles.icon} />
          <Text style={[styles.text, { color: textColor, fontSize: typography.size.sm }]}>{text}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default DevBanner;
