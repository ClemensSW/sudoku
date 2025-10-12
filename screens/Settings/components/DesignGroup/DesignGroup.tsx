// screens/Settings/components/DesignGroup/DesignGroup.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import PinselIcon from "@/assets/svg/pinsel.svg";
import LanguageIcon from "@/assets/svg/language.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { useProgressColor, useUpdateProgressColor } from "@/hooks/useProgressColor";
import { loadColorUnlock, syncUnlockedColors, ColorUnlockData, loadStats } from "@/utils/storage";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { getSortedLanguages } from "@/locales/languages";
import ColorPickerModal from "@/screens/GameCompletion/components/PathCard/components/ColorPickerModal";
import BottomSheetModal from "@/components/BottomSheetModal";
import ThemeToggleSwitch from "../ThemeToggleSwitch/ThemeToggleSwitch";

interface DesignGroupProps {
  themeValue: "light" | "dark";
  onThemeChange: (value: "light" | "dark") => void;
  onLanguageChange: (language: "de" | "en" | "hi") => void;
  isChanging: boolean;
}

const DesignGroup: React.FC<DesignGroupProps> = ({
  themeValue,
  onThemeChange,
  onLanguageChange,
  isChanging,
}) => {
  const { t, i18n } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();
  const updateColor = useUpdateProgressColor();

  // State for PathColorSelector
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorUnlockData, setColorUnlockData] = useState<ColorUnlockData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  // State for Language Selector
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const currentLanguage = i18n.language as "de" | "en" | "hi";
  const sortedLanguages = getSortedLanguages(currentLanguage);

  // Load color data on mount
  useEffect(() => {
    const loadData = async () => {
      const stats = await loadStats();
      const currentXp = stats?.totalXP || 0;

      const levelThresholds = getLevels();
      let level = 0;
      for (let i = 0; i < levelThresholds.length; i++) {
        if (currentXp >= levelThresholds[i].xp) {
          level = i;
        } else {
          break;
        }
      }
      setCurrentLevel(level);

      await syncUnlockedColors(level);
      const data = await loadColorUnlock();
      setColorUnlockData(data);
    };
    loadData();
  }, []);

  // Color handlers
  const handleColorSelect = async (color: string) => {
    await updateColor(color);
    const updatedData = await loadColorUnlock();
    setColorUnlockData(updatedData);
    triggerHaptic("success");
  };

  // Language handlers
  const handleLanguageChange = (language: "de" | "en" | "hi") => {
    onLanguageChange(language);
    setShowLanguageModal(false);
    triggerHaptic("success");
  };

  const getLanguageName = (lang: "de" | "en" | "hi") => {
    const languageMap = {
      de: "Deutsch",
      en: "English",
      hi: "हिन्दी",
    };
    return languageMap[lang];
  };

  // Get color name from hex value
  const getColorNameFromHex = (hexColor: string): string => {
    const colorMap: { [key: string]: string } = {
      "#4A90E2": "blue",    // Blau
      "#50C878": "green",   // Grün
      "#F4C542": "yellow",  // Gelb
      "#E63946": "red",     // Rot
      "#8A78B4": "purple",  // Lila
    };

    const colorKey = colorMap[hexColor.toUpperCase()];
    return colorKey ? t(`pathColor.colors.${colorKey}`) : "";
  };

  if (!colorUnlockData) return null;

  return (
    <>
      {/* Theme Toggle */}
      <View style={styles.themeContainer}>
        <ThemeToggleSwitch
          value={themeValue}
          onValueChange={onThemeChange}
          disabled={isChanging}
        />
      </View>

      {/* Path Color & Language */}
      <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Path Color */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            triggerHaptic("light");
            setShowColorModal(true);
          }}
        >
          <View style={styles.actionIcon}>
            <PinselIcon width={48} height={48} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {t("appearance.pathColor")}
            </Text>
            <View style={styles.colorSubtitleContainer}>
              <View style={[styles.colorCircle, { backgroundColor: progressColor }]} />
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
                {getColorNameFromHex(colorUnlockData?.selectedColor || progressColor)}
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Language */}
        <TouchableOpacity
          style={[styles.actionButton, { borderTopWidth: 1, borderTopColor: colors.border }]}
          onPress={() => {
            triggerHaptic("light");
            setShowLanguageModal(true);
          }}
        >
          <View style={styles.actionIcon}>
            <LanguageIcon width={48} height={48} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {t("appearance.language")}
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary }]}>
              {getLanguageName(currentLanguage)}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Color Picker Modal */}
      <ColorPickerModal
        visible={showColorModal}
        onClose={() => setShowColorModal(false)}
        selectedColor={colorUnlockData?.selectedColor}
        unlockedColors={colorUnlockData?.unlockedColors || []}
        onSelectColor={handleColorSelect}
        currentLevel={currentLevel}
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        textSecondaryColor={colors.textSecondary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
      />

      {/* Language Picker Modal */}
      <BottomSheetModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        title={t("appearance.languageModal.title")}
        subtitle={t("appearance.languageModal.subtitle")}
      >
        <View style={styles.languageList}>
          {sortedLanguages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
                currentLanguage === lang.code && {
                  borderColor: progressColor,
                  borderWidth: 2,
                },
              ]}
              onPress={() => handleLanguageChange(lang.code)}
            >
              <View style={styles.languageContent}>
                <Text style={[styles.languageNative, { color: colors.textPrimary }]}>
                  {lang.native}
                </Text>
                <Text style={[styles.languageEnglish, { color: colors.textSecondary }]}>
                  {lang.english}
                </Text>
              </View>
              {currentLanguage === lang.code && (
                <Feather name="check" size={24} color={progressColor} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheetModal>
    </>
  );
};

const styles = StyleSheet.create({
  themeContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  colorSubtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 6,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  languageList: {
    gap: 12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  languageContent: {
    flex: 1,
  },
  languageNative: {
    fontSize: 18,
    fontWeight: "600",
  },
  languageEnglish: {
    fontSize: 14,
    marginTop: 2,
  },
});

export default DesignGroup;
