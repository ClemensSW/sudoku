// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.tsx
import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
  const [isChanging, setIsChanging] = React.useState(false);

  if (!settings) return null;

  // Current theme setting
  const currentTheme = settings.darkMode;

  // Theme options - only Light and Dark now
  const themeOptions = [
    { id: "light", label: "Hell", icon: "sun" },
    { id: "dark", label: "Dunkel", icon: "moon" }
  ];

  // NEU: Optimiertes Theme-Change mit direktem Update
  const handleThemeChange = async (value: "light" | "dark") => {
    // Verhindern von mehrfachen Klicks während des Wechsels
    if (isChanging || value === currentTheme) return;
    
    triggerHaptic("light");
    setIsChanging(true);
    
    // Direkt das Theme im Provider aktualisieren
    await theme.updateTheme(value);
    
    // Settings-Handler aufrufen (für lokale State-Updates)
    onSettingChange("darkMode", value);
    
    // Nach kurzer Verzögerung wieder aktivieren
    setTimeout(() => {
      setIsChanging(false);
    }, 300);
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
          marginBottom: spacing.md,
          opacity: isChanging ? 0.7 : 1, // Visuelles Feedback während des Wechsels
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
          disabled={isChanging} // Deaktivieren während des Wechsels
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
      
      {/* Loading Indicator während des Wechsels */}
      {isChanging && (
        <View 
          style={{
            position: 'absolute',
            right: 12,
            top: '50%',
            marginTop: -10,
          }}
        >
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
    </Animated.View>
  );
};

export default AppearanceSettings;