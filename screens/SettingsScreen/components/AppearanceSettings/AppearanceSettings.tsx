// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { spacing } from "@/utils/theme";
import styles from "./AppearanceSettings.styles";
import { triggerHaptic } from "@/utils/haptics";

interface AppearanceSettingsProps {
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  if (!settings) return null;

  // Current theme setting
  const currentTheme = settings.darkMode;

  // Theme options - only Light and Dark now
  const themeOptions = [
    { id: "light", label: "Hell", icon: "sun" },
    { id: "dark", label: "Dunkel", icon: "moon" }
  ];

  // Change theme
  const handleThemeChange = (value: "light" | "dark") => {
    triggerHaptic("light");
    onSettingChange("darkMode", value);
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      style={[
        styles.themeToggleContainer,
        { 
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.03)",
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          marginBottom: spacing.md
        }
      ]}
    >
      {themeOptions.map((option) => (
        <TouchableOpacity
          key={option.id}
          style={[
            styles.themeOption,
            currentTheme === option.id && styles.activeThemeOption,
            currentTheme === option.id && { backgroundColor: colors.primary }
          ]}
          onPress={() => handleThemeChange(option.id as "light" | "dark")}
          activeOpacity={0.7}
        >
          <Feather 
            name={option.icon as any} 
            size={22} 
            color={currentTheme === option.id ? "#FFFFFF" : colors.textPrimary} 
            style={styles.themeIcon}
          />
          <Text
            style={[
              styles.themeText,
              { 
                color: currentTheme === option.id 
                  ? "#FFFFFF" 
                  : colors.textPrimary,
                fontWeight: currentTheme === option.id ? "600" : "400",
              }
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
};

export default AppearanceSettings;