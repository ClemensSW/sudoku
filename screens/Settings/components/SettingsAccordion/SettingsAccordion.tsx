// screens/Settings/components/SettingsAccordion/SettingsAccordion.tsx
import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import AccordionSection from "../AccordionSection";
import AppearanceSettings from "../AppearanceSettings";
import GameSettings from "../GameSettings/GameSettings";
import HelpSection from "../HelpSection/HelpSection";
import ActionsSection from "../ActionsSection/ActionsSection";
import CommunitySection from "../CommunitySection/CommunitySection";
import InfoSection from "../InfoSection/InfoSection";
import ThemeToggleSwitch from "../ThemeToggleSwitch/ThemeToggleSwitch";


type CategoryKey = "profile" | "design" | "game" | "help" | "actions" | "community" | "info" | null;

interface SettingsAccordionProps {
  settings: GameSettingsType | null;
  onSettingChange: (key: keyof GameSettingsType, value: boolean | string) => void;
  showGameFeatures: boolean;
  isDuoMode: boolean;
  onAutoNotes?: () => void;
  onHowToPlay: () => void;
  onQuitGame?: () => void;
  onPauseGame?: () => void;
  onSupportPress: () => void;
  onSharePress: () => void;
  onAboutPress: () => void;
  onLegalPress: () => void;
}

const SettingsAccordion: React.FC<SettingsAccordionProps> = ({
  settings,
  onSettingChange,
  showGameFeatures,
  isDuoMode,
  onAutoNotes,
  onHowToPlay,
  onQuitGame,
  onPauseGame,
  onSupportPress,
  onSharePress,
  onAboutPress,
  onLegalPress,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  // State: which category is expanded (single-expand accordion)
  const [expandedCategory, setExpandedCategory] = useState<CategoryKey>("profile");

  const handleToggle = (category: CategoryKey) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  // Optimized theme change handler
  const handleThemeChange = async (value: "light" | "dark") => {
    await theme.updateTheme(value);
    onSettingChange("darkMode", value);
  };

  return (
    <View style={styles.container}>
      {/* Profile Category */}
      <AccordionSection
        title={t("categories.profile")}
        isExpanded={expandedCategory === "profile"}
        onToggle={() => handleToggle("profile")}
      >
        {settings && (
          <AppearanceSettings
            settings={settings}
            onSettingChange={onSettingChange}
          />
        )}
      </AccordionSection>

      {/* Design Category */}
      <AccordionSection
        title={t("categories.design")}
        isExpanded={expandedCategory === "design"}
        onToggle={() => handleToggle("design")}
      >
        {settings && (
          <View style={styles.themeContainer}>
            <ThemeToggleSwitch
              value={settings.darkMode}
              onValueChange={handleThemeChange}
            />
          </View>
        )}
      </AccordionSection>

      {/* Game Category */}
      <AccordionSection
        title={t("categories.game")}
        isExpanded={expandedCategory === "game"}
        onToggle={() => handleToggle("game")}
      >
        {settings && (
          <GameSettings
            settings={settings}
            onSettingChange={onSettingChange}
            isDuoMode={isDuoMode}
          />
        )}
      </AccordionSection>

      {/* Help Category */}
      <AccordionSection
        title={t("categories.help")}
        isExpanded={expandedCategory === "help"}
        onToggle={() => handleToggle("help")}
      >
        <HelpSection
          showGameFeatures={showGameFeatures && !isDuoMode}
          onAutoNotes={showGameFeatures && !isDuoMode ? onAutoNotes : undefined}
          onHowToPlay={onHowToPlay}
        />
      </AccordionSection>

      {/* Actions Category - Only show when in game */}
      {showGameFeatures && (
        <AccordionSection
          title={t("categories.actions")}
          isExpanded={expandedCategory === "actions"}
          onToggle={() => handleToggle("actions")}
        >
          <ActionsSection
            showGameFeatures={showGameFeatures}
            onQuitGame={onQuitGame}
            onPauseGame={onPauseGame}
            isDuoMode={isDuoMode}
          />
        </AccordionSection>
      )}

      {/* Community Category */}
      <AccordionSection
        title={t("categories.community")}
        isExpanded={expandedCategory === "community"}
        onToggle={() => handleToggle("community")}
      >
        <CommunitySection
          onSupportPress={onSupportPress}
          onSharePress={onSharePress}
        />
      </AccordionSection>

      {/* Info Category */}
      <AccordionSection
        title={t("categories.info")}
        isExpanded={expandedCategory === "info"}
        onToggle={() => handleToggle("info")}
      >
        <InfoSection
          onAboutPress={onAboutPress}
          onLegalPress={onLegalPress}
        />
      </AccordionSection>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

export default SettingsAccordion;
