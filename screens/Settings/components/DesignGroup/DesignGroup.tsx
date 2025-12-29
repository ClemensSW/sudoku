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
import LupeIcon from "@/assets/svg/lupe.svg";
import { triggerHaptic } from "@/utils/haptics";
import { FONT_SCALE_OPTIONS } from "@/utils/theme/typography";
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

  // State for Font Scale
  const currentFontScaleIndex = FONT_SCALE_OPTIONS.findIndex(opt => opt.value === theme.fontScale);
  const [fontScaleIndex, setFontScaleIndex] = useState(currentFontScaleIndex >= 0 ? currentFontScaleIndex : 1);

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

  // Get translated font scale label based on index
  const getFontScaleLabel = (index: number): string => {
    const labels = ['small', 'normal', 'large', 'larger', 'veryLarge'];
    return t(`appearance.fontSizeOptions.${labels[index]}`, { defaultValue: FONT_SCALE_OPTIONS[index].label });
  };

  // Theme Toggle handler - automatically disables sync when manually changed
  const handleThemeToggle = async (value: "light" | "dark") => {
    // If sync is ON, turn it OFF when user manually changes theme
    if (syncWithSystem) {
      setSyncWithSystem(false);
    }
    // Call parent's onThemeChange which will save the manual preference
    onThemeChange(value);
  };

  // Theme Sync Switch handler
  const handleSyncWithSystemToggle = async (value: boolean) => {
    triggerHaptic("light");
    setSyncWithSystem(value);

    if (value) {
      // Switch ON → Reset to system theme
      await theme.resetToSystemTheme();
      // DON'T call onThemeChange - it would mark the theme as manually set!
      // The ThemeToggleSwitch will automatically update because it uses theme.isDark
    } else {
      // Switch OFF → Current theme becomes manual preference
      const currentMode = theme.isDark ? "dark" : "light";
      await theme.updateTheme(currentMode);
    }
  };

  // Font Scale handler
  const handleFontScaleSelect = async (index: number) => {
    if (index !== fontScaleIndex) {
      setFontScaleIndex(index);
      triggerHaptic("light");
      const newScale = FONT_SCALE_OPTIONS[index].value;
      await theme.updateFontScale(newScale);
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
          value={theme.isDark ? "dark" : "light"}
          onValueChange={handleThemeToggle}
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
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: theme.typography.size.md }]}>
              {t("appearance.theme", { defaultValue: "Theme" })}
            </Text>
            <Text style={[styles.settingSubtext, { color: colors.textSecondary, fontSize: theme.typography.size.xs + 1 }]}>
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
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: theme.typography.size.md }]}>
              {t("appearance.pathColor")}
            </Text>
            <View style={styles.colorSubtitleContainer}>
              <View style={[styles.colorCircle, { backgroundColor: progressColor }]} />
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary, fontSize: theme.typography.size.sm }]}>
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
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: theme.typography.size.md }]}>
              {t("appearance.language")}
            </Text>
            <Text style={[styles.actionSubtitle, { color: colors.textSecondary, fontSize: theme.typography.size.sm }]}>
              {getLanguageName(currentLanguage)}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Font Scale */}
        <View style={[styles.fontScaleSection, { borderTopWidth: 1, borderTopColor: colors.border }]}>
          <View style={styles.fontScaleHeader}>
            <View style={styles.actionIcon}>
              <LupeIcon width={48} height={48} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: theme.typography.size.md }]}>
                {t("appearance.fontSize", { defaultValue: "Schriftgröße" })}
              </Text>
              <Text style={[styles.actionSubtitle, { color: colors.textSecondary, fontSize: theme.typography.size.sm }]}>
                {getFontScaleLabel(fontScaleIndex)}
              </Text>
            </View>
          </View>
          <View style={styles.fontScaleStepsContainer}>
            <Text style={[styles.fontScaleIndicator, { color: colors.textSecondary, fontSize: theme.typography.size.sm }]}>
              Aa
            </Text>
            <View style={styles.fontScaleSteps}>
              {FONT_SCALE_OPTIONS.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.fontScaleStepTouchable}
                  onPress={() => handleFontScaleSelect(index)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 6, right: 6 }}
                >
                  <View
                    style={[
                      styles.fontScaleStep,
                      {
                        backgroundColor: index <= fontScaleIndex ? progressColor : colors.border,
                      },
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <Text style={[styles.fontScaleIndicator, { color: colors.textSecondary, fontSize: theme.typography.size.xl + 2 }]}>
              Aa
            </Text>
          </View>
        </View>
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
        managesBottomNav={false}
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
        managesBottomNav={false}
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
                <Text style={[styles.flagEmoji, { fontSize: theme.typography.size.xxl + 4 }]}>{lang.flag}</Text>
                <Text style={[styles.languageName, { color: colors.textPrimary, fontSize: theme.typography.size.lg }]}>
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
    marginBottom: spacing.xxl,
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
    fontWeight: "600",
  },
  actionSubtitle: {
    marginTop: 2,
  },
  settingSubtext: {
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
    // fontSize set dynamically via theme.typography
  },
  languageName: {
    fontWeight: "600",
    // fontSize set dynamically via theme.typography
  },
  fontScaleSection: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  fontScaleHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  fontScaleStepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm, // Full width, symmetric padding
  },
  fontScaleSteps: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: spacing.xs,
    height: 44,
  },
  fontScaleStepTouchable: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  fontScaleStep: {
    width: "100%",
    height: 8,
    borderRadius: 4,
  },
  fontScaleIndicator: {
    fontWeight: "600",
    // fontSize set dynamically via theme.typography
  },
});

export default DesignGroup;
