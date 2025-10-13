// screens/Duo/components/DevBanner/DevBanner.tsx
import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./DevBanner.styles";

interface DevBannerProps {
  text?: string;
}

const DevBanner: React.FC<DevBannerProps> = ({
  text = "IN ENTWICKLUNG"
}) => {
  const theme = useTheme();

  // Farben basierend auf Theme
  const gradientColors: readonly [string, string] = theme.isDark
    ? ["rgba(255,152,0,0.85)", "rgba(255,193,7,0.75)"] // Gedämpftes Orange/Gelb für Dark Mode
    : ["rgba(255,152,0,0.95)", "rgba(255,193,7,0.90)"]; // Kräftiges Orange/Gelb für Light Mode

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
          <Text style={[styles.text, { color: textColor }]}>{text}</Text>
        </LinearGradient>
      </View>
    </View>
  );
};

export default DevBanner;
