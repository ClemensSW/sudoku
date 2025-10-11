// screens/Settings/components/ProfileGroup/ProfileGroup.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import GraduateIcon from "@/assets/svg/GraduateIcon";
import { triggerHaptic } from "@/utils/haptics";
import { spacing } from "@/utils/theme";
import TitlePickerModal from "@/screens/GameCompletion/components/LevelCard/components/TitlePickerModal";
import { loadUserProfile, updateUserTitle, updateUserAvatar } from "@/utils/profileStorage";
import AvatarPicker from "@/screens/Leistung/components/AvatarPicker";
import { getAvatarUri } from "@/screens/Leistung/utils/avatarStorage";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "@/screens/Leistung/utils/defaultAvatars";
import { loadStats } from "@/utils/storage";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { useProgressColor } from "@/hooks/useProgressColor";

const ProfileGroup: React.FC = () => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();

  // State for AvatarPicker
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // State for TitleSelector
  const [showTitleModal, setShowTitleModal] = useState(false);
  const [selectedTitleIndex, setSelectedTitleIndex] = useState<number | null>(null);
  const [currentLevel, setCurrentLevel] = useState(0);

  // Load data on mount
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

  // Prepare title options for modal
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
      </View>

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
});

export default ProfileGroup;
