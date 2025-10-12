// screens/Settings/components/AppearanceGroup/AppearanceGroup.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import PinselIcon from "@/assets/svg/pinsel.svg";
import LanguageIcon from "@/assets/svg/language.svg";
import GraduateIcon from "@/assets/svg/GraduateIcon";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { useProgressColor, useUpdateProgressColor } from "@/hooks/useProgressColor";
import { loadColorUnlock, syncUnlockedColors, ColorUnlockData, loadStats } from "@/utils/storage";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { getSortedLanguages, getLanguageLabel } from "@/locales/languages";
import ColorPickerModal from "@/screens/GameCompletion/components/PathCard/components/ColorPickerModal";
import TitlePickerModal from "@/screens/GameCompletion/components/LevelCard/components/TitlePickerModal";
import BottomSheetModal from "@/components/BottomSheetModal";
import { useEffect } from "react";
import { loadUserProfile, updateUserTitle, updateUserAvatar } from "@/utils/profileStorage";
import AvatarPicker from "@/screens/Leistung/components/AvatarPicker";
import { getAvatarUri } from "@/screens/Leistung/utils/avatarStorage";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "@/screens/Leistung/utils/defaultAvatars";

interface AppearanceGroupProps {
  onLanguageChange: (language: "de" | "en" | "hi") => void;
}

const AppearanceGroup: React.FC<AppearanceGroupProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();
  const updateColor = useUpdateProgressColor();

  // State for PathColorSelector
  const [showColorModal, setShowColorModal] = useState(false);
  const [colorUnlockData, setColorUnlockData] = useState<ColorUnlockData | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  // State for AvatarPicker
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // State for TitleSelector
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);

  // State for LanguageSelector
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const currentLanguage = i18n.language;
  const deviceLanguageCode = Localization.getLocales()[0]?.languageCode;
  const sortedLanguages = React.useMemo(
    () => getSortedLanguages(deviceLanguageCode ?? undefined),
    [deviceLanguageCode]
  );

  // Load color data and title on mount
  useEffect(() => {
    const loadData = async () => {
      const stats = await loadStats();
      const currentXp = stats?.totalXP || 0;

      const levelThresholds = getLevels();
      let level = 0;
      for (let i = 0; i < levelThresholds.length; i++) {
        if (currentXp >= levelThresholds[i].xp) {
          level = i; // Index ist das Level (0-basiert)
        } else {
          break;
        }
      }
      setCurrentLevel(level);

      await syncUnlockedColors(level);
      const data = await loadColorUnlock();
      setColorUnlockData(data);

      // Load user title and avatar
      const profile = await loadUserProfile();
      setSelectedTitleIndex(profile.titleLevelIndex ?? null);

      const uri = await getAvatarUri();
      if (profile.avatarUri) {
        setAvatarUri(profile.avatarUri);
      } else if (uri) {
        setAvatarUri(uri);
      }
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

  const getColorName = (hex: string): string => {
    const colorMap: Record<string, string> = {
      "#4285F4": t("pathColor.colors.blue"),
      "#34A853": t("pathColor.colors.green"),
      "#F9AB00": t("pathColor.colors.yellow"),
      "#FBBC05": t("pathColor.colors.yellow"),
      "#EA4335": t("pathColor.colors.red"),
      "#7C4DFF": t("pathColor.colors.purple"),
      "#673AB7": t("pathColor.colors.purple"),
    };
    return colorMap[hex] || t("pathColor.colors.blue");
  };

  // Avatar handler
  const handleAvatarChange = async (uri: string | null) => {
    await updateUserAvatar(uri);
    setAvatarUri(uri);
    triggerHaptic("success");
  };

  const getAvatarSource = () => getAvatarSourceFromUri(avatarUri, DEFAULT_AVATAR);

  // Title handlers
  const handleTitleSelect = async (levelIndex: number | null) => {
    await updateUserTitle(levelIndex);
    setSelectedTitleIndex(levelIndex);
    triggerHaptic("success");
  };

  const getTitleName = (): string => {
    if (selectedTitleIndex === null) {
      return t("appearance.noTitle");
    }
    const allLevels = getLevels();
    return allLevels[selectedTitleIndex]?.name || t("appearance.noTitle");
  };

  // Language handlers
  const handleLanguageSelect = async (language: string) => {
    if (language === currentLanguage) {
      setShowLanguageModal(false);
      return;
    }

    triggerHaptic("light");
    await i18n.changeLanguage(language);
    onLanguageChange(language as "de" | "en" | "hi");
    setShowLanguageModal(false);
  };

  const cardBg = theme.isDark ? "rgba(255,255,255,0.06)" : colors.surface;
  const cardBorder = theme.isDark ? "rgba(255,255,255,0.10)" : colors.border;
  const selectedBg = theme.isDark ? "rgba(138, 180, 248, 0.15)" : "rgba(66, 133, 244, 0.08)";
  const selectedBorder = theme.isDark ? "rgba(138, 180, 248, 0.4)" : "rgba(66, 133, 244, 0.3)";

  if (!colorUnlockData) return null;

  // Prepare title options for modal (after early return check)
  const allLevels = getLevels();
  const titleOptions = allLevels.map((level, index) => ({
    name: level.name,
    level: index,
    isUnlocked: index <= currentLevel,
  }));

  return (
    <>
      <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Avatar Button */}
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            triggerHaptic("light");
            setShowAvatarPicker(true);
          }}
        >
          <View style={styles.avatarIconContainer}>
            <Image source={getAvatarSource()} style={styles.avatarIcon} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {t("appearance.avatar")}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Title Button */}
        <TouchableOpacity
          style={[styles.actionButton, { borderTopWidth: 1, borderTopColor: colors.border }]}
          onPress={() => {
            triggerHaptic("light");
            setShowTitleModal(true);
          }}
        >
          <View style={styles.actionIcon}>
            <GraduateIcon width={48} height={48} color={colors.textSecondary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary }]}>
              {t("appearance.title")}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Path Color Button */}
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
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>

        {/* Language Button */}
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

      {/* Title Picker Modal */}
      <TitlePickerModal
        visible={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        titles={titleOptions}
        selectedTitleIndex={selectedTitleIndex}
        onSelectTitle={handleTitleSelect}
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        textSecondaryColor={colors.textSecondary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
        progressColor={progressColor}
      />

      {/* Avatar Picker Modal */}
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={() => setShowAvatarPicker(false)}
        onImageSelected={handleAvatarChange}
        currentAvatarUri={avatarUri}
      />

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <BottomSheetModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          title={t("languageModal.title")}
          isDark={theme.isDark}
          textPrimaryColor={colors.textPrimary}
          surfaceColor={colors.surface}
          borderColor={cardBorder}
          snapPoints={['50%', '70%']}
        >
          <View style={styles.languageOptions}>
            {sortedLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: currentLanguage === language.code ? selectedBg : cardBg,
                    borderColor: currentLanguage === language.code ? selectedBorder : cardBorder,
                  },
                ]}
              >
                <View style={styles.languageContent}>
                  <Text style={styles.flagEmoji}>{language.flag}</Text>
                  <Text style={[styles.languageName, { color: colors.textPrimary }]}>
                    {language.name}
                  </Text>
                </View>
                {currentLanguage === language.code && (
                  <Feather name="check" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BottomSheetModal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
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
  avatarIconContainer: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
    borderRadius: 24,
    overflow: "hidden",
  },
  avatarIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Language Options
  languageOptions: {
    gap: 12,
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
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

export default AppearanceGroup;
