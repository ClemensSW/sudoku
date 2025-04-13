// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import styles from "./AppearanceSettings.styles";

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

  // Aktuelle Designeinstellung
  const currentTheme = settings.darkMode;

  // Theme-Optionen
  const themeOptions = [
    { id: "light", label: "Hell", icon: "sun" },
    { id: "dark", label: "Dunkel", icon: "moon" },
    { id: "system", label: "System", icon: "smartphone" },
  ];

  // Theme ändern
  const handleThemeChange = (value: "system" | "light" | "dark") => {
    onSettingChange("darkMode", value);
  };

  return (
    <View
      style={[styles.settingsGroup, { borderColor: colors.border }]}
    >
      <View style={styles.settingRow}>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>
            Design
          </Text>
          <Text
            style={[styles.settingDescription, { color: colors.textSecondary }]}
          >
            Lege fest, wie deine App aussehen soll
          </Text>
        </View>

        {/* Segmentierter Button für Themeauswahl */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[
            styles.segmentContainer,
            { backgroundColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" }
          ]}
        >
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.segment,
                currentTheme === option.id && styles.activeSegment,
                currentTheme === option.id && { backgroundColor: colors.primary }
              ]}
              onPress={() => handleThemeChange(option.id as "system" | "light" | "dark")}
            >
              <Text
                style={[
                  styles.segmentText,
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
      </View>
    </View>
  );
};

export default AppearanceSettings;