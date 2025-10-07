// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.tsx
import React from "react";
import { View } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { spacing } from "@/utils/theme";
import ThemeToggleSwitch from "../ThemeToggleSwitch/ThemeToggleSwitch";
import AppearanceGroup from "../AppearanceGroup";

interface AppearanceSettingsProps {
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  settings,
  onSettingChange,
}) => {
  const theme = useTheme();
  const [isChanging, setIsChanging] = React.useState(false);

  if (!settings) return null;

  // Current theme setting
  const currentTheme = settings.darkMode;

  // Optimiertes Theme-Change mit direktem Update
  const handleThemeChange = async (value: "light" | "dark") => {
    // Verhindern von mehrfachen Klicks während des Wechsels
    if (isChanging || value === currentTheme) return;

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

  const handleLanguageChange = (language: "de" | "en") => {
    onSettingChange("language", language);
  };

  return (
    <Animated.View style={{ marginTop: spacing.md}} entering={FadeIn.duration(300)}>
      <ThemeToggleSwitch
        value={currentTheme}
        onValueChange={handleThemeChange}
        disabled={isChanging}
      />
      <View style={{ marginTop: spacing.lg}}>
        <AppearanceGroup onLanguageChange={handleLanguageChange} />
      </View>
    </Animated.View>
  );
};

export default AppearanceSettings;