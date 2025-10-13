// screens/Settings/components/DesignGroup/DesignGroup.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Switch } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import PinselIcon from "@/assets/svg/pinsel.svg";
import LanguageIcon from "@/assets/svg/language.svg";
import TagUndNachtIcon from "@/assets/svg/tag-und-nacht.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { useProgressColor, useUpdateProgressColor, useStoredColorHex } from "@/hooks/useProgressColor";
import { hexToColorId } from "@/utils/pathColors";
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
  const storedColorHex = useStoredColorHex();
  const updateColor = useUpdateProgressColor();

  // State for PathColorSelector
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorUnlockData, setColorUnlockData] = useState<ColorUnlockData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  // State for Language Selector
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const currentLanguage = i18n.language as "de" | "en" | "hi";
  const sortedLanguages = getSortedLanguages(currentLanguage);

  // State for System Theme Sync
  const [syncWithSystem, setSyncWithSystem] = useState(theme.isFollowingSystem);

  // Update syncWithSystem when theme.isFollowingSystem changes
  useEffect(() => {
    setSyncWithSystem(theme.isFollowingSystem);
  }, [theme.isFollowingSystem]);

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

  // Get color name from hex value using the path colors system
  const getColorName = (): string => {
    const colorId = hexToColorId(storedColorHex);
    return t(`pathColor.colors.${colorId}`);
  };

  // Theme Sync Switch handler
  const handleSyncWithSystemToggle = async (value: boolean) => {
    triggerHaptic("light");
    setSyncWithSystem(value);

    if (value) {
      // Switch ON → Reset to system theme
      await theme.resetToSystemTheme();
    } else {
      // Switch OFF → Current theme becomes manual preference
      const currentMode = theme.isDark ? "dark" : "light";
      await theme.updateTheme(currentMode);
    }
  };

  // iOS-style switch colors
  const switchTrackColorActive = theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)";
  const switchTrackColorInactive = theme.isDark ? "rgba(255,255,255,0.16)" : "rgba(120,120,128,0.16)";
  const switchThumbColorActive = "#FFFFFF";
  const switchThumbColorInactive = theme.isDark ? "#666666" : "rgba(255,255,255,0.7)";

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

      {/* Theme Sync, Path Color & Language */}
      <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Theme Sync Switch Button */}
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => handleSyncWithSystemToggle(!syncWithSystem)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <TagUndNachtIcon width={48} height={48} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {t("appearance.theme", { defaultValue: "Theme" })}
            </Text>
            <Text style={[styles.settingSubtext, { color: colors.textSecondary }]}>
              {t("appearance.useSystemSettings", { defaultValue: "Geräteeinstellungen verwenden" })}
            </Text>
          </View>
          <Switch
            value={syncWithSystem}
            onValueChange={handleSyncWithSystemToggle}
            trackColor={{ false: switchTrackColorInactive, true: switchTrackColorActive }}
            thumbColor={syncWithSystem ? switchThumbColorActive : switchThumbColorInactive}
            ios_backgroundColor={switchTrackColorInactive}
          />
        </TouchableOpacity>

        {/* Path Color */}
        <TouchableOpacity
          style={[styles.actionButton, { borderTopWidth: 1, borderTopColor: colors.border }]}
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
                {getColorName()}
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
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
        snapPoints={['50%', '70%']}
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
                <Text style={styles.flagEmoji}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                  {lang.name}
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
  settingRow: {
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
  settingTextContainer: {
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
  settingSubtext: {
    fontSize: 13,
    marginTop: 2,
    opacity: 0.8,
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
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  flagEmoji: {
    fontSize: 28,
  },
  languageName: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default DesignGroup;
