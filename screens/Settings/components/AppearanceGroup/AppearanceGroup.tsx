// screens/Settings/components/AppearanceGroup/AppearanceGroup.tsx
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image, Switch, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import * as Localization from "expo-localization";
import PinselIcon from "@/assets/svg/pinsel.svg";
import LanguageIcon from "@/assets/svg/language.svg";
import GraduateIcon from "@/assets/svg/GraduateIcon";
import TagUndNachtIcon from "@/assets/svg/tag-und-nacht.svg";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import { useProgressColor, useUpdateProgressColor } from "@/hooks/useProgressColor";
import { loadColorUnlock, syncUnlockedColors, ColorUnlockData, loadStats } from "@/utils/storage";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { getSortedLanguages, getLanguageLabel } from "@/locales/languages";
import BottomSheetModal from "@/components/BottomSheetModal";
import { loadUserProfile, updateUserTitle, updateUserAvatar } from "@/utils/profileStorage";
import { getAvatarUri } from "@/screens/Leistung/utils/avatarStorage";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "@/screens/Leistung/utils/defaultAvatars";

// Lazy load heavy modal components
const ColorPickerModal = lazy(() => import("@/screens/GameCompletion/components/PathCard/components/ColorPickerModal"));
const TitlePickerModal = lazy(() => import("@/screens/GameCompletion/components/LevelCard/components/TitlePickerModal"));
const AvatarPicker = lazy(() => import("@/screens/Leistung/components/AvatarPicker"));

interface AppearanceGroupProps {
  onLanguageChange: (language: "de" | "en" | "hi") => void;
}

const AppearanceGroup: React.FC<AppearanceGroupProps> = ({ onLanguageChange }) => {
  const { t, i18n } = useTranslation("settings");
  const theme = useTheme();
  const { colors, typography } = theme;
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

  // State for System Theme Sync (initially load from theme context)
  const [syncWithSystem, setSyncWithSystem] = useState(theme.isFollowingSystem);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load color data and title on mount
  useEffect(() => {
    // Update syncWithSystem when theme.isFollowingSystem changes
    setSyncWithSystem(theme.isFollowingSystem);
  }, [theme.isFollowingSystem]);

  // Lazy load data only when first modal is opened
  const loadDataIfNeeded = useCallback(async () => {
    if (colorUnlockData || isLoadingData) return; // Already loaded or loading

    setIsLoadingData(true);
    try {
      const [stats, profile, uri] = await Promise.all([
        loadStats(),
        loadUserProfile(),
        getAvatarUri(),
      ]);

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

      setSelectedTitleIndex(profile.titleLevelIndex ?? null);
      setAvatarUri(profile.avatarUri || uri);
    } finally {
      setIsLoadingData(false);
    }
  }, [colorUnlockData, isLoadingData]);

  // Color handlers - memoized
  const handleColorSelect = useCallback(async (color: string) => {
    await updateColor(color);
    const updatedData = await loadColorUnlock();
    setColorUnlockData(updatedData);
    triggerHaptic("success");
  }, [updateColor]);

  // Avatar handler - memoized
  const handleAvatarChange = useCallback(async (uri: string | null) => {
    await updateUserAvatar(uri);
    setAvatarUri(uri);
    triggerHaptic("success");
  }, []);

  const getAvatarSource = useMemo(
    () => getAvatarSourceFromUri(avatarUri, DEFAULT_AVATAR),
    [avatarUri]
  );

  // Title handlers - memoized
  const handleTitleSelect = useCallback(async (levelIndex: number | null) => {
    await updateUserTitle(levelIndex);
    setSelectedTitleIndex(levelIndex);
    triggerHaptic("success");
  }, []);

  // Language handlers - memoized
  const handleLanguageSelect = useCallback(async (language: string) => {
    if (language === currentLanguage) {
      setShowLanguageModal(false);
      return;
    }

    triggerHaptic("light");
    await i18n.changeLanguage(language);
    onLanguageChange(language as "de" | "en" | "hi");
    setShowLanguageModal(false);
  }, [currentLanguage, i18n, onLanguageChange]);

  // Theme Sync Switch handler - memoized
  const handleSyncWithSystemToggle = useCallback(async (value: boolean) => {
    triggerHaptic("light");
    setSyncWithSystem(value);

    if (value) {
      await theme.resetToSystemTheme();
    } else {
      const currentMode = theme.isDark ? "dark" : "light";
      await theme.updateTheme(currentMode);
    }
  }, [theme]);

  // Memoized style values
  const switchColors = useMemo(() => ({
    trackActive: theme.isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.3)",
    trackInactive: theme.isDark ? "rgba(255,255,255,0.16)" : "rgba(120,120,128,0.16)",
    thumbActive: "#FFFFFF",
    thumbInactive: theme.isDark ? "#666666" : "rgba(255,255,255,0.7)",
  }), [theme.isDark]);

  const cardStyles = useMemo(() => ({
    bg: theme.isDark ? "rgba(255,255,255,0.06)" : colors.surface,
    border: theme.isDark ? "rgba(255,255,255,0.10)" : colors.border,
    selectedBg: theme.isDark ? "rgba(138, 180, 248, 0.15)" : "rgba(66, 133, 244, 0.08)",
    selectedBorder: theme.isDark ? "rgba(138, 180, 248, 0.4)" : "rgba(66, 133, 244, 0.3)",
  }), [theme.isDark, colors.surface, colors.border]);

  // Prepare title options for modal - memoized
  const titleOptions = useMemo(() => {
    if (!colorUnlockData) return [];
    const allLevels = getLevels();
    return allLevels.map((level, index) => ({
      name: level.name,
      level: index,
      isUnlocked: index <= currentLevel,
    }));
  }, [colorUnlockData, currentLevel]);

  return (
    <>
      <View style={[styles.settingsGroup, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Avatar Button - Only show if data loaded */}
        {colorUnlockData && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={async () => {
              triggerHaptic("light");
              await loadDataIfNeeded();
              setShowAvatarPicker(true);
            }}
          >
            <View style={styles.avatarIconContainer}>
              <Image source={getAvatarSource()} style={styles.avatarIcon} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                {t("appearance.avatar")}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Title Button - Only show if data loaded */}
        {colorUnlockData && (
          <TouchableOpacity
            style={[styles.actionButton, { borderTopWidth: colorUnlockData ? 1 : 0, borderTopColor: colors.border }]}
            onPress={async () => {
              triggerHaptic("light");
              await loadDataIfNeeded();
              setShowTitleModal(true);
            }}
          >
            <View style={styles.actionIcon}>
              <GraduateIcon width={48} height={48} color={colors.textSecondary} />
            </View>
            <View style={styles.actionTextContainer}>
              <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                {t("appearance.title")}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}

        {/* Theme Sync Switch Button - Always show */}
        <TouchableOpacity
          style={[styles.settingRow, { borderTopWidth: colorUnlockData ? 1 : 0, borderTopColor: colors.border }]}
          onPress={() => handleSyncWithSystemToggle(!syncWithSystem)}
          activeOpacity={0.7}
        >
          <View style={styles.actionIcon}>
            <TagUndNachtIcon width={48} height={48} />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
              {t("appearance.theme", { defaultValue: "Theme" })}
            </Text>
            <Text style={[styles.settingSubtext, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
              {t("appearance.useSystemSettings", { defaultValue: "Geräteeinstellungen verwenden" })}
            </Text>
          </View>
          <Switch
            value={syncWithSystem}
            onValueChange={handleSyncWithSystemToggle}
            trackColor={{ false: switchColors.trackInactive, true: switchColors.trackActive }}
            thumbColor={syncWithSystem ? switchColors.thumbActive : switchColors.thumbInactive}
            ios_backgroundColor={switchColors.trackInactive}
          />
        </TouchableOpacity>

        {/* Path Color Button */}
        <TouchableOpacity
          style={[styles.actionButton, { borderTopWidth: 1, borderTopColor: colors.border }]}
          onPress={async () => {
            triggerHaptic("light");
            await loadDataIfNeeded();
            setShowColorModal(true);
          }}
        >
          <View style={styles.actionIcon}>
            <PinselIcon width={48} height={48} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
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
            <Text style={[styles.actionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
              {t("appearance.language")}
            </Text>
          </View>
          <Feather name="chevron-right" size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Lazy-loaded Modals with Suspense - Only render when visible */}
      {showColorModal && (
        <Suspense fallback={<View style={{position: 'absolute'}} />}>
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
        </Suspense>
      )}

      {showTitleModal && (
        <Suspense fallback={<View style={{position: 'absolute'}} />}>
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
            managesBottomNav={false}
          />
        </Suspense>
      )}

      {showAvatarPicker && (
        <Suspense fallback={<View style={{position: 'absolute'}} />}>
          <AvatarPicker
            visible={showAvatarPicker}
            onClose={() => setShowAvatarPicker(false)}
            onImageSelected={handleAvatarChange}
            currentAvatarUri={avatarUri}
            managesBottomNav={false}
          />
        </Suspense>
      )}

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <BottomSheetModal
          visible={showLanguageModal}
          onClose={() => setShowLanguageModal(false)}
          title={t("languageModal.title")}
          isDark={theme.isDark}
          textPrimaryColor={colors.textPrimary}
          surfaceColor={colors.surface}
          borderColor={cardStyles.border}
          snapPoints={['50%', '70%']}
          managesBottomNav={false}
        >
          <View style={styles.languageOptions}>
            {sortedLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageSelect(language.code)}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor: currentLanguage === language.code ? cardStyles.selectedBg : cardStyles.bg,
                    borderColor: currentLanguage === language.code ? cardStyles.selectedBorder : cardStyles.border,
                  },
                ]}
              >
                <View style={styles.languageContent}>
                  <Text style={[styles.flagEmoji, { fontSize: typography.size.xxl }]}>{language.flag}</Text>
                  <Text style={[styles.languageName, { color: colors.textPrimary, fontSize: typography.size.md }]}>
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
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
  },
  // Switch Row (like GameSettings)
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingSubtext: {
    // fontSize set dynamically via theme.typography
    marginTop: 2,
    opacity: 0.8,
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
    // fontSize set dynamically via theme.typography
  },
  languageName: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
  },
});

export default AppearanceGroup;
